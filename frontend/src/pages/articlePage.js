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
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

function notFound() {
  root.innerHTML = `
    <section class="pt-32 pb-20 container mx-auto px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-3">Article not found</h1>
      <a href="${BASE}media.html" class="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">Back to Editorial</a>
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

  const paragraphs = (article.body || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const bodyHtml = paragraphs.map(p =>
    `<p class="text-gray-700 text-sm md:text-base leading-relaxed mb-5">${escapeHtml(p).replace(/\r?\n/g, '<br />')}</p>`
  ).join('');

  root.innerHTML = `
    <section class="pt-24 sm:pt-28 pb-12 md:pb-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">

        <div class="flex justify-end mb-6">
          <button id="go-back" class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Go back
          </button>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          ${escapeHtml(article.title)}
        </h1>

        <p class="text-sm text-gray-700 mb-6">
          <span class="font-bold">Author:</span> ${escapeHtml(article.author || 'KDT')} | ${escapeHtml(formatLongDate(article.date))}
        </p>

        <div class="rounded-lg overflow-hidden mb-6">
          <img src="${imageUrl(article.image_url)}" alt="${escapeHtml(article.title)}" class="w-full h-auto object-cover" />
        </div>

        <div class="flex justify-end gap-2 mb-8">
          <a id="share-fb" href="#" target="_blank" rel="noopener" aria-label="Share on Facebook" class="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <div class="relative">
            <button id="share-copy" aria-label="Copy link" class="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <span id="copy-tooltip" class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded opacity-0 transition-opacity duration-150 whitespace-nowrap">
              Copied!
              <span class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></span>
            </span>
          </div>
        </div>

        <article class="max-w-none">
          ${bodyHtml}
        </article>
      </div>
    </section>
  `;

  document.getElementById('go-back').addEventListener('click', () => {
    if (document.referrer && document.referrer.includes(window.location.host)) history.back();
    else window.location.href = `${BASE}media.html`;
  });

  const url = window.location.href;
  document.getElementById('share-fb').href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  document.getElementById('share-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      const tip = document.getElementById('copy-tooltip');
      tip.classList.remove('opacity-0');
      tip.classList.add('opacity-100');
      clearTimeout(window.__copyTipTimer);
      window.__copyTipTimer = setTimeout(() => {
        tip.classList.remove('opacity-100');
        tip.classList.add('opacity-0');
      }, 1500);
    } catch {}
  });
})();
