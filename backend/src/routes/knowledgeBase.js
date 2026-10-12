import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { PUBLIC_PRODUCT_CATALOG } from '../data/publicProductCatalog.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

const selectAll = db.prepare('SELECT * FROM knowledge_base_entries ORDER BY updated_at DESC, id DESC');
const selectById = db.prepare('SELECT * FROM knowledge_base_entries WHERE id = ?');
const insert = db.prepare(`
  INSERT INTO knowledge_base_entries
    (slug, title, body, product_slug, keywords, source_note, is_published)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const update = db.prepare(`
  UPDATE knowledge_base_entries
  SET title = ?, body = ?, product_slug = ?, keywords = ?, source_note = ?,
      is_published = ?, updated_at = datetime('now')
  WHERE id = ?
`);
const remove = db.prepare('DELETE FROM knowledge_base_entries WHERE id = ?');
const allowedProducts = new Set(PUBLIC_PRODUCT_CATALOG.map((product) => product.slug));

function normalize(body = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) body = {};
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.body === 'string' ? body.body.trim() : '';
  const productSlug = typeof body.product_slug === 'string' ? body.product_slug.trim() : '';
  const keywords = typeof body.keywords === 'string' ? body.keywords.trim() : '';
  const sourceNote = typeof body.source_note === 'string' ? body.source_note.trim() : '';
  if (!title || title.length > 160) return { error: 'Title is required and must be at most 160 characters.' };
  if (!content || content.length > 6000) return { error: 'Content is required and must be at most 6,000 characters.' };
  if (productSlug && !allowedProducts.has(productSlug)) return { error: 'Choose a valid product or leave it blank.' };
  if (keywords.length > 600) return { error: 'Keywords must be at most 600 characters.' };
  if (sourceNote.length > 1200) return { error: 'Source notes must be at most 1,200 characters.' };
  if (typeof body.is_published !== 'boolean') return { error: 'Publication status must be true or false.' };
  return { value: { title, body: content, product_slug: productSlug, keywords, source_note: sourceNote, is_published: body.is_published } };
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 96) || 'knowledge-entry';
}

router.get('/', (req, res, next) => {
  try { res.json(selectAll.all()); } catch (error) { next(error); }
});

router.post('/', (req, res, next) => {
  const normalized = normalize(req.body);
  if (normalized.error) return res.status(400).json({ error: normalized.error });
  const value = normalized.value;
  let slug = slugify(value.title);
  if (db.prepare('SELECT 1 FROM knowledge_base_entries WHERE slug = ?').get(slug)) {
    slug = `${slug.slice(0, 82)}-${Date.now().toString(36)}`;
  }
  try {
    const result = insert.run(slug, value.title, value.body, value.product_slug, value.keywords, value.source_note, Number(value.is_published));
    res.status(201).json(selectById.get(result.lastInsertRowid));
  } catch (error) { next(error); }
});

router.put('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'A valid entry ID is required.' });
  const normalized = normalize(req.body);
  if (normalized.error) return res.status(400).json({ error: normalized.error });
  const value = normalized.value;
  try {
    const result = update.run(value.title, value.body, value.product_slug, value.keywords, value.source_note, Number(value.is_published), id);
    if (!result.changes) return res.status(404).json({ error: 'Knowledge entry not found.' });
    res.json(selectById.get(id));
  } catch (error) { next(error); }
});

router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'A valid entry ID is required.' });
  try {
    const result = remove.run(id);
    if (!result.changes) return res.status(404).json({ error: 'Knowledge entry not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
