import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import AdmZip from 'adm-zip';

test('prototype ZIP replacement preserves access and restores the old site on failure', async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kdt-prototype-replacement-'));
  const keys = ['DATABASE_PATH', 'PROTOTYPES_DIR', 'JWT_SECRET'];
  const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.DATABASE_PATH = ':memory:';
  process.env.PROTOTYPES_DIR = path.join(temporary, 'prototypes');
  process.env.JWT_SECRET = 'isolated-prototype-replacement-test';
  t.after(() => {
    fs.rmSync(temporary, { recursive: true, force: true });
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const { default: app } = await import('../src/app.js');
  const { default: db } = await import('../src/db/index.js');
  const { archiveForSlug, dirForSlug, prototypesDir, prototypeArchivesDir } = await import('../src/services/prototypeStore.js');
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    db.close();
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const admin = jwt.sign({ sub: 1, role: 'admin' }, process.env.JWT_SECRET);
  const user = jwt.sign({ sub: 2, role: 'user' }, process.env.JWT_SECRET);
  const headers = { Authorization: `Bearer ${admin}` };
  const password = 'test-only-password';

  function archive(files) {
    const zip = new AdmZip();
    for (const [name, contents] of Object.entries(files)) zip.addFile(name, Buffer.from(contents));
    zip.addZipComment('Keep the original archive metadata.');
    return zip.toBuffer();
  }
  function formFor(buffer, filename = 'replacement.zip') {
    const form = new FormData();
    form.set('archive', new Blob([buffer], { type: 'application/zip' }), filename);
    return form;
  }
  const oldZip = archive({ 'index.html': '<title>Original site</title>', 'obsolete.txt': 'remove on success' });
  const upload = formFor(oldZip, 'original.zip');
  upload.set('title', 'Keep my title');
  upload.set('password', password);
  const uploaded = await fetch(`${base}/api/prototypes`, { method: 'POST', headers, body: upload });
  assert.equal(uploaded.status, 201);
  const prototype = await uploaded.json();
  const url = `${base}/api/prototypes/${prototype.id}`;
  const row = () => db.prepare('SELECT * FROM prototypes WHERE id = ?').get(prototype.id);
  const originalRow = row();
  const unlock = await fetch(`${base}${prototype.url}__unlock`, {
    method: 'POST', redirect: 'manual', body: new URLSearchParams({ password }),
  });
  assert.equal(unlock.status, 302);
  const cookie = unlock.headers.get('set-cookie').split(';')[0];

  async function currentDownload() {
    const response = await fetch(`${url}/download`, { headers });
    assert.equal(response.status, 200);
    return Buffer.from(await response.arrayBuffer());
  }
  function noTemporaryFiles() {
    for (const folder of [prototypesDir, prototypeArchivesDir]) {
      assert.equal(fs.readdirSync(folder).some((name) => /^(staged|backup)-/.test(name)), false);
    }
  }
  async function assertOriginal() {
    assert.deepEqual(row(), originalRow);
    assert.deepEqual(await currentDownload(), oldZip);
    assert.equal(fs.readFileSync(path.join(dirForSlug(prototype.slug), 'index.html'), 'utf8'), '<title>Original site</title>');
    assert.equal(fs.existsSync(path.join(dirForSlug(prototype.slug), 'home.html')), false);
    noTemporaryFiles();
  }

  await t.test('requires admin authentication and a valid target and archive', async () => {
    assert.equal((await fetch(url, { method: 'PUT' })).status, 401);
    assert.equal((await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${user}` } })).status, 403);
    assert.equal((await fetch(`${base}/api/prototypes/invalid`, { method: 'PUT', headers })).status, 400);
    assert.equal((await fetch(`${base}/api/prototypes/999`, { method: 'PUT', headers })).status, 404);
    assert.equal((await fetch(url, { method: 'PUT', headers })).status, 400);
    await assertOriginal();
  });

  await t.test('rejects invalid archives without touching the current files or metadata', async () => {
    for (const buffer of [Buffer.from('not a ZIP'), archive({ 'readme.txt': 'No HTML entry' })]) {
      const response = await fetch(url, { method: 'PUT', headers, body: formFor(buffer) });
      assert.equal(response.status, 400);
      assert.ok((await response.json()).error);
      await assertOriginal();
    }
  });

  const newHtml = '<title>Replacement site</title>';
  const newAsset = Buffer.from([0, 255, 3, 128, 10]);
  const newZip = archive({ 'home.html': newHtml, 'assets/new.bin': newAsset });
  await t.test('restores files and ZIP when the metadata update fails', async () => {
    db.exec("CREATE TEMP TRIGGER reject_replacement BEFORE UPDATE ON prototypes BEGIN SELECT RAISE(ABORT, 'simulated metadata failure'); END");
    try {
      const response = await fetch(url, { method: 'PUT', headers, body: formFor(newZip) });
      assert.equal(response.status, 500);
      await assertOriginal();
    } finally {
      db.exec('DROP TRIGGER reject_replacement');
    }
  });

  await t.test('replaces a legacy upload while preserving its link, password, title, and creation date', async () => {
    // Older prototypes have no saved original ZIP. Their files can still be replaced.
    fs.unlinkSync(archiveForSlug(prototype.slug));
    const response = await fetch(url, { method: 'PUT', headers, body: formFor(newZip, 'new site.zip') });
    assert.equal(response.status, 200);
    const updated = await response.json();
    for (const key of ['id', 'slug', 'title', 'url', 'created_at']) assert.equal(updated[key], prototype[key]);
    assert.equal(updated.password_hash, undefined);
    assert.equal(row().password_hash, originalRow.password_hash);
    assert.equal(updated.entry, 'home.html');
    assert.equal(updated.original_filename, 'new site.zip');
    assert.equal(updated.file_count, 2);
    assert.equal(updated.size_bytes, Buffer.byteLength(newHtml) + newAsset.length);
    assert.deepEqual(await currentDownload(), newZip);
    assert.equal(fs.existsSync(path.join(dirForSlug(prototype.slug), 'obsolete.txt')), false);
    assert.equal(fs.existsSync(path.join(dirForSlug(prototype.slug), 'index.html')), false);
    assert.deepEqual(fs.readFileSync(path.join(dirForSlug(prototype.slug), 'assets/new.bin')), newAsset);
    assert.equal((await fetch(`${base}${prototype.url}`)).status, 401);
    const site = await fetch(`${base}${prototype.url}`, { headers: { Cookie: cookie } });
    assert.equal(site.status, 200);
    assert.equal(await site.text(), newHtml);
    const unlockAgain = await fetch(`${base}${prototype.url}__unlock`, {
      method: 'POST', redirect: 'manual', body: new URLSearchParams({ password }),
    });
    assert.equal(unlockAgain.status, 302);
    noTemporaryFiles();
  });

  await t.test('updates an already retained ZIP again and removes the previous files and backups', async () => {
    const response = await fetch(url, { method: 'PUT', headers, body: formFor(oldZip, 'original.zip') });
    assert.equal(response.status, 200);
    await assertOriginal();
    assert.equal(fs.existsSync(path.join(dirForSlug(prototype.slug), 'assets/new.bin')), false);
  });
});
