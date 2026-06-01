import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadZip } from '../middleware/upload.js';
import { extractPrototype, removePrototypeDir } from '../services/prototypeStore.js';

const router = Router();

const insert = db.prepare(`
  INSERT INTO prototypes (slug, title, password_hash, entry, original_filename, file_count, size_bytes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const findById = db.prepare('SELECT * FROM prototypes WHERE id = ?');
const findBySlug = db.prepare('SELECT * FROM prototypes WHERE slug = ?');
const listAll = db.prepare('SELECT * FROM prototypes ORDER BY id DESC');
const removeStmt = db.prepare('DELETE FROM prototypes WHERE id = ?');

// Public-safe shape (never expose password_hash).
function publicShape(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    entry: p.entry,
    original_filename: p.original_filename,
    file_count: p.file_count,
    size_bytes: p.size_bytes,
    url: `/p/${p.slug}/`,
    created_at: p.created_at,
  };
}

function makeSlug() {
  // 9 url-safe chars, unguessable. Retry on the rare collision.
  for (let i = 0; i < 5; i++) {
    const slug = crypto.randomBytes(7).toString('base64url').slice(0, 9).toLowerCase();
    if (!findBySlug.get(slug)) return slug;
  }
  throw new Error('Could not generate a unique slug');
}

router.get('/', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    res.json(listAll.all().map(publicShape));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, requireRole('admin'), uploadZip.single('archive'), async (req, res, next) => {
  try {
    const title = (req.body.title || '').trim();
    const password = req.body.password || '';
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
    if (!req.file) return res.status(400).json({ error: 'A .zip file is required' });

    const slug = makeSlug();
    let extracted;
    try {
      extracted = extractPrototype(req.file.buffer, slug);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const password_hash = await bcrypt.hash(password, 10);
    try {
      const result = insert.run(
        slug, title, password_hash, extracted.entry,
        req.file.originalname, extracted.fileCount, extracted.sizeBytes,
      );
      res.status(201).json(publicShape(findById.get(result.lastInsertRowid)));
    } catch (err) {
      removePrototypeDir(slug); // roll back files if the DB insert fails
      throw err;
    }
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });
    removeStmt.run(id);
    removePrototypeDir(existing.slug);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
