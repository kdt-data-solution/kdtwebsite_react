import '../styles/style.css';
import { homeProducts } from '../data/homeProducts.js';
import { escapeHtml } from '../utils/content.js';
import { initSiteSearch } from './siteSearch.js';

const BASE = import.meta.env.BASE_URL;

document.querySelector('#hero').innerHTML = `
  <section class="kdt-home-hero" aria-labelledby="home-heading">
    <div class="kdt-container kdt-home-hero-grid">
      <div class="kdt-home-hero-copy">
        <p class="kdt-eyebrow">Engineering · Data · Digital systems</p>
        <h1 id="home-heading">Make your next move <span>with clarity.</span></h1>
        <p class="kdt-home-hero-intro">Software, services, and learning for the people who design projects, manage operations, and lead organizations.</p>

        <form class="kdt-site-search" role="search" autocomplete="off">
          <label for="site-search-input">Find what you need</label>
          <div class="kdt-search-control">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            <input id="site-search-input" type="search" name="q" placeholder="Search products, services, learning…" aria-controls="site-search-results" aria-expanded="false" aria-autocomplete="list" />
            <button type="submit" aria-label="Search KDT">Search</button>
          </div>
          <div id="site-search-results" class="kdt-search-results" role="listbox" aria-label="Search results" hidden></div>
          <p class="kdt-search-hint">Try “structural software”, “estimating”, “warehouse” or “membership”.</p>
        </form>

        <div class="kdt-hero-audiences" aria-label="Professionals we support">
          <span>For engineers</span><span>For project teams</span><span>For organizations</span>
        </div>
      </div>

      <div class="kdt-hero-visual" aria-label="KDT product suite for engineering, data and operations">
        <img class="kdt-hero-visual-image" src="${BASE}assets/images/kdt-ai-engineering-divider.png" alt="Digital blueprint of a building and connected engineering data" fetchpriority="high" />
        <div class="kdt-hero-visual-shade" aria-hidden="true"></div>
        <div class="kdt-hero-visual-caption"><span class="kdt-hero-caption-dot"></span> Tools for work that moves forward</div>
        <div class="kdt-hero-product-stack" aria-hidden="true">
          ${homeProducts.slice(0, 3).map(product => `<div class="kdt-hero-product-chip"><img src="${BASE}${escapeHtml(product.logo)}" alt="" /><span>${escapeHtml(product.name)}</span><small>${escapeHtml(product.category)}</small></div>`).join('')}
        </div>
        <span class="kdt-hero-coordinate" aria-hidden="true">14°35′ N &nbsp; 121°02′ E</span>
      </div>
    </div>
  </section>
`;

export const ready = Promise.resolve().then(() => {
  initSiteSearch();
  if (window.location.hash === '#site-search-input') {
    const input = document.getElementById('site-search-input');
    input?.focus();
    input?.scrollIntoView({ block: 'center' });
  }
});
