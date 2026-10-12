import '../styles/style.css';
import { contentUrl, escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';

const root = document.querySelector('#products');

function renderCards(items) {
  return items.map((product) => `
    <a href="${contentUrl(product.href || `product.html?slug=${encodeURIComponent(product.slug || '')}`)}" class="kdt-suite-card" aria-label="Explore ${escapeHtml(product.name)}: ${escapeHtml(product.category)}">
      <div class="kdt-suite-card-top"><span>${escapeHtml(product.number)}</span><span>${escapeHtml(product.category)}</span></div>
      <div class="kdt-suite-card-logo">${product.logo
        ? `<img src="${contentUrl(product.logo)}" alt="" loading="lazy" decoding="async" />`
        : `<span>${escapeHtml(product.name.charAt(0))}</span>`}</div>
      <div class="kdt-suite-card-copy"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div>
      <span class="kdt-suite-card-link">Explore product <span aria-hidden="true">↗</span></span>
    </a>
  `).join('');
}

export const ready = (async function renderProducts() {
  const content = await getWebsiteProducts();
  const products = content.items;
  root.innerHTML = `
    <section class="kdt-suite-section" aria-labelledby="products-heading">
      <div class="kdt-container">
        <div class="kdt-section-heading-row kdt-suite-heading">
          <div><p class="kdt-eyebrow">The KDT product suite</p><h2 id="products-heading">Purpose-built tools.<br /><span>Connected to your work.</span></h2></div>
          <p>Five focused products for structural engineering, estimating, business intelligence, warehouse operations, and professional organizations.</p>
        </div>
        <div id="home-product-grid" class="kdt-suite-grid" aria-live="polite">${renderCards(products)}</div>
        <div class="kdt-suite-note"><span>One partner for software, services, and learning.</span><a href="#contact">Talk through your needs <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  `;
})();
