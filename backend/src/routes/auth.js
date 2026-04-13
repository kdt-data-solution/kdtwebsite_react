import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findById = db.prepare(
  'SELECT id, email, name, role, created_at FROM users WHERE id = ?'
);
const findByIdFull = db.prepare('SELECT * FROM users WHERE id = ?');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const row = findByEmail.get(email);
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const user = findById.get(row.id);
    const token = signToken(user);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  const user = findById.get(req.user.sub);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ user });
});

const updatePassword = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
const updateProfile = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');

router.put('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'current_password and new_password are required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'new password must be at least 8 characters' });
    }
    const row = findByIdFull.get(req.user.sub);
    if (!row) return res.status(404).json({ error: 'user not found' });

    const ok = await bcrypt.compare(current_password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 10);
    updatePassword.run(hash, req.user.sub);
    res.json({ ok: true, message: 'Password updated' });
  } catch (err) { next(err); }
});

router.put('/profile', requireAuth, (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    updateProfile.run(name || '', email, req.user.sub);
    const user = findById.get(req.user.sub);
    res.json({ user });
  } catch (err) { next(err); }
});

export default router;
