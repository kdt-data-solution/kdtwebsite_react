import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer, destroyAsset } from '../services/cloudinary.js';

const router = Router();

const insert = db.prepare(`
  INSERT INTO articles (slug, title, author, date, category, tags, image_url, body)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateStmt = db.prepare(`
  UPDATE articles
  SET slug = ?, title = ?, author = ?, date = ?, category = ?, tags = ?, image_url = ?, body = ?
  WHERE id = ?
`);
const removeStmt = db.prepare('DELETE FROM articles WHERE id = ?');
const findById = db.prepare('SELECT * FROM articles WHERE id = ?');
const findBySlug = db.prepare('SELECT * FROM articles WHERE slug = ?');
const listAll = db.prepare('SELECT * FROM articles ORDER BY id DESC');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function uniqueSlug(base, ignoreId = null) {
  let slug = base || 'article';
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
    const { title, author = '', date = '', category = 'data', tags = '', body = '' } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const slug = uniqueSlug(slugify(req.body.slug || title));

    let image_url = null;
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, req.file.originalname);
      image_url = result.url;
    }

    const result = insert.run(slug, title, author, date, category, tags, image_url, body);
    res.status(201).json(findById.get(result.lastInsertRowid));
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });

    const title = req.body.title ?? existing.title;
    const author = req.body.author ?? existing.author;
    const date = req.body.date ?? existing.date;
    const category = req.body.category ?? existing.category;
    const tags = req.body.tags ?? existing.tags;
    const body = req.body.body ?? existing.body;
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

    updateStmt.run(slug, title, author, date, category, tags, image_url, body, id);
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
