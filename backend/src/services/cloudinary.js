import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return true;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('[cloudinary] credentials missing — uploads will fail.');
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  return true;
}

/**
 * Upload an in-memory file buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} originalname
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export function uploadBuffer(buffer, originalname = 'upload') {
  if (!ensureConfigured()) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'kdt',
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete a Cloudinary asset by URL or public_id.
 */
export async function destroyAsset(urlOrId) {
  if (!urlOrId) return;
  if (!ensureConfigured()) return;
  const publicId = urlOrId.includes('res.cloudinary.com')
    ? extractPublicId(urlOrId)
    : urlOrId;
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[cloudinary] destroy failed:', err.message);
  }
}

function extractPublicId(url) {
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
  const m = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return m ? m[1] : null;
}
