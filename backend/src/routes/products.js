import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer, destroyAsset } from '../services/cloudinary.js';
import { parseJsonList } from '../utils/json.js';

const router = Router();

const insert = db.prepare(`
  INSERT INTO products (slug, title, description, category, date, features, actions_json, steps_json, benefits_json, benefits_title, benefits_blurb, image_url, coming_soon)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateStmt = db.prepare(`
  UPDATE products
  SET slug = ?, title = ?, description = ?, category = ?, date = ?, features = ?, actions_json = ?, steps_json = ?, benefits_json = ?, benefits_title = ?, benefits_blurb = ?, image_url = ?, coming_soon = ?
  WHERE id = ?
`);
const removeStmt = db.prepare('DELETE FROM products WHERE id = ?');
const findById = db.prepare('SELECT * FROM products WHERE id = ?');
const findBySlug = db.prepare('SELECT * FROM products WHERE slug = ?');
const listAll = db.prepare('SELECT * FROM products ORDER BY id ASC');

function hydrate(row) {
  if (!row) return row;
  return {
    ...row,
    actions: parseJsonList(row.actions_json),
    steps: parseJsonList(row.steps_json),
    benefits: parseJsonList(row.benefits_json),
    coming_soon: !!row.coming_soon,
  };
}
function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function uniqueSlug(base, ignoreId = null) {
  let slug = base || 'product';
  let n = 1;
  while (true) {
    const existing = findBySlug.get(slug);
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

// Multipart bodies arrive as strings — parse JSON fields if present.
function parseField(v, fallback) {
  if (v == null) return fallback;
  return parseJsonList(v, fallback);
}

router.get('/', (req, res, next) => {
  try { res.json(listAll.all().map(hydrate)); } catch (err) { next(err); }
});
router.get('/slug/:slug', (req, res, next) => {
  try {
    const item = findBySlug.get(req.params.slug);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(hydrate(item));
  } catch (err) { next(err); }
});
router.get('/:id', (req, res, next) => {
  try {
    const item = findById.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(hydrate(item));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const { title, description = '', category = 'software', date = '', features = '', benefits_title = '', benefits_blurb = '' } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const actions = parseField(req.body.actions, []);
    const steps = parseField(req.body.steps, []);
    const benefits = parseField(req.body.benefits, []);
    const coming_soon = req.body.coming_soon === 'true' || req.body.coming_soon === '1' ? 1 : 0;
    const slug = uniqueSlug(slugify(req.body.slug || title));

    let image_url = null;
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, req.file.originalname);
      image_url = result.url;
    }

    const r = insert.run(
      slug, title, description, category, date, features,
      JSON.stringify(actions), JSON.stringify(steps), JSON.stringify(benefits),
      benefits_title, benefits_blurb, image_url, coming_soon
    );
    res.status(201).json(hydrate(findById.get(r.lastInsertRowid)));
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, requireRole('admin'), upload.single('image'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });

    const title = req.body.title ?? existing.title;
    const description = req.body.description ?? existing.description;
    const category = req.body.category ?? existing.category;
    const date = req.body.date ?? existing.date;
    const features = req.body.features ?? existing.features;
    const benefits_title = req.body.benefits_title ?? existing.benefits_title;
    const benefits_blurb = req.body.benefits_blurb ?? existing.benefits_blurb;
    const actions = parseField(req.body.actions, parseJsonList(existing.actions_json));
    const steps = parseField(req.body.steps, parseJsonList(existing.steps_json));
    const benefits = parseField(req.body.benefits, parseJsonList(existing.benefits_json));
    const coming_soon = req.body.coming_soon != null
      ? (req.body.coming_soon === 'true' || req.body.coming_soon === '1' ? 1 : 0)
      : existing.coming_soon;
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

    updateStmt.run(
      slug, title, description, category, date, features,
      JSON.stringify(actions), JSON.stringify(steps), JSON.stringify(benefits),
      benefits_title, benefits_blurb, image_url, coming_soon, id
    );
    res.json(hydrate(findById.get(id)));
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
