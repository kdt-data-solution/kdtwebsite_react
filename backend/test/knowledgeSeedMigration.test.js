import test from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { KNOWLEDGE_SEEDS } from '../src/db/knowledgeSeeds.js';
import { LEGACY_KNOWLEDGE_SEEDS, seedKnowledgeEntries } from '../src/db/knowledgeMigrations.js';

test('legacy knowledge migration updates only untouched published seed bodies', () => {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE knowledge_base_entries (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      product_slug TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL,
      source_note TEXT NOT NULL,
      is_published INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    )
    ;
    CREATE TABLE knowledge_base_seed_state (
      key TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  const insert = db.prepare(`
    INSERT INTO knowledge_base_entries
      (slug, title, body, keywords, source_note, is_published, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const legacyBySlug = new Map(LEGACY_KNOWLEDGE_SEEDS.map((entry) => [entry.slug, entry]));
  const currentBySlug = new Map(KNOWLEDGE_SEEDS.map((entry) => [entry.slug, entry]));

  const untouched = legacyBySlug.get('axisstruct-product-overview');
  const customized = legacyBySlug.get('kuwalog-product-overview');
  const draft = legacyBySlug.get('nexus-product-overview');
  const editedBody = legacyBySlug.get('takeoff-product-overview');

  insert.run(untouched.slug, untouched.title, untouched.body, untouched.keywords, 'PRIVATE_AXIS_SOURCE', 1, 'before');
  insert.run(customized.slug, 'Admin title', customized.body, 'admin keywords', 'PRIVATE_KUWALOG_SOURCE', 1, 'before');
  insert.run(draft.slug, draft.title, draft.body, draft.keywords, 'PRIVATE_DRAFT_SOURCE', 0, 'before');
  insert.run(editedBody.slug, 'Edited title', 'Admin-edited body', 'admin edited keywords', 'PRIVATE_CUSTOM_SOURCE', 1, 'before');

  assert.equal(seedKnowledgeEntries(db), 2);

  const axis = db.prepare('SELECT * FROM knowledge_base_entries WHERE slug = ?').get(untouched.slug);
  const axisCurrent = currentBySlug.get(untouched.slug);
  assert.equal(axis.title, axisCurrent.title);
  assert.equal(axis.body, axisCurrent.body);
  assert.equal(axis.keywords, axisCurrent.keywords);
  assert.equal(axis.source_note, 'PRIVATE_AXIS_SOURCE');
  assert.equal(axis.is_published, 1);
  assert.notEqual(axis.updated_at, 'before');

  const kuwalog = db.prepare('SELECT * FROM knowledge_base_entries WHERE slug = ?').get(customized.slug);
  assert.equal(kuwalog.title, 'Admin title');
  assert.equal(kuwalog.body, currentBySlug.get(customized.slug).body);
  assert.equal(kuwalog.keywords, 'admin keywords');
  assert.equal(kuwalog.source_note, 'PRIVATE_KUWALOG_SOURCE');
  assert.equal(kuwalog.is_published, 1);

  const nexus = db.prepare('SELECT * FROM knowledge_base_entries WHERE slug = ?').get(draft.slug);
  assert.equal(nexus.body, draft.body);
  assert.equal(nexus.is_published, 0);
  assert.equal(nexus.updated_at, 'before');

  const takeoff = db.prepare('SELECT * FROM knowledge_base_entries WHERE slug = ?').get(editedBody.slug);
  assert.equal(takeoff.title, 'Edited title');
  assert.equal(takeoff.body, 'Admin-edited body');
  assert.equal(takeoff.keywords, 'admin edited keywords');
  assert.equal(takeoff.updated_at, 'before');

  assert.equal(db.prepare('SELECT 1 FROM knowledge_base_entries WHERE slug = ?').get('vantage-product-overview'), undefined);
  const migratedAxis = { ...axis };
  assert.equal(seedKnowledgeEntries(db), 0);
  assert.deepEqual(db.prepare('SELECT * FROM knowledge_base_entries WHERE slug = ?').get(untouched.slug), migratedAxis);
  db.prepare('DELETE FROM knowledge_base_entries').run();
  assert.equal(seedKnowledgeEntries(db), 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM knowledge_base_entries').get().count, 0);
  db.close();
});

test('default knowledge seeds initialize once and deleted seeds stay absent', () => {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE knowledge_base_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      product_slug TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '',
      source_note TEXT NOT NULL DEFAULT '',
      is_published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE knowledge_base_seed_state (
      key TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  assert.equal(seedKnowledgeEntries(db), 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM knowledge_base_entries').get().count, KNOWLEDGE_SEEDS.length);
  db.prepare('DELETE FROM knowledge_base_entries WHERE slug = ?').run('vantage-product-overview');
  assert.equal(seedKnowledgeEntries(db), 0);
  assert.equal(db.prepare('SELECT 1 FROM knowledge_base_entries WHERE slug = ?').get('vantage-product-overview'), undefined);
  db.close();
});
