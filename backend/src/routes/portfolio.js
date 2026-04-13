import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer, destroyAsset } from '../services/cloudinary.js';

const router = Router();

const insert = db.prepare(`
  INSERT INTO portfolio_items (slug, title, category, description, image_url, date, tags)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const updateStmt = db.prepare(`
  UPDATE portfolio_items
  SET slug = ?, title = ?, category = ?, description = ?, image_url = ?, date = ?, tags = ?
  WHERE id = ?
`);
const removeStmt = db.prepare('DELETE FROM portfolio_items WHERE id = ?');
const findById = db.prepare('SELECT * FROM portfolio_items WHERE id = ?');
const findBySlug = db.prepare('SELECT * FROM portfolio_items WHERE slug = ?');
const listAll = db.prepare('SELECT * FROM portfolio_items ORDER BY id DESC');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function uniqueSlug(base, ignoreId = null) {
  let slug = base || 'item';
  let n = 1;
  while (true) {
    const existing = findBySlug.get(slug);
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

router.get('/', (req, res, next) => {
  try { res.json(listAll.all()); } catch (err) { next(err); }
});

router.get('/slug/:slug', (req, res, next) => {
  try {
    const item = findBySlug.get(req.params.slug);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  } catch (err) { next(err); }
});

router.get('/:id', (req, res, next) => {
  try {
    const item = findById.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const { title, category = 'software', description = '', date = '', tags = '' } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const slug = uniqueSlug(slugify(req.body.slug || title));

    let image_url = null;
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, req.file.originalname);
      image_url = result.url;
    }

    const result = insert.run(slug, title, category, description, image_url, date, tags);
    res.status(201).json(findById.get(result.lastInsertRowid));
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });

    const title = req.body.title ?? existing.title;
    const category = req.body.category ?? existing.category;
    const description = req.body.description ?? existing.description;
    const date = req.body.date ?? existing.date;
    const tags = req.body.tags ?? existing.tags;
    const slug = req.body.slug ? uniqueSlug(slugify(req.body.slug), id) : existing.slug;

    let image_url = existing.image_url;
    if (req.body.remove_image === 'true' && !req.file) {
      destroyAsset(existing.image_url);
      image_url = null;
    } else if (req.file) {
      const result = await uploadBuffer(req.file.buffer, req.file.originalname);
      image_url = result.url;
      destroyAsset(existing.image_url);
    }

    updateStmt.run(slug, title, category, description, image_url, date, tags, id);
    res.json(findById.get(id));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });
    destroyAsset(existing.image_url);
    removeStmt.run(id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
