import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const insert = db.prepare(
  'INSERT INTO services (slug, title, description, offerings_json) VALUES (?, ?, ?, ?)'
);
const updateStmt = db.prepare(
  'UPDATE services SET slug = ?, title = ?, description = ?, offerings_json = ? WHERE id = ?'
);
const removeStmt = db.prepare('DELETE FROM services WHERE id = ?');
const findById = db.prepare('SELECT * FROM services WHERE id = ?');
const findBySlug = db.prepare('SELECT * FROM services WHERE slug = ?');
const listAll = db.prepare('SELECT * FROM services ORDER BY id ASC');

function hydrate(row) {
  if (!row) return row;
  return { ...row, offerings: safeJson(row.offerings_json, []) };
}
function safeJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}
function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function uniqueSlug(base, ignoreId = null) {
  let slug = base || 'service';
  let n = 1;
  while (true) {
    const existing = findBySlug.get(slug);
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
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

router.post('/', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const { title, description = '', offerings = [] } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const slug = uniqueSlug(slugify(req.body.slug || title));
    const r = insert.run(slug, title, description, JSON.stringify(offerings || []));
    res.status(201).json(hydrate(findById.get(r.lastInsertRowid)));
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = findById.get(id);
    if (!existing) return res.status(404).json({ error: 'not found' });
    const title = req.body.title ?? existing.title;
    const description = req.body.description ?? existing.description;
    const offerings = req.body.offerings ?? safeJson(existing.offerings_json, []);
    const slug = req.body.slug ? uniqueSlug(slugify(req.body.slug), id) : existing.slug;
    updateStmt.run(slug, title, description, JSON.stringify(offerings || []), id);
    res.json(hydrate(findById.get(id)));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!findById.get(id)) return res.status(404).json({ error: 'not found' });
    removeStmt.run(id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
