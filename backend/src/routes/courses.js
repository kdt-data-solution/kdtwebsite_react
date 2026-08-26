import { Router } from 'express';
import db from '../db/index.js';

const router = Router();
const listAll = db.prepare('SELECT * FROM courses ORDER BY id ASC');
const findBySlug = db.prepare('SELECT * FROM courses WHERE slug = ?');

function parse(value) {
  try { return JSON.parse(value || '[]'); } catch { return []; }
}

function hydrate(row) {
  if (!row) return row;
  return {
    ...row,
    desc: row.description || '',
    image: row.image_url || '',
    tags: parse(row.tags_json),
    startDate: row.start_date || '',
    inclusions: parse(row.inclusions_json),
    registerHref: row.register_url || '',
    topics: parse(row.topics_json),
  };
}

router.get('/', (req, res, next) => {
  try { res.json(listAll.all().map(hydrate)); } catch (err) { next(err); }
});

router.get('/slug/:slug', (req, res, next) => {
  try {
    const row = findBySlug.get(req.params.slug);
    if (!row) return res.status(404).json({ error: 'course not found' });
    res.json(hydrate(row));
  } catch (err) { next(err); }
});

export default router;
