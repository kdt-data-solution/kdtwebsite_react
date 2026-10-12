import '../styles/style.css';
import { homeProducts } from '../data/homeProducts.js';
import { escapeHtml } from '../utils/content.js';

const BASE = import.meta.env.BASE_URL;

export const ready = Promise.resolve().then(() => {
  document.querySelector('#industries').innerHTML = `
    <section id="products" class="kdt-pathways-section" aria-labelledby="pathways-heading">
      <span id="product-directory" class="kdt-anchor-alias" aria-hidden="true"></span>
      <div class="kdt-container">
        <div class="kdt-section-heading-row">
          <div><p class="kdt-eyebrow">Made for the way you work</p><h2 id="pathways-heading">Start with your profession.</h2></div>
          <p>Explore KDT products and find a workflow that fits the way your team works.</p>
        </div>
        <div class="kdt-pathways-grid" aria-label="KDT products by profession">
          ${homeProducts.map(product => `
            <a class="kdt-pathway-card" href="${BASE}${escapeHtml(product.href)}">
              <img src="${BASE}${escapeHtml(product.image || product.logo)}" alt="" loading="lazy" decoding="async" />
              <span class="kdt-pathway-overlay" aria-hidden="true"></span>
              <span class="kdt-pathway-number">${escapeHtml(product.number)} · ${escapeHtml(product.category)}</span>
              <span class="kdt-pathway-brand"><img src="${BASE}${escapeHtml(product.logo)}" alt="" loading="lazy" decoding="async" /></span>
              <span class="kdt-pathway-copy">
                <small>${escapeHtml(product.audiences.join(' · '))}</small>
                <strong>${escapeHtml(product.name)}</strong>
                <span class="kdt-pathway-description">${escapeHtml(product.description)}</span>
                <span class="kdt-pathway-highlights">${product.highlights.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</span>
                <span class="kdt-pathway-link">Explore product <i aria-hidden="true">↗</i></span>
              </span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
});
