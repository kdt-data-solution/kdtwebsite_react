import '../styles/style.css';
import { contentUrl, escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';

const root = document.querySelector('#products');

function renderCards(items) {
  return items.map((product) => `
    <a href="${contentUrl(product.href || `product.html?slug=${encodeURIComponent(product.slug || '')}`)}" class="kdt-product-card group" aria-label="View ${escapeHtml(product.name)} product details">
      <div class="flex items-center justify-between gap-4">
        <span class="kdt-eyebrow">KDT Product</span>
        <span class="kdt-eyebrow text-gray-500">${escapeHtml(product.number)}</span>
      </div>
      <div class="kdt-product-media" aria-hidden="true">
        ${product.logo
          ? `<img class="kdt-product-logo" src="${contentUrl(product.logo)}" alt="" loading="lazy" decoding="async" />`
          : `<span class="kdt-product-mark">${escapeHtml(product.name.charAt(0))}</span>`}
      </div>
      <div>
        <h3 class="text-gray-950 font-semibold text-2xl leading-tight">${escapeHtml(product.name)}</h3>
        <span class="kdt-product-card-link">View product <span class="kdt-arrow-icon" aria-hidden="true"></span></span>
      </div>
    </a>
  `).join('');
}

(async function renderProducts() {
  const content = await getWebsiteProducts();
  const products = content.items;
  root.innerHTML = `
  <section class="kdt-products-browser bg-white" aria-labelledby="products-heading">
    <div class="kdt-container pt-8 pb-10 sm:pb-12 lg:pb-14">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(content.eyebrow)}</p>
          <h2 id="products-heading" class="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-gray-950">${escapeHtml(content.title)}</h2>
        </div>
        <a id="view-product-directory" href="#product-directory" class="kdt-text-link">View all products A–Z <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
      </div>

      <div class="mt-8">
        <p class="text-xs text-gray-500 mb-2">Sort</p>
        <div class="inline-flex border border-black/20" role="group" aria-label="Sort KDT products">
          <button type="button" class="kdt-product-sort is-active" data-sort="popular" aria-pressed="true">Popular</button>
          <button type="button" class="kdt-product-sort" data-sort="alphabetical" aria-pressed="false">Alphabetical</button>
        </div>
      </div>

      <div id="home-product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-8" aria-live="polite">
        ${renderCards(products)}
      </div>
    </div>
  </section>
`;

const sortButtons = [...root.querySelectorAll('.kdt-product-sort')];
const grid = root.querySelector('#home-product-grid');

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const alphabetical = button.dataset.sort === 'alphabetical';
    const items = alphabetical
      ? [...products].sort((a, b) => a.name.localeCompare(b.name))
      : products;

    if (grid) grid.innerHTML = renderCards(items);
    sortButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});
})();
