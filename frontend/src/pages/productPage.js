import '../styles/style.css';
import { products } from '../data/products.js';
import { API_BASE } from '../utils/auth.js';

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug') || window.PRODUCT_KEY || 'membership';
const root = document.querySelector('#product-page');
const BASE = import.meta.env.BASE_URL;

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const ICONS = {
  smile: `<img src="${BASE}assets/images/improves.svg" alt="" class="kdt-product-benefit-icon w-6 h-6" />`,
  shield: `<img src="${BASE}assets/images/secure.svg" alt="" class="kdt-product-benefit-icon w-6 h-6" />`,
  calendar: `<img src="${BASE}assets/images/track.svg" alt="" class="kdt-product-benefit-icon w-6 h-6" />`,
  clock: `<img src="${BASE}assets/images/time.svg" alt="" class="kdt-product-benefit-icon w-6 h-6" />`,
};

async function loadProduct() {
  const fallback = products[slug];
  try {
    const response = await fetch(`${API_BASE}/api/products/slug/${encodeURIComponent(slug)}`);
    if (!response.ok) return null;
    const item = await response.json();
    return {
      ...fallback,
      ...item,
      images: item.image_url ? [item.image_url] : (fallback?.images || []),
      benefitsTitle: item.benefits_title || fallback?.benefitsTitle,
      benefitsBlurb: item.benefits_blurb || fallback?.benefitsBlurb,
      comingSoon: Boolean(item.coming_soon),
    };
  } catch {
    return fallback;
  }
}

(async function renderProduct() {
const data = await loadProduct();
if (!data) {
  root.innerHTML = `<section class="pt-32 pb-20 text-center"><h1 class="text-2xl font-bold text-gray-900">Product not found</h1></section>`;
} else {
  document.title = `${data.title} — KDT`;

  const actionsHtml = (data.actions || []).map((a, index) => {
    const href = a.href === '#contact' ? `${BASE}#contact` : (a.href || '#');
    return `<a href="${escapeHtml(href)}" class="kdt-btn ${index === 0 ? 'kdt-btn-light' : 'border-white/50 text-white hover:bg-white/10 hover:border-white'}">${escapeHtml(a.label || '')}${index === 0 ? ' <span class="kdt-arrow-icon" aria-hidden="true"></span>' : ''}</a>`;
  }).join('');

  const productImages = data.images?.length ? data.images : ['assets/images/kdt-products.png'];
  const heroImage = productImages[0];
  const heroImageSrc = heroImage.startsWith('http')
    ? heroImage
    : (heroImage.startsWith('/') ? `${API_BASE}${heroImage}` : `${BASE}${heroImage}`);

  const stepsHtml = (data.steps || []).map((s, i) => `
    <article class="bg-white p-6 sm:p-8 min-h-52 border border-black/10">
      <p class="kdt-eyebrow text-gray-500">0${i + 1}</p>
      <p class="font-semibold text-gray-950 text-lg mt-8">${escapeHtml(s.label || '')}</p>
      <p class="text-sm text-gray-600 leading-relaxed mt-2">${escapeHtml(s.desc || '')}</p>
    </article>
  `).join('');

  const benefitsHtml = (data.benefits || []).map(b => `
    <div class="flex items-center gap-4 border-t border-black/20 py-5">
      <div class="kdt-product-benefit-icon-wrap w-10 h-10 flex items-center justify-center flex-shrink-0">${ICONS[b.icon] || ICONS.smile}</div>
      <p class="text-sm text-gray-900 font-medium">${escapeHtml(b.title || '')}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="kdt-product-hero text-white" aria-labelledby="product-heading">
      <img
        src="${escapeHtml(heroImageSrc)}"
        alt=""
        decoding="async"
        fetchpriority="high"
        class="kdt-product-hero-image"
      />
      <div class="kdt-product-hero-gradient" aria-hidden="true"></div>

      <div class="kdt-container relative z-10">
        <div class="kdt-product-hero-copy flex flex-col justify-center items-start">
          <p class="kdt-eyebrow text-gray-400 mb-4">KDT Product</p>
          <h1 id="product-heading" class="kdt-display text-white">
            ${escapeHtml(data.title)}${data.comingSoon ? ' <span class="block mt-5 text-xs uppercase tracking-[0.14em] text-gray-400 font-semibold">Coming soon</span>' : ''}
          </h1>
          <p class="kdt-product-hero-description text-gray-200 text-base sm:text-lg leading-relaxed mt-6 mb-8">
            ${escapeHtml(data.description || '')}
          </p>
          <div class="flex flex-wrap gap-3">
            ${actionsHtml}
          </div>
        </div>
      </div>
    </section>

    ${(data.steps || []).length > 0 ? `
    <section class="kdt-section bg-[#f7f7f5]">
      <div class="kdt-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-end mb-10 md:mb-14">
          <div>
            <p class="kdt-eyebrow text-gray-500 mb-3">Product flow</p>
            <h2 class="kdt-section-title">How it works</h2>
          </div>
          <p class="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl lg:justify-self-end">
            A clear, practical path from initial setup to measurable day-to-day value.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            ${stepsHtml}
        </div>
      </div>
    </section>` : ''}

    ${(data.benefits || []).length > 0 ? `
    <section class="kdt-section bg-white">
      <div class="kdt-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p class="kdt-eyebrow text-gray-500 mb-3">Outcomes</p>
            <h2 class="kdt-section-title mb-5">${escapeHtml(data.benefitsTitle || 'Key Benefits')}</h2>
            <p class="text-gray-600 text-base sm:text-lg leading-relaxed mb-7 max-w-lg">
              ${escapeHtml(data.benefitsBlurb || '')}
            </p>
            <a href="${BASE}#contact" class="kdt-btn kdt-btn-dark">Build with us <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
          </div>
          <div class="space-y-3">
            ${benefitsHtml}
          </div>
        </div>
      </div>
    </section>` : ''}
  `;
}
})();
