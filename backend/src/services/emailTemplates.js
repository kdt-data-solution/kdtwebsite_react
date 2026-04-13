// Email-safe HTML templates. Use tables + inline styles for client compatibility.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to locate the KDT logo (sibling frontend/public/assets/images).
function findLogoPath() {
  const candidates = [
    path.resolve(__dirname, '../../../frontend/public/assets/images/kdt-black.png'),
    path.resolve(__dirname, '../../../frontend/src/assets/images/kdt-black.png'),
    path.resolve(__dirname, '../../assets/kdt-black.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const LOGO_PATH = findLogoPath();
const LOGO_CID = 'kdt-logo@kdt';

export function getEmailAttachments() {
  if (!LOGO_PATH) return [];
  return [
    {
      filename: 'kdt-logo.png',
      path: LOGO_PATH,
      cid: LOGO_CID,
    },
  ];
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function layout({ title, preheader, contentHtml }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <span style="display:none;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader || '')}</span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background-color:#000000;padding:24px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      ${LOGO_PATH
                        ? `<img src="cid:${LOGO_CID}" alt="KDT" width="90" style="display:block;height:auto;max-height:36px;width:auto;" />`
                        : `<span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.5px;">KDT</span>`}
                    </td>
                    <td></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#000000;padding:20px 32px;color:#9ca3af;font-size:11px;line-height:1.6;">
                <div style="color:#ffffff;font-weight:600;font-size:12px;margin-bottom:4px;">KDT Network and Data Solution</div>
                81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City<br />
                Monday – Friday, 8:00 am – 5:00 pm<br />
                <span style="color:#6b7280;">© ${new Date().getFullYear()} KDT Network and Data Solution. All rights reserved.</span>
              </td>
            </tr>
          </table>

          <p style="color:#9ca3af;font-size:11px;margin-top:16px;max-width:600px;">
            You're receiving this because someone submitted the contact form on the KDT website.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function contactNotificationEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const content = `
    <p style="margin:0 0 6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">New Contact Message</p>
    <h1 style="margin:0 0 8px 0;font-size:24px;color:#111827;font-weight:700;line-height:1.3;">${safeName} sent you a message</h1>
    <p style="margin:0 0 24px 0;font-size:13px;color:#6b7280;">Received on ${escapeHtml(submittedAt)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;background-color:#f9fafb;">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:2px;">Name</div>
          <div style="font-size:14px;color:#111827;font-weight:500;">${safeName}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px;background-color:#f9fafb;">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:2px;">Email</div>
          <div style="font-size:14px;color:#111827;font-weight:500;">
            <a href="mailto:${safeEmail}" style="color:#111827;text-decoration:underline;">${safeEmail}</a>
          </div>
        </td>
      </tr>
    </table>

    <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:8px;">Message</div>
    <div style="border-left:3px solid #000000;padding:14px 18px;background-color:#f9fafb;border-radius:4px;font-size:14px;color:#374151;line-height:1.7;margin-bottom:28px;">
      ${safeMessage}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-radius:6px;background-color:#000000;">
          <a href="mailto:${safeEmail}" style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Reply to ${safeName}
          </a>
        </td>
      </tr>
    </table>
  `;

  const text =
    `New Contact Message\n` +
    `Received on ${submittedAt}\n\n` +
    `Name:  ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}\n`;

  return {
    subject: `New contact message from ${name}`,
    text,
    html: layout({
      title: `New contact message from ${name}`,
      preheader: `${name} <${email}> just sent a message via the KDT website.`,
      contentHtml: content,
    }),
  };
}
