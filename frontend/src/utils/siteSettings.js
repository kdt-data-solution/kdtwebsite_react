// Fetches site settings from the API once and caches them.
import { API_BASE } from './auth.js';

let cached = null;

export async function getSiteSettings() {
  if (cached) return cached;
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    cached = await res.json();
  } catch {
    cached = {};
  }
  return cached;
}
