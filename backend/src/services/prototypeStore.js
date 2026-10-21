import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Prototypes live under backend/data/prototypes/<slug>/ (data/ is gitignored).
export const prototypesDir = path.resolve(process.env.PROTOTYPES_DIR || path.resolve(__dirname, '../../data/prototypes'));
// Keep archives outside the directory served by the public prototype router.
export const prototypeArchivesDir = path.join(path.dirname(prototypesDir), 'prototype-archives');

// Guard rails for extracted archives.
const MAX_FILES = 2000;
const MAX_TOTAL_BYTES = 200 * 1024 * 1024; // 200 MB uncompressed

export function dirForSlug(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9_-]{1,64}$/i.test(slug)) {
    throw new Error('Invalid prototype slug');
  }
  return path.join(prototypesDir, slug);
}

export function archiveForSlug(slug) {
  dirForSlug(slug); // Validate before building a filesystem path.
  return path.join(prototypeArchivesDir, `${slug}.zip`);
}

export function removePrototypeDir(slug) {
  const dir = dirForSlug(slug);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  fs.rmSync(archiveForSlug(slug), { force: true });
}

// Older uploads only retained extracted files. Rebuild and cache their ZIP once.
export function getPrototypeArchive(slug) {
  const archivePath = archiveForSlug(slug);
  if (fs.existsSync(archivePath)) {
    return fs.lstatSync(archivePath).isFile() ? archivePath : null;
  }
  const dir = dirForSlug(slug);
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) return null;
  const zip = new AdmZip();
  let fileCount = 0;
  let sizeBytes = 0;
  function addFiles(folder, prefix = '') {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      const relative = prefix + entry.name;
      if (entry.isDirectory()) addFiles(filename, relative + '/');
      else if (entry.isFile()) {
        if (++fileCount > MAX_FILES) throw new Error('Prototype has too many files to archive');
        sizeBytes += fs.statSync(filename).size;
        if (sizeBytes > MAX_TOTAL_BYTES) throw new Error('Prototype is too large to archive');
        zip.addFile(relative, fs.readFileSync(filename));
      }
      // Never follow symbolic links to files outside the prototype.
    }
  }
  addFiles(dir);
  if (!fileCount) return null;
  fs.mkdirSync(prototypeArchivesDir, { recursive: true, mode: 0o700 });
  const temporary = `${archivePath}.${randomUUID()}.tmp`;
  try {
    zip.writeZip(temporary);
    fs.renameSync(temporary, archivePath);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
  return archivePath;
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
  try {
    fs.mkdirSync(destDir, { recursive: true });
    for (const { target, data } of planned) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, data);
    }
    fs.mkdirSync(prototypeArchivesDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(archiveForSlug(slug), buffer, { mode: 0o600 });
  } catch (err) {
    removePrototypeDir(slug);
    throw err;
  }

  return { entry: entryFile, fileCount: planned.length, sizeBytes: total };
}

// Stage the new site first, and restore both old paths if promotion or the
// synchronous metadata commit fails. Staging slugs never get public DB records.
export function replacePrototype(buffer, slug, commit) {
  const stagingSlug = `staged-${randomUUID()}`;
  const backupSlug = `backup-${randomUUID()}`;
  const currentDir = dirForSlug(slug);
  const currentArchive = archiveForSlug(slug);
  const stagingDir = dirForSlug(stagingSlug);
  const stagingArchive = archiveForSlug(stagingSlug);
  const backupDir = dirForSlug(backupSlug);
  const backupArchive = archiveForSlug(backupSlug);
  let savedDir = false;
  let savedArchive = false;
  let installedDir = false;
  let installedArchive = false;
  let extracted;
  try {
    try {
      extracted = extractPrototype(buffer, stagingSlug);
    } catch (err) {
      if (!err.code) err.status = 400;
      throw err;
    }
    if (fs.existsSync(currentDir)) {
      fs.renameSync(currentDir, backupDir);
      savedDir = true;
    }
    if (fs.existsSync(currentArchive)) {
      fs.renameSync(currentArchive, backupArchive);
      savedArchive = true;
    }
    fs.renameSync(stagingDir, currentDir);
    installedDir = true;
    fs.renameSync(stagingArchive, currentArchive);
    installedArchive = true;
    commit(extracted);
  } catch (err) {
    if (installedArchive) fs.rmSync(currentArchive, { force: true });
    if (installedDir) fs.rmSync(currentDir, { recursive: true, force: true });
    if (savedDir) fs.renameSync(backupDir, currentDir);
    if (savedArchive) fs.renameSync(backupArchive, currentArchive);
    throw err;
  } finally {
    try { removePrototypeDir(stagingSlug); } catch { /* retain inaccessible staging files */ }
  }
  // A cleanup failure must not report that an already committed update failed.
  try { removePrototypeDir(backupSlug); } catch { /* retain inaccessible backup */ }
  return extracted;
}
