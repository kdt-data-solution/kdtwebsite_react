import multer from 'multer';

// In-memory storage; route handlers stream the buffer to Cloudinary.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const ZIP_MIME = new Set([
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/octet-stream', // some browsers send this for .zip
  'multipart/x-zip',
]);

function zipFilter(req, file, cb) {
  const isZipName = /\.zip$/i.test(file.originalname);
  if (!ZIP_MIME.has(file.mimetype) && !isZipName) {
    return cb(new Error('Only .zip files are allowed'));
  }
  cb(null, true);
}

// Separate uploader for prototype archives: larger limit, zip only.
export const uploadZip = multer({
  storage,
  fileFilter: zipFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB compressed
});
