import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Prototypes live under backend/data/prototypes/<slug>/ (data/ is gitignored).
export const prototypesDir = path.resolve(__dirname, '../../data/prototypes');

// Guard rails for extracted archives.
const MAX_FILES = 2000;
const MAX_TOTAL_BYTES = 200 * 1024 * 1024; // 200 MB uncompressed

export function dirForSlug(slug) {
  return path.join(prototypesDir, slug);
}

export function removePrototypeDir(slug) {
  const dir = dirForSlug(slug);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

// Pick the entry file: prefer index.html at the root, else the shallowest .html file.
function pickEntry(relPaths) {
  if (relPaths.includes('index.html')) return 'index.html';
  const htmls = relPaths
    .filter((p) => /\.html?$/i.test(p))
    .sort((a, b) => a.split('/').length - b.split('/').length || a.length - b.length);
  return htmls[0] || null;
}

/**
 * Safely extract a zip buffer into the prototype directory for `slug`.
 * Protects against zip-slip (path traversal) and resource exhaustion.
 * Returns { entry, fileCount, sizeBytes }.
 * Throws on unsafe entries, missing HTML entry, or limit breaches.
 */
export function extractPrototype(buffer, slug) {
  const destDir = dirForSlug(slug);
  const destResolved = path.resolve(destDir);

  let zip;
  try {
    zip = new AdmZip(buffer);
  } catch {
    throw new Error('The uploaded file is not a valid .zip archive');
  }

  const entries = zip.getEntries().filter((e) => !e.isDirectory);
  if (entries.length === 0) throw new Error('The archive is empty');
  if (entries.length > MAX_FILES) {
    throw new Error(`The archive has too many files (limit ${MAX_FILES})`);
  }

  // Validate every entry path before writing anything.
  const planned = [];
  let total = 0;
  for (const entry of entries) {
    // Normalise separators and strip a single leading folder is NOT done —
    // we keep the archive structure as-is so relative links work.
    const normalized = entry.entryName.replace(/\\/g, '/');
    if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
      throw new Error(`Unsafe absolute path in archive: ${entry.entryName}`);
    }
    const target = path.resolve(destDir, normalized);
    if (target !== destResolved && !target.startsWith(destResolved + path.sep)) {
      throw new Error(`Unsafe path in archive (path traversal): ${entry.entryName}`);
    }
    const data = entry.getData();
    total += data.length;
    if (total > MAX_TOTAL_BYTES) {
      throw new Error('The archive is too large when uncompressed (limit 200 MB)');
    }
    planned.push({ rel: normalized, target, data });
  }

  const entryFile = pickEntry(planned.map((p) => p.rel));
  if (!entryFile) {
    throw new Error('No .html file found in the archive (an index.html is recommended)');
  }

  // Clean any previous extraction for this slug, then write.
  removePrototypeDir(slug);
  fs.mkdirSync(destDir, { recursive: true });
  for (const { target, data } of planned) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
  }

  return { entry: entryFile, fileCount: planned.length, sizeBytes: total };
}
