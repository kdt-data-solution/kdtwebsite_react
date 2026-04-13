import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from '../src/db/index.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Administrator';

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env');
  process.exit(1);
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters');
  process.exit(1);
}

const existing = db.prepare('SELECT id, role FROM users WHERE email = ?').get(email);
const password_hash = await bcrypt.hash(password, 10);

if (existing) {
  db.prepare(
    'UPDATE users SET password_hash = ?, name = ?, role = ? WHERE id = ?'
  ).run(password_hash, name, 'admin', existing.id);
  console.log(`Updated admin user: ${email}`);
} else {
  const result = db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')"
  ).run(email, password_hash, name);
  console.log(`Created admin user: ${email} (id=${result.lastInsertRowid})`);
}

process.exit(0);
