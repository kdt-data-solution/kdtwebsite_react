import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendMail } from '../services/mailer.js';

const router = Router();

const getSetting = db.prepare('SELECT value FROM site_settings WHERE key = ?');
const upsert = db.prepare(
  'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
);
const allSettings = db.prepare('SELECT key, value FROM site_settings');

// Default settings
const DEFAULTS = {
  company_name: 'KDT Network and Data Solution',
  address: '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City',
  business_hours: 'Monday - Friday (8:00 am - 5:00 pm)',
  contact_phone: '84635344',
  contact_email: 'kristoffer.tabong@kdtdatasolution.com',
  facebook_url: 'https://www.facebook.com/',
  linkedin_url: '',
  youtube_url: '',
};

function getAll() {
  const rows = allSettings.all();
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return { ...DEFAULTS, ...map };
}

// Public: get site settings (for frontend footer, about, contact etc.)
router.get('/', (req, res) => {
  res.json(getAll());
});

// Admin: update settings
router.put('/', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const allowed = Object.keys(DEFAULTS);
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        upsert.run(key, req.body[key]);
      }
    }
    res.json(getAll());
  } catch (err) { next(err); }
});

// Admin: test email
router.post('/test-email', requireAuth, requireRole('admin'), async (req, res) => {
  const to = req.body.email || req.user.email;
  const result = await sendMail({
    to,
    subject: 'KDT Admin — Test Email',
    text: 'This is a test email from your KDT admin dashboard. If you received this, your email settings are working correctly.',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#111;">Test Email</h2>
        <p style="color:#555;">This is a test email from your KDT admin dashboard.</p>
        <p style="color:#555;">If you received this, your email settings are working correctly.</p>
      </div>
    `,
  });
  if (result.ok) {
    res.json({ ok: true, message: `Test email sent to ${to}` });
  } else {
    res.status(500).json({ error: result.error || 'Failed to send test email' });
  }
});

export default router;
