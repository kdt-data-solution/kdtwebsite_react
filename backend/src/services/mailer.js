import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[mailer] SMTP_HOST/SMTP_USER/SMTP_PASS not set — emails will be skipped.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: { user, pass },
  });

  return transporter;
}

/**
 * Send an email.
 * @param {{ to: string, subject: string, text?: string, html?: string, replyTo?: string, attachments?: any[] }} opts
 * @returns {Promise<{ ok: boolean, skipped?: boolean, messageId?: string, error?: string }>}
 */
export async function sendMail({ to, subject, text, html, replyTo, attachments }) {
  const tx = getTransporter();
  if (!tx) return { ok: false, skipped: true };

  try {
    const info = await tx.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
      replyTo,
      attachments,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('[mailer] send failed:', err);
    return { ok: false, error: err.message };
  }
}

export async function verifyMailer() {
  const tx = getTransporter();
  if (!tx) return false;
  try {
    await tx.verify();
    console.log('[mailer] SMTP connection verified');
    return true;
  } catch (err) {
    console.error('[mailer] SMTP verify failed:', err.message);
    return false;
  }
}
