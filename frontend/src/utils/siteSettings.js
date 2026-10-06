// Fetches site settings from the API once and caches them.
import { API_BASE } from './auth.js';

let cached = null;
let pending = null;

export async function getSiteSettings() {
  if (cached) return cached;
  if (pending) return pending;
  pending = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (!res.ok) throw new Error('Site settings unavailable');
      cached = await res.json();
    } catch {
      cached = {};
    }
    return cached;
  })();
  return pending;
}
