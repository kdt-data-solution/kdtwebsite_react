// Fetches site settings from the API once and caches them.
import { API_BASE } from './auth.js';

export const CONTACT_DEFAULTS = Object.freeze({
  address: '81 Detroit St., Brgy. Pinagkaisahan, Cubao, Quezon City.',
  contact_email: 'kristoffer.tabong@kdtdatasolution.com',
});

const LEGACY_ADDRESS = '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City';
const LEGACY_EMAIL = 'kdy@gmail.com';

let cached = null;
let pending = null;

function withContactDefaults(settings) {
  const values = settings && typeof settings === 'object' ? settings : {};
  const address = typeof values.address === 'string' ? values.address.trim() : '';
  const email = typeof values.contact_email === 'string' ? values.contact_email.trim() : '';

  return {
    ...values,
    address: !address || address === LEGACY_ADDRESS ? CONTACT_DEFAULTS.address : address,
    contact_email: !email || email === LEGACY_EMAIL ? CONTACT_DEFAULTS.contact_email : email,
  };
}

export async function getSiteSettings() {
  if (cached) return cached;
  if (pending) return pending;
  pending = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (!res.ok) throw new Error('Site settings unavailable');
      cached = withContactDefaults(await res.json());
    } catch {
      cached = withContactDefaults({});
    }
    return cached;
  })();
  return pending;
}
