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
    <div class="bg-background border border-gray-200 rounded-lg overflow-hidden shadow-sm portfolio-card" data-category="${escapeHtml(p.category || 'software')}">
      <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <img src="${imageUrl(p)}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5">
        <h3 class="text-sm md:text-base font-medium text-gray-900 text-center mb-4">${escapeHtml(p.title)}</h3>
        <a href="${BASE}project.html?slug=${escapeHtml(p.slug)}" class="block w-full bg-foreground text-white py-2 rounded-md text-sm font-medium hover:shadow-2xl transition text-center">Learn More</a>
      </div>
    </div>
  `;
}

function renderShell(gridHtml, statusText) {
  document.querySelector("#portfolio-page").innerHTML = `
    <section class="pt-24 sm:pt-28 pb-16 md:pb-20 bg-background">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <div class="text-center mb-8 md:mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p class="text-gray-500 text-xs md:text-sm max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div class="flex justify-center mb-10">
          <div class="bg-gray-100 rounded-lg p-2 inline-flex flex-col sm:flex-row gap-2">
            ${CATEGORIES.map(
              (c) => `
              <button data-filter="${c.key}" class="filter-btn px-5 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${c.key === "all" ? "bg-foreground text-white" : "text-gray-700 hover:bg-background"}">${c.label}</button>
            `,
            ).join("")}
          </div>
        </div>

        <div id="portfolio-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          ${gridHtml}
        </div>

        <p id="portfolio-empty" class="text-center text-gray-500 text-sm mt-10 ${statusText ? "" : "hidden"}">${statusText || ""}</p>
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
      empty.textContent = visible === 0 ? 'No projects in this category yet.' : '';
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
