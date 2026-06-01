// Seed initial products on first boot (only if table is empty).
import db from './index.js';
import bcrypt from 'bcrypt';

const COMMON_BENEFITS_BLURB =
  "Get quick answers to the most common questions about using our system and services. We've organized everything here to make your experience simple, clear, and hassle-free.";
const COMMON_STEPS = [
  { label: 'Step 1', desc: 'Login / SignUp' },
  { label: 'Step 2', desc: 'Use the Portal' },
  { label: 'Step 3', desc: 'Save and Update' },
];
const COMMON_BENEFITS = [
  { title: 'Improves member experience and engagement', icon: 'smile' },
  { title: 'Secure and centralized data management', icon: 'shield' },
  { title: 'Better tracking and reporting', icon: 'calendar' },
  { title: 'Saves time and reduces manual work', icon: 'clock' },
];

const PRODUCTS = [
  {
    slug: 'membership',
    title: 'Membership Portal',
    description:
      'A membership portal is an online system or platform that allows registered users (members) to access exclusive content, services, or features based on their account.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pay via QRPH', href: '#' },
      { label: 'Hit Pay', href: '#' },
    ],
    steps: COMMON_STEPS,
    benefits_title: 'Key Benefits of the Membership Portal',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'construct-pro',
    title: 'Construct Pro',
    description:
      'Construct Pro is a project and resource management platform built for construction and engineering teams.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
    ],
    steps: [
      { label: 'Step 1', desc: 'Create your project' },
      { label: 'Step 2', desc: 'Invite your team' },
      { label: 'Step 3', desc: 'Track progress' },
    ],
    benefits_title: 'Key Benefits of Construct Pro',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'structural-chatbot',
    title: 'Structural Chatbot',
    description:
      'Structural Chatbot is an AI-powered assistant for structural engineering questions.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Try It', href: '#' },
    ],
    steps: COMMON_STEPS,
    benefits_title: 'Key Benefits of Structural Chatbot',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    description: 'Tabs is our upcoming product. Stay tuned for more information.',
    actions: [{ label: 'Notify Me', href: '#contact' }],
    steps: COMMON_STEPS,
    benefits_title: 'What to Expect from Tabs',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 1,
  },
];

// Seed an admin user on first boot if one doesn't already exist.
// Credentials come from backend/.env (ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME).
// Existing accounts are never overwritten here — use `npm run seed:admin` to reset.
export function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed');
    return;
  }
  if (password.length < 8) {
    console.warn('[seed] ADMIN_PASSWORD must be at least 8 characters — skipping admin seed');
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return; // already seeded; leave it alone

  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')"
  ).run(email, password_hash, name);
  console.log(`[seed] created admin user: ${email}`);
}

export function seedInitial() {
  seedAdminUser();

  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (prodCount === 0) {
    const insert = db.prepare(
      `INSERT INTO products (slug, title, description, actions_json, steps_json, benefits_json, benefits_title, benefits_blurb, coming_soon)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const p of PRODUCTS) {
      insert.run(
        p.slug, p.title, p.description,
        JSON.stringify(p.actions),
        JSON.stringify(p.steps),
        JSON.stringify(p.benefits),
        p.benefits_title, p.benefits_blurb, p.coming_soon
      );
    }
    console.log(`[seed] inserted ${PRODUCTS.length} products`);
  }
}
