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
    const body = req.body || {};
    if (['name', 'email', 'message'].some((key) =>
      typeof body[key] !== 'string' || !body[key].trim()
    )) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    const name = body.name.trim();
    const email = body.email.trim();
    const message = body.message.trim();
    if (name.length > 200 || email.length > 254 || message.length > 10000 ||
      /[\r\n]/.test(name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid name, email, or message' });
    }

    const enquiry_type = body.enquiry_type === undefined ? 'general' : body.enquiry_type;
    if (!['service', 'product', 'webinar', 'general'].includes(enquiry_type)) {
      return res.status(400).json({ error: 'Invalid enquiry_type' });
    }
    for (const [key, maxLength] of [['enquiry_topic', 200], ['source_page', 500]]) {
      if (body[key] !== undefined && (typeof body[key] !== 'string' ||
        body[key].length > maxLength || /[\r\n]/.test(body[key]))) {
        return res.status(400).json({ error: `Invalid ${key}` });
      }
    }
    const enquiry_topic = body.enquiry_topic?.trim() || '';
    const source_page = body.source_page?.trim() || '';
    if (source_page && (!source_page.startsWith('/') || source_page.startsWith('//'))) {
      return res.status(400).json({ error: 'Invalid source_page' });
    }
    const context = [
      `Enquiry type: ${enquiry_type}`,
      enquiry_topic && `Topic: ${enquiry_topic}`,
      source_page && `Source page: ${source_page}`,
    ].filter(Boolean).join('\n');
    const result = insertMessage.run(name, email, `${context}\n\n${message}`);

    let notification = 'unconfigured';
    const to = process.env.MAIL_TO?.trim();
    if (to) {
      const tpl = contactNotificationEmail({ name, email, message, enquiry_type, enquiry_topic, source_page });
      try {
        const mail = await sendMail({
          to,
          replyTo: email,
          subject: tpl.subject,
          text: tpl.text,
          html: tpl.html,
          attachments: getEmailAttachments(),
        });
        notification = mail.skipped ? 'unconfigured' : mail.ok ? 'accepted' : 'failed';
        if (notification === 'failed') console.error('[contact] mail send failed:', mail.error);
      } catch (err) {
        notification = 'failed';
        console.error('[contact] mail send error:', err.message);
      }
    }

    res.status(201).json({ ok: true, id: result.lastInsertRowid, notification });
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
