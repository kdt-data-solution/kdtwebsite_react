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
  return item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`;
}

function cardHtml(e) {
  return `
    <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col media-card" data-category="${escapeHtml(e.category || 'data')}">
      <div class="h-48 sm:h-52 md:h-56 bg-gray-200 flex-shrink-0 overflow-hidden">
        <img src="${imageUrl(e)}" alt="${escapeHtml(e.title)}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-3 leading-snug line-clamp-2 h-[2.75rem]">${escapeHtml(e.title)}</h3>
        <p class="text-xs text-gray-500 mb-3">${escapeHtml(formatLongDate(e.date))}</p>
        <div class="border-t border-gray-200 pt-3 mt-auto flex items-center justify-end">
          <a href="${BASE}article.html?slug=${escapeHtml(e.slug)}" class="bg-black text-white text-xs px-4 py-1.5 rounded-md font-medium hover:bg-gray-800 transition flex-shrink-0">See More</a>
        </div>
      </div>
    </div>
  `;
}

function renderShell(gridHtml, statusText) {
  document.querySelector('#media-page').innerHTML = `
    <section class="pt-24 sm:pt-28 pb-16 md:pb-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <div class="text-center mb-8 md:mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Editorial</h1>
          <p class="text-gray-500 text-xs md:text-sm max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div class="flex justify-center mb-10">
          <div class="bg-gray-100 rounded-lg p-2 inline-flex flex-col sm:flex-row gap-2">
            ${CATEGORIES.map(c => `
              <button data-filter="${c.key}" class="filter-btn px-5 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${c.key === 'all' ? 'bg-black text-white' : 'text-gray-700 hover:bg-white'}">${c.label}</button>
            `).join('')}
          </div>
        </div>

        <div id="media-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          ${gridHtml}
        </div>

        <p id="media-empty" class="text-center text-gray-500 text-sm mt-10 ${statusText ? '' : 'hidden'}">${statusText || ''}</p>
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
        b.classList.remove('bg-black', 'text-white');
        b.classList.add('text-gray-700', 'hover:bg-white');
      });
      btn.classList.add('bg-black', 'text-white');
      btn.classList.remove('text-gray-700', 'hover:bg-white');

      let visible = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      empty.textContent = visible === 0 ? 'No editorials in this category yet.' : '';
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
