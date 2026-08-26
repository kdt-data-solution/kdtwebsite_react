import '../styles/style.css';
import { API_BASE } from '../utils/auth.js';

const BASE = import.meta.env.BASE_URL;
const fallbackImg = `${BASE}assets/images/kdt-products.png`;

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

function imageUrl(item) {
  if (!item.image_url) return fallbackImg;
  return item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`;
}

function cardHtml(p) {
  return `
    <article class="kdt-card group bg-white overflow-hidden portfolio-card" data-category="${escapeHtml(p.category || 'software')}">
      <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <img src="${imageUrl(p)}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5">
        <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(p.category || 'KDT project')}</p>
        <h3 class="text-lg font-semibold text-gray-950 mb-5">${escapeHtml(p.title)}</h3>
        <a href="${BASE}project.html?slug=${escapeHtml(p.slug)}" class="kdt-text-link">View project <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
      </div>
    </article>
  `;
}

function renderShell(gridHtml, statusText) {
  document.querySelector('#portfolio-page').innerHTML = `
    <section class="bg-[#0b0b0b] text-white py-14 md:py-20">
      <div class="kdt-container">
        <div class="max-w-4xl">
          <p class="kdt-eyebrow text-gray-400 mb-4">Selected KDT work</p>
          <h1 class="kdt-display text-white">Portfolio</h1>
          <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mt-6">
            This section showcases a curated selection of the company’s completed projects, demonstrating the scope and quality of its work.
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

        <div id="portfolio-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          ${gridHtml}
        </div>

        <div id="portfolio-empty" class="kdt-empty-state mt-0 ${statusText ? '' : 'hidden'}">
          <p class="kdt-eyebrow text-gray-500">Portfolio update</p>
          <h2>${statusText === 'Loading...' ? 'Loading selected work…' : 'New project stories are being prepared.'}</h2>
          <p>${statusText && statusText !== 'Loading...' && statusText !== 'No projects yet.' ? escapeHtml(statusText) : 'KDT is preparing a clearer view of completed work. Tell us about your project while the portfolio is being updated.'}</p>
          ${statusText && statusText !== 'Loading...' ? `<a href="${BASE}#contact" class="kdt-btn kdt-btn-dark">Discuss your project <span class="kdt-arrow-icon" aria-hidden="true"></span></a>` : ''}
        </div>
      </div>
    </section>
  `;
}

function attachFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  const empty = document.getElementById('portfolio-empty');

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
        empty.innerHTML = `<p class="kdt-eyebrow text-gray-500">Category update</p><h2>Projects in this category are being prepared.</h2><p>Choose another category or contact KDT to discuss similar work.</p><a href="${BASE}#contact" class="kdt-btn kdt-btn-dark">Discuss your project <span class="kdt-arrow-icon" aria-hidden="true"></span></a>`;
      }
      empty.classList.toggle('hidden', visible > 0);
    });
  });
}

(async function init() {
  renderShell('', 'Loading...');
  try {
    const res = await fetch(`${API_BASE}/api/portfolio`);
    const items = await res.json();
    if (!items.length) {
      renderShell('', 'No projects yet.');
      return;
    }
    renderShell(items.map(cardHtml).join(''), '');
    attachFilters();
  } catch (err) {
    renderShell('', `Failed to load: ${err.message}`);
  }
})();
