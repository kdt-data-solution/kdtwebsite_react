import { API_BASE } from './auth.js';
import { getPublicJson } from './publicJson.js';

const BASE = import.meta.env.BASE_URL;

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

export function contentUrl(value = '') {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('#')) return url;
  return `${BASE}${url.replace(/^\/+/, '')}`;
}

export async function getContentSection(key, fallback = {}) {
  try {
    const section = await getPublicJson(`${API_BASE}/api/content/${encodeURIComponent(key)}`);
    return { ...fallback, ...section, items: Array.isArray(section.items) ? section.items : (fallback.items || []) };
  } catch {
    return fallback;
  }
}

export async function getPageContent(page, fallbacks = {}) {
  try {
    const response = await fetch(`${API_BASE}/api/content?page=${encodeURIComponent(page)}`);
    if (!response.ok) return fallbacks;
    const sections = await response.json();
    return sections.reduce((result, section) => {
      result[section.key] = { ...(fallbacks[section.key] || {}), ...section };
      return result;
    }, { ...fallbacks });
  } catch {
    return fallbacks;
  }
}
