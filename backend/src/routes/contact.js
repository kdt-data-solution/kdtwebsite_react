import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendMail } from '../services/mailer.js';
import { contactNotificationEmail, getEmailAttachments } from '../services/emailTemplates.js';

const router = Router();

const insertMessage = db.prepare(
  'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
);
const listMessages = db.prepare(
  'SELECT id, name, email, message, created_at FROM contact_messages ORDER BY id DESC LIMIT 100'
);

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    const result = insertMessage.run(name, email, message);

    // Fire-and-log: don't fail the request if email sending fails.
    const to = process.env.MAIL_TO;
    if (to) {
      const tpl = contactNotificationEmail({ name, email, message });
      sendMail({
        to,
        replyTo: email,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
        attachments: getEmailAttachments(),
      }).then((r) => {
        if (!r.ok && !r.skipped) console.error('[contact] mail send failed:', r.error);
      }).catch((err) => {
        console.error('[contact] mail send error:', err.message);
      });
    }

    res.status(201).json({ ok: true, id: result.lastInsertRowid });
  } catch (err) {
    next(err);
  }
});


router.get('/', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    res.json(listMessages.all());
  } catch (err) {
    next(err);
  }
});

const deleteMessage = db.prepare('DELETE FROM contact_messages WHERE id = ?');
router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const result = deleteMessage.run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
