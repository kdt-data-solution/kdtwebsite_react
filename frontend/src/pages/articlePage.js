import '../styles/style.css';
import { API_BASE } from '../utils/auth.js';

const BASE = import.meta.env.BASE_URL;
const root = document.querySelector('#article-page');

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatLongDate(s) {
  if (!s) return '';
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + 'T00:00:00' : s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function imageUrl(url) {
  if (!url) return `${BASE}assets/images/here-illustration.png`;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/media/')) return `${API_BASE}${url}`;
  return `${BASE}${url.replace(/^\/+/, '')}`;
}

function notFound() {
  root.innerHTML = `
    <section class="kdt-section"><div class="kdt-container text-center">
      <h1 class="kdt-section-title mb-5">Article not found</h1>
      <a href="${BASE}media.html" class="kdt-btn kdt-btn-dark">Back to Editorial</a>
    </div>
    </section>
  `;
}

(async function init() {
  if (!slug) return notFound();

  let article;
  try {
    const res = await fetch(`${API_BASE}/api/articles/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) return notFound();
    article = await res.json();
  } catch {
    return notFound();
  }

  document.title = `${article.title} — KDT`;

  // Populate Open Graph / Twitter meta tags for rich previews on social
  const PROD_HOST_META = 'https://www.kdtdatasolution.com';
  const pageUrl = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')
    ? `${PROD_HOST_META}/article.html?slug=${encodeURIComponent(slug)}`
    : window.location.href;
  const imgFull = imageUrl(article.image_url);
  const excerpt = (article.body || '').replace(/\s+/g, ' ').trim().slice(0, 200);
  const setMeta = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('content', value);
  };
  setMeta('og-title', article.title);
  setMeta('og-description', excerpt);
  setMeta('og-image', imgFull);
  setMeta('og-url', pageUrl);
  setMeta('tw-title', article.title);
  setMeta('tw-description', excerpt);
  setMeta('tw-image', imgFull);

  const paragraphs = (article.body || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const bodyHtml = paragraphs.map(p =>
    `<p class="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">${escapeHtml(p).replace(/\r?\n/g, '<br />')}</p>`
  ).join('');

  root.innerHTML = `
    <section class="kdt-section bg-[#f7f7f5]">
      <div class="kdt-container max-w-5xl">

        <div class="flex justify-end mb-6">
          <button id="go-back" class="kdt-btn kdt-btn-outline">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Go back
          </button>
        </div>

        <p class="kdt-eyebrow text-gray-500 mb-4">KDT Editorial</p>
        <h1 class="kdt-display text-gray-950 mb-7">
          ${escapeHtml(article.title)}
        </h1>

        <p class="text-sm text-gray-700 mb-6">
          <span class="font-bold">Author:</span> ${escapeHtml(article.author || 'KDT')} | ${escapeHtml(formatLongDate(article.date))}
        </p>
        ${article.tags ? `
        <div class="flex flex-wrap gap-2 mb-4">
          ${article.tags.split(',').filter(Boolean).map(t => `
            <span class="inline-block bg-white border border-black/20 text-xs text-gray-700 px-3 py-1">${escapeHtml(t.trim())}</span>
          `).join('')}
        </div>` : ''}

        <div class="overflow-hidden border border-black/10 mb-6">
          <img src="${imageUrl(article.image_url)}" alt="${escapeHtml(article.title)}" class="w-full h-auto object-cover" />
        </div>

        <div class="flex justify-end gap-2 mb-8">
          <a id="share-fb" href="#" target="_blank" rel="noopener" aria-label="Share on Facebook" class="w-10 h-10 border border-black/20 bg-white hover:bg-gray-200 flex items-center justify-center text-gray-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <div class="relative">
            <button id="share-copy" aria-label="Copy link" class="w-10 h-10 border border-black/20 bg-white hover:bg-gray-200 flex items-center justify-center text-gray-800">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <span id="copy-tooltip" class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded opacity-0 transition-opacity duration-150 whitespace-nowrap">
              Copied!
              <span class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></span>
            </span>
          </div>
        </div>

        <article class="border-t border-black/20 pt-9">
          ${bodyHtml}
        </article>
      </div>
    </section>
  `;

  document.getElementById('go-back')?.addEventListener('click', () => {
    if (document.referrer && document.referrer.includes(window.location.host)) history.back();
    else window.location.href = `${BASE}media.html`;
  });

  // Use the PRODUCTION URL always (Facebook can't share localhost)
  const PROD_HOST = 'https://www.kdtdatasolution.com';
  const currentUrl = window.location.href;
  const shareUrl = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')
    ? `${PROD_HOST}/article.html?slug=${encodeURIComponent(slug)}`
    : currentUrl;

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const fbBtn = document.getElementById('share-fb');
  if (fbBtn) {
    fbBtn.href = fbShareUrl;
    fbBtn.target = '_blank';
    fbBtn.rel = 'noopener noreferrer';
    fbBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const w = 626, h = 436;
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;
    const popup = window.open(fbShareUrl, 'fb-share', `width=${w},height=${h},left=${left},top=${top},toolbar=0,location=0,menubar=0,status=0,scrollbars=1`);
    // Fallback if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = fbShareUrl;
    }
  });
  }
  document.getElementById('share-copy')?.addEventListener('click', async () => {
    const showTip = (ok = true) => {
      const tip = document.getElementById('copy-tooltip');
      if (!tip) return;
      tip.textContent = ok ? 'Copied!' : 'Copy failed';
      tip.classList.remove('opacity-0');
      tip.classList.add('opacity-100');
      clearTimeout(window.__copyTipTimer);
      window.__copyTipTimer = setTimeout(() => {
        tip.classList.remove('opacity-100');
        tip.classList.add('opacity-0');
      }, 1500);
    };

    // Try the modern Clipboard API first
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        showTip(true);
        return;
      }
    } catch {}

    // Fallback for older browsers / non-HTTPS
    try {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      showTip(success);
    } catch {
      showTip(false);
    }
  });
})();
