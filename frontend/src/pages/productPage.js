import '../styles/style.css';
import { products } from '../data/products.js';

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
  smile: `<img src="${BASE}assets/images/improves.svg" alt="" class="w-6 h-6" />`,
  shield: `<img src="${BASE}assets/images/secure.svg" alt="" class="w-6 h-6" />`,
  calendar: `<img src="${BASE}assets/images/track.svg" alt="" class="w-6 h-6" />`,
  clock: `<img src="${BASE}assets/images/time.svg" alt="" class="w-6 h-6" />`,
};

const data = products[slug];

if (!data) {
  root.innerHTML = `<section class="pt-32 pb-20 text-center"><h1 class="text-2xl font-bold text-gray-900">Product not found</h1></section>`;
} else {
  document.title = `${data.title} — KDT`;

  const actionsHtml = (data.actions || []).map(a => `
    <a href="${escapeHtml(a.href || '#')}" class="bg-foreground text-white px-6 py-2.5 rounded-md text-sm font-medium hover:shadow-2xl transition">${escapeHtml(a.label || '')}</a>
  `).join('');

  const productImages = data.images || ['assets/images/kdt-products.png'];
  const imagesHtml = productImages.map(src => {
    const fullSrc = src.startsWith('http') ? src : `${BASE}${src}`;
    return `
      <div class="bg-gray-100 rounded-lg overflow-hidden">
        <img src="${fullSrc}" alt="${escapeHtml(data.title)}" class="w-full h-auto object-contain" />
      </div>
    `;
  }).join('');

  const stepsHtml = (data.steps || []).map((s, i) => `
    <div class="flex flex-col items-center text-center flex-1 relative">
      ${i > 0 ? `<div class="hidden md:block absolute top-4 right-1/2 w-full h-px bg-gray-300"></div>` : ''}
      <div class="relative z-10 w-8 h-8 rounded-full bg-foreground text-white text-xs font-bold flex items-center justify-center">${i + 1}</div>
      <p class="font-semibold text-gray-900 text-sm mt-3">${escapeHtml(s.label || '')}</p>
      <p class="text-xs text-gray-500 mt-1">${escapeHtml(s.desc || '')}</p>
    </div>
  `).join('');

  const benefitsHtml = (data.benefits || []).map(b => `
    <div class="flex items-center gap-4 border border-gray-200 rounded-md px-5 py-4">
      <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">${ICONS[b.icon] || ICONS.smile}</div>
      <p class="text-sm text-gray-900 font-medium">${escapeHtml(b.title || '')}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="pt-24 sm:pt-28 pb-10 md:pb-14 bg-background">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
          ${escapeHtml(data.title)}${data.comingSoon ? ' <span class="text-base align-middle text-gray-500 font-medium">(Coming Soon)</span>' : ''}
        </h1>
        <p class="text-gray-600 text-sm md:text-base text-center max-w-4xl mx-auto leading-relaxed mb-8">
          ${escapeHtml(data.description || '')}
        </p>
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          ${actionsHtml}
        </div>
        <div class="flex justify-center max-w-4xl mx-auto">
          ${imagesHtml}
        </div>
      </div>
    </section>

    ${(data.steps || []).length > 0 ? `
    <section class="py-12 md:py-16 bg-background">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <div class="text-center mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How it Works</h2>
          <p class="text-gray-500 text-xs md:text-sm max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div class="bg-gray-100 rounded-xl px-6 md:px-12 py-8 md:py-10 max-w-5xl mx-auto">
          <div class="flex flex-col md:flex-row gap-8 md:gap-0">
            ${stepsHtml}
          </div>
        </div>
      </div>
    </section>` : ''}

    ${(data.benefits || []).length > 0 ? `
    <section class="py-12 md:py-20 bg-background">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
          <div class="text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">${escapeHtml(data.benefitsTitle || 'Key Benefits')}</h2>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-6 max-w-md">
              ${escapeHtml(data.benefitsBlurb || '')}
            </p>
            <a href="${BASE}#contact" class="inline-block bg-foreground text-white px-6 py-2.5 rounded-md text-sm font-medium hover:shadow-2xl transition">Build with Us</a>
          </div>
          <div class="space-y-3">
            ${benefitsHtml}
          </div>
        </div>
      </div>
    </section>` : ''}
  `;
}
