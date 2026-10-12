import '../styles/style.css';
import { contentUrl, escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';

const root = document.querySelector('#product-directory');

export const ready = (async function renderProductDirectory() {
  const content = await getWebsiteProducts();
  root.innerHTML = `
    <section class="kdt-product-directory" aria-label="Browse KDT products">
      <div class="kdt-container">
        <p class="kdt-eyebrow">Browse the suite</p>
        <div class="kdt-directory-links">
          ${content.items.map(product => `<a href="${contentUrl(product.href || `product.html?slug=${encodeURIComponent(product.slug || '')}`)}"><span>${escapeHtml(product.name)}</span><small>${escapeHtml(product.category || 'KDT Product')}</small><i aria-hidden="true">↗</i></a>`).join('')}
        </div>
      </div>
    </section>
  `;
})();
