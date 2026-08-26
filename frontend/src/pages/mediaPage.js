import '../styles/style.css';
import { API_BASE } from '../utils/auth.js';

const BASE = import.meta.env.BASE_URL;
const fallbackImg = `${BASE}assets/images/here-illustration.png`;

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'architecture', label: 'Architecture & Engineering' },
  { key: 'data', label: 'Data Science & Analytics' },
  { key: 'software', label: 'Software Development' },
];

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

function imageUrl(item) {
  if (!item.image_url) return fallbackImg;
  if (item.image_url.startsWith('http')) return item.image_url;
  if (item.image_url.startsWith('/media/')) return `${API_BASE}${item.image_url}`;
  return `${BASE}${item.image_url.replace(/^\/+/, '')}`;
}

function cardHtml(e) {
  return `
    <article class="kdt-card bg-white overflow-hidden flex flex-col media-card" data-category="${escapeHtml(e.category || 'data')}">
      <div class="h-48 sm:h-52 md:h-56 bg-gray-200 flex-shrink-0 overflow-hidden">
        <img src="${imageUrl(e)}" alt="${escapeHtml(e.title)}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <p class="kdt-eyebrow text-gray-500 mb-3">KDT Perspective</p>
        <h3 class="text-lg font-semibold text-gray-950 mb-3 leading-snug line-clamp-2 min-h-[3.4rem]">${escapeHtml(e.title)}</h3>
        <p class="text-xs text-gray-500 mb-3">${escapeHtml(formatLongDate(e.date))}</p>
        <div class="border-t border-gray-200 pt-3 mt-auto flex items-center justify-between gap-2">
          ${e.tags ? `<p class="text-[11px] text-gray-600 line-clamp-1"><span class="font-semibold">Tag/s:</span> ${escapeHtml(e.tags)}</p>` : '<div></div>'}
          <a href="${BASE}article.html?slug=${escapeHtml(e.slug)}" class="kdt-text-link flex-shrink-0">Read <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
        </div>
      </div>
    </article>
  `;
}

function renderShell(gridHtml, statusText) {
  document.querySelector('#media-page').innerHTML = `
    <section class="bg-[#0b0b0b] text-white py-14 md:py-20">
      <div class="kdt-container">
        <div class="max-w-4xl">
          <p class="kdt-eyebrow text-gray-400 mb-4">Ideas from KDT</p>
          <h1 class="kdt-display text-white">Editorial</h1>
          <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mt-6">
            Practical perspectives from KDT on engineering, data, software, and responsible digital delivery.
          </p>
        </div>
      </div>
    </section>

    <section class="kdt-section bg-[#f7f7f5]">
      <div class="kdt-container">
        <div class="mb-10 overflow-x-auto border-y border-black/20">
          <div class="min-w-max flex">
            ${CATEGORIES.map(
              (c) => `
              <button data-filter="${c.key}" class="filter-btn kdt-filter-btn ${c.key === 'all' ? 'bg-foreground text-white' : 'text-gray-700 hover:bg-white'}">${c.label}</button>
            `,
            ).join('')}
          </div>
        </div>

        <div id="media-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          ${gridHtml}
        </div>

        <div id="media-empty" class="kdt-empty-state mt-0 ${statusText ? '' : 'hidden'}">
          <p class="kdt-eyebrow text-gray-500">Editorial update</p>
          <h2>${statusText === 'Loading...' ? 'Loading KDT perspectives…' : 'New articles are being prepared.'}</h2>
          <p>${statusText && statusText !== 'Loading...' && statusText !== 'No editorials yet.' ? escapeHtml(statusText) : 'KDT is preparing practical perspectives across engineering, data, and software.'}</p>
          ${statusText && statusText !== 'Loading...' ? `<a href="${BASE}services.html" class="kdt-btn kdt-btn-dark">Explore services <span class="kdt-arrow-icon" aria-hidden="true"></span></a>` : ''}
        </div>
      </div>
    </section>
  `;
}

function attachFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.media-card');
  const empty = document.getElementById('media-empty');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => {
        b.classList.remove('bg-foreground', 'text-white');
        b.classList.add('text-gray-700', 'hover:bg-background');
      });
      btn.classList.add('bg-foreground', 'text-white');
      btn.classList.remove('text-gray-700', 'hover:bg-background');

      let visible = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (visible === 0) {
        empty.innerHTML = `<p class="kdt-eyebrow text-gray-500">Category update</p><h2>Articles in this category are being prepared.</h2><p>Choose another category or explore the related KDT service.</p><a href="${BASE}services.html" class="kdt-btn kdt-btn-dark">Explore services <span class="kdt-arrow-icon" aria-hidden="true"></span></a>`;
      }
      empty.classList.toggle('hidden', visible > 0);
    });
  });
}

(async function init() {
  renderShell('', 'Loading...');
  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    const items = await res.json();
    if (!items.length) {
      renderShell('', 'No editorials yet.');
      return;
    }
    renderShell(items.map(cardHtml).join(''), '');
    attachFilters();
  } catch (err) {
    renderShell('', `Failed to load: ${err.message}`);
  }
})();
