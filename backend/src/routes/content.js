import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

const listAll = db.prepare(`
  SELECT * FROM content_sections
  WHERE is_active = 1
  ORDER BY page ASC, display_order ASC, id ASC
`);
const listByPage = db.prepare(`
  SELECT * FROM content_sections
  WHERE page = ? AND is_active = 1
  ORDER BY display_order ASC, id ASC
`);
const findByKey = db.prepare(`
  SELECT * FROM content_sections
  WHERE key = ? AND is_active = 1
`);

function hydrate(row) {
  if (!row) return row;
  let items = [];
  try { items = JSON.parse(row.items_json || '[]'); } catch {}
  return { ...row, is_active: !!row.is_active, items };
}

router.get('/', (req, res, next) => {
  try {
    const rows = req.query.page ? listByPage.all(req.query.page) : listAll.all();
    res.json(rows.map(hydrate));
  } catch (err) { next(err); }
});

router.get('/:key', (req, res, next) => {
  try {
    const row = findByKey.get(req.params.key);
    if (!row) return res.status(404).json({ error: 'content section not found' });
    res.json(hydrate(row));
  } catch (err) { next(err); }
});

export default router;
