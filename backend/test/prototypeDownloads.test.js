import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import AdmZip from 'adm-zip';

test('admin ZIP downloads retain original uploads and support older extracted prototypes', async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kdt-prototype-downloads-'));
  const keys = ['DATABASE_PATH', 'PROTOTYPES_DIR', 'JWT_SECRET'];
  const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.DATABASE_PATH = ':memory:';
  process.env.PROTOTYPES_DIR = path.join(temporary, 'prototypes');
  process.env.JWT_SECRET = 'isolated-prototype-download-test';
  t.after(() => {
    fs.rmSync(temporary, { recursive: true, force: true });
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const { default: app } = await import('../src/app.js');
  const { default: db } = await import('../src/db/index.js');
  const { archiveForSlug, dirForSlug, removePrototypeDir } = await import('../src/services/prototypeStore.js');
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
  assert.equal((await fetch(`${base}/api/prototypes/1/download`)).status, 401);
  assert.equal((await fetch(`${base}/api/prototypes/1/download`, { headers: { Authorization: `Bearer ${user}` } })).status, 403);
  assert.equal((await fetch(`${base}/api/prototypes/invalid/download`, { headers })).status, 400);
  assert.equal((await fetch(`${base}/api/prototypes/999/download`, { headers })).status, 404);

  const html = Buffer.from('<!doctype html><title>ZIP test</title>');
  const binary = Buffer.from([0, 255, 3, 128, 10]);
  const zip = new AdmZip();
  zip.addFile('site/index.html', html);
  zip.addFile('site/assets/example.bin', binary);
  zip.addZipComment('Original upload metadata must survive the download.');
  const originalZip = zip.toBuffer();

  async function upload() {
    const form = new FormData();
    form.set('title', 'Download test');
    form.set('password', 'test-only-password');
    form.set('archive', new Blob([originalZip], { type: 'application/zip' }), 'my prototype.zip');
    const response = await fetch(`${base}/api/prototypes`, { method: 'POST', headers, body: form });
    assert.equal(response.status, 201);
    return response.json();
  }
  const prototype = await upload();
  assert.equal(prototype.password_hash, undefined);
  const url = `${base}/api/prototypes/${prototype.id}/download`;
  const download = await fetch(url, { headers });
  assert.equal(download.status, 200);
  assert.match(download.headers.get('content-type'), /application\/zip/);
  assert.match(download.headers.get('content-disposition'), /attachment;.*my prototype\.zip/);
  assert.equal(download.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), originalZip);
  assert.equal(fs.existsSync(path.join(dirForSlug(prototype.slug), `${prototype.slug}.zip`)), false);

  // Simulate an upload from before the server retained the original ZIP.
  fs.unlinkSync(archiveForSlug(prototype.slug));
  const legacy = await fetch(url, { headers });
  assert.equal(legacy.status, 200);
  const rebuilt = new AdmZip(Buffer.from(await legacy.arrayBuffer()));
  assert.deepEqual(rebuilt.readFile('site/index.html'), html);
  assert.deepEqual(rebuilt.readFile('site/assets/example.bin'), binary);
  assert.equal(fs.existsSync(archiveForSlug(prototype.slug)), true);

  assert.equal((await fetch(`${base}/api/prototypes/${prototype.id}`, { method: 'DELETE', headers })).status, 200);
  assert.equal(fs.existsSync(dirForSlug(prototype.slug)), false);
  assert.equal(fs.existsSync(archiveForSlug(prototype.slug)), false);
  assert.equal((await fetch(url, { headers })).status, 404);

  const missing = await upload();
  removePrototypeDir(missing.slug);
  const unavailable = await fetch(`${base}/api/prototypes/${missing.id}/download`, { headers });
  assert.equal(unavailable.status, 404);
  assert.match((await unavailable.json()).error, /no longer available/);
});
