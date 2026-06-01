import { Router } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { dirForSlug } from '../services/prototypeStore.js';

const router = Router();

const findBySlug = db.prepare('SELECT * FROM prototypes WHERE slug = ?');

function cookieName(slug) {
  return `kdt_proto_${slug}`;
}

function parseCookies(header = '') {
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

function isUnlocked(req, slug) {
  const token = parseCookies(req.headers.cookie)[cookieName(slug)];
  if (!token) return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.t === 'proto' && payload.slug === slug;
  } catch {
    return false;
  }
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function gatePage(slug, title, { error = false } = {}) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>${esc(title)} — Prototype</title>
<style>
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    background:#0f0f0f;color:#111;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:1rem}
  .card{background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.35);max-width:380px;width:100%;padding:2rem}
  h1{font-size:1.15rem;margin:0 0 .25rem} p{margin:0 0 1.25rem;color:#666;font-size:.85rem}
  label{display:block;font-size:.75rem;font-weight:600;color:#444;margin-bottom:.35rem}
  input{width:100%;padding:.7rem .8rem;font-size:.95rem;border:1px solid #d4d4d4;border-radius:8px;outline:none}
  input:focus{border-color:#111;box-shadow:0 0 0 1px #111}
  button{width:100%;margin-top:1rem;padding:.75rem;font-size:.9rem;font-weight:600;color:#fff;background:#111;
    border:none;border-radius:8px;cursor:pointer} button:hover{opacity:.9}
  .err{color:#dc2626;font-size:.8rem;margin-top:.75rem;${error ? '' : 'display:none'}}
</style></head>
<body>
  <form class="card" method="POST" action="/p/${esc(slug)}/__unlock">
    <h1>${esc(title)}</h1>
    <p>This prototype is password-protected. Enter the password to view it.</p>
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autofocus autocomplete="off" />
    <p class="err">Incorrect password. Please try again.</p>
    <button type="submit">View prototype</button>
  </form>
</body></html>`;
}

router.use('/:slug', async (req, res, next) => {
  const { slug } = req.params;
  const proto = findBySlug.get(slug);

  // Strip helmet's CSP so arbitrary prototype markup/scripts run as authored.
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');

  if (!proto) {
    return res.status(404).type('html').send('<h1>404 — Prototype not found</h1>');
  }

  // Handle the unlock form submission.
  if (req.method === 'POST' && req.path === '/__unlock') {
    const password = req.body?.password || '';
    const ok = await bcrypt.compare(password, proto.password_hash);
    if (!ok) {
      return res.status(401).type('html').send(gatePage(slug, proto.title, { error: true }));
    }
    const token = jwt.sign({ t: 'proto', slug }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.setHeader('Set-Cookie',
      `${cookieName(slug)}=${token}; HttpOnly; Path=/p/${slug}; SameSite=Lax; Max-Age=43200`);
    return res.redirect(`/p/${slug}/`);
  }

  // Gate everything else behind the unlock cookie.
  if (!isUnlocked(req, slug)) {
    return res.status(401).type('html').send(gatePage(slug, proto.title));
  }

  // Ensure a trailing slash so relative asset links resolve correctly.
  if (req.path === '/' && !req.originalUrl.replace(/\?.*$/, '').endsWith('/')) {
    return res.redirect(301, req.originalUrl.replace(/(\?|$)/, '/$1'));
  }

  // Serve the extracted static files.
  return express.static(dirForSlug(slug), { index: proto.entry, fallthrough: false })(req, res, next);
});

export default router;
