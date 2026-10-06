import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import nodemailer from 'nodemailer';

test('contact enquiries preserve context and report notification status', async (t) => {
  const envKeys = ['DATABASE_PATH', 'MAIL_TO', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  process.env.DATABASE_PATH = ':memory:';
  for (const key of envKeys.slice(1)) delete process.env[key];

  const sent = [];
  let sendError;
  let acceptRecipients = true;
  let releaseSend;
  t.mock.method(nodemailer, 'createTransport', (transportOptions) => {
    assert.equal(transportOptions.connectionTimeout, 10000);
    assert.equal(transportOptions.greetingTimeout, 10000);
    assert.equal(transportOptions.socketTimeout, 15000);
    return {
      async sendMail(options) {
        sent.push(options);
        if (releaseSend) await new Promise((resolve) => { releaseSend = resolve; });
        if (sendError) throw sendError;
        return { messageId: 'test-message', accepted: acceptRecipients ? [options.to] : [] };
      },
    };
  });
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'warn', () => {});

  const { default: router } = await import('../src/routes/contact.js');
  const { default: db } = await import('../src/db/index.js');
  const app = express();
  app.use(express.json());
  app.use('/contact', router);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    db.close();
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const url = `http://127.0.0.1:${server.address().port}/contact`;
  const valid = { name: ' Customer ', email: ' customer@example.com ', message: ' Please contact me. ' };
  const post = async (body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return {
      status: response.status,
      body: response.headers.get('content-type')?.includes('application/json')
        ? await response.json() : await response.text(),
    };
  };
  const stored = (id) => db.prepare('SELECT name, email, message FROM contact_messages WHERE id = ?').get(id);

  await t.test('invalid fields never persist or send', async () => {
    const invalid = [null, {}, ...['name', 'email', 'message'].flatMap((key) =>
      [undefined, null, 42, {}, [], '   '].map((value) => ({ ...valid, [key]: value }))
    ),
    { ...valid, name: 'x'.repeat(201) },
    { ...valid, name: 'Customer\nInjected' },
    { ...valid, email: 'not-an-email' },
    { ...valid, email: 'customer@example.com\r\nBcc:other@example.com' },
    { ...valid, email: `${'x'.repeat(244)}@example.com` },
    { ...valid, message: 'x'.repeat(10001) },
    ...[null, {}, 'unknown', ''].map((enquiry_type) => ({ ...valid, enquiry_type })),
    ...[null, 12, {}, 'x'.repeat(201), 'Topic\nInjected'].map((enquiry_topic) => ({ ...valid, enquiry_topic })),
    ...[null, 12, {}, '/'.repeat(501), 'https://example.com', '//example.com', '/contact\nInjected'].map((source_page) => ({ ...valid, source_page })),
    ];
    for (const body of invalid) assert.equal((await post(body)).status, 400, JSON.stringify(body));
    assert.equal(db.prepare('SELECT count(*) AS count FROM contact_messages').get().count, 0);
    assert.equal(sent.length, 0);
  });

  await t.test('legacy clients default to general and missing recipient is unconfigured', async () => {
    const result = await post(valid);
    assert.equal(result.status, 201);
    assert.equal(result.body.ok, true);
    assert.equal(result.body.notification, 'unconfigured');
    assert.deepEqual(stored(result.body.id), {
      name: 'Customer', email: 'customer@example.com', message: 'Enquiry type: general\n\nPlease contact me.',
    });
    assert.equal(sent.length, 0);
  });

  await t.test('missing SMTP remains unconfigured after persistence', async () => {
    process.env.MAIL_TO = 'team@example.com';
    const result = await post(valid);
    assert.equal(result.status, 201);
    assert.equal(result.body.notification, 'unconfigured');
    assert.ok(stored(result.body.id));
    assert.equal(sent.length, 0);
  });

  await t.test('accepted notification preserves context and escapes HTML', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_USER = 'test-user';
    process.env.SMTP_PASS = 'test-password';
    const result = await post({
      ...valid, name: '<Customer>', message: '<script>alert("message")</script>',
      enquiry_type: 'product', enquiry_topic: '<Demo & "quote">', source_page: '/products/<demo>',
    });
    assert.equal(result.status, 201);
    assert.equal(result.body.notification, 'accepted');
    assert.equal(stored(result.body.id).message,
      'Enquiry type: product\nTopic: <Demo & "quote">\nSource page: /products/<demo>\n\n<script>alert("message")</script>');
    const mail = sent.at(-1);
    assert.equal(mail.replyTo, 'customer@example.com');
    assert.match(mail.text, /Enquiry type: product\nTopic: <Demo & "quote">\nSource page: \/products\/<demo>/);
    assert.match(mail.html, /&lt;Demo &amp; &quot;quote&quot;&gt;/);
    assert.match(mail.html, /\/products\/&lt;demo&gt;/);
    assert.match(mail.html, /&lt;script&gt;alert\(&quot;message&quot;\)&lt;\/script&gt;/);
    assert.ok(!mail.html.includes('<Customer>'));
    assert.ok(!mail.html.includes('<script>'));
  });

  await t.test('response waits for transport acceptance', async () => {
    releaseSend = true;
    let completed = false;
    const request = post({ ...valid, enquiry_type: 'service' }).then((result) => {
      completed = true;
      return result;
    });
    while (typeof releaseSend !== 'function') await new Promise((resolve) => setImmediate(resolve));
    assert.equal(completed, false);
    releaseSend();
    releaseSend = undefined;
    assert.equal((await request).body.notification, 'accepted');
  });

  await t.test('transport failure keeps the saved enquiry and reports failed', async () => {
    sendError = new Error('SMTP unavailable');
    const result = await post({ ...valid, enquiry_type: 'webinar' });
    assert.equal(result.status, 201);
    assert.equal(result.body.notification, 'failed');
    assert.match(stored(result.body.id).message, /^Enquiry type: webinar/);
  });

  await t.test('transport accepting no recipients reports failed', async () => {
    sendError = undefined;
    acceptRecipients = false;
    const result = await post(valid);
    assert.equal(result.status, 201);
    assert.equal(result.body.notification, 'failed');
    assert.ok(stored(result.body.id));
  });
});
