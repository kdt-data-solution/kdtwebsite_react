import '../styles/style.css';
import { services } from '../data/services.js';
import { API_BASE } from '../utils/auth.js';

const params = new URLSearchParams(window.location.search);
const key = params.get('slug') || window.SERVICE_KEY || 'architecture';
const root = document.querySelector('#services-page');

const SERVICE_IMAGES = {
  architecture: 'engineering.png',
  data: 'datascience.png',
  software: 'softwaredev.png',
};

async function loadService() {
  const fallback = services[key];
  try {
    const response = await fetch(`${API_BASE}/api/services/slug/${encodeURIComponent(key)}`);
    if (!response.ok) return null;
    const item = await response.json();
    const offerings = item.offerings?.length
      ? item.offerings.map((offering, index) => ({ ...(fallback?.offerings?.[index] || {}), ...offering }))
      : fallback?.offerings;
    return { ...fallback, ...item, offerings, pageTitle: item.title || fallback?.pageTitle };
  } catch {
    return fallback;
  }
}

(async function renderService() {
const data = await loadService();
if (!data) {
  root.innerHTML = `<section class="pt-32 pb-20 text-center"><h1 class="text-2xl font-bold text-gray-900">Service not found</h1></section>`;
} else {
  if (data.pageTitle) document.title = `${data.pageTitle} — KDT`;

  const BASE = import.meta.env.BASE_URL;
  const projectImg = `${BASE}assets/images/kdt-products.png`;
  const editorialImg = `${BASE}assets/images/here-illustration.png`;

  function escapeAttr(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function imageUrl(url, fallback) {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/media/')) return `${API_BASE}${url}`;
    return `${BASE}${url.replace(/^\/+/, '')}`;
  }

  async function loadDynamic() {
    let projects = [], articles = [];
    try { projects = await fetch(`${API_BASE}/api/portfolio`).then(r => r.json()); } catch {}
    try { articles = await fetch(`${API_BASE}/api/articles`).then(r => r.json()); } catch {}
    // Filter by service category (architecture | data | software)
    const filteredProjects = projects.filter(p => p.category === key).slice(0, 3);
    const filteredArticles = articles.filter(a => a.category === key).slice(0, 3);
    return { projects: filteredProjects, articles: filteredArticles };
  }

    const { projects, articles } = await loadDynamic();

    root.innerHTML = `
      <!-- Hero -->
      <section class="bg-[#0b0b0b] text-white overflow-hidden">
        <div class="kdt-container px-0">
          <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
            <div class="kdt-hero-copy flex flex-col justify-center items-start">
              <p class="kdt-eyebrow text-gray-400 mb-4">KDT Service</p>
              <h1 class="kdt-display text-white max-w-2xl">
                ${escapeAttr(data.title)}
              </h1>
              <p class="text-gray-300 text-base sm:text-lg max-w-xl mt-6 mb-8 leading-relaxed">
                ${escapeAttr(data.description || '')}
              </p>
              <a href="#contact" class="kdt-btn kdt-btn-light">
                Discuss your project <span class="kdt-arrow-icon" aria-hidden="true"></span>
              </a>
            </div>
            <div class="bg-[#242624] min-h-[440px] lg:min-h-full overflow-hidden">
              <img src="${BASE}assets/images/${SERVICE_IMAGES[key] || 'engineering.png'}" alt="${escapeAttr(data.pageTitle || '')}" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <!-- What We Offer -->
      <section class="kdt-section bg-[#f7f7f5]">
        <div class="kdt-container">
          <div>
            <div class="mb-10 md:mb-14">
              <p class="kdt-eyebrow text-gray-500 mb-3">Capabilities</p>
              <h2 class="kdt-section-title">What We Offer</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10">
              ${(data.offerings || []).map(o => `
                <article class="bg-white p-6 sm:p-8 min-h-64">
                  <div class="text-gray-900 mb-4">${o.icon || ''}</div>
                  <h3 class="font-semibold text-gray-950 text-lg md:text-xl mb-3">${escapeAttr(o.title || '')}</h3>
                  <p class="text-gray-600 text-sm leading-relaxed">${escapeAttr(o.desc || '')}</p>
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Our Projects -->
      <section class="kdt-section bg-white">
        <div class="kdt-container">
          <div class="mb-10 md:mb-14">
            <p class="kdt-eyebrow text-gray-500 mb-3">Selected work</p>
            <h2 class="kdt-section-title">Our Projects</h2>
          </div>
          ${projects.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            ${projects.map(p => `
              <article class="kdt-card group bg-white overflow-hidden">
                <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <img src="${imageUrl(p.image_url, projectImg)}" alt="${escapeAttr(p.title)}" class="w-full h-full object-cover" />
                </div>
                <div class="p-5">
                  <h3 class="text-base md:text-lg font-semibold text-gray-950 mb-5">${escapeAttr(p.title)}</h3>
                  <a href="${BASE}project.html?slug=${escapeAttr(p.slug)}" class="kdt-text-link">View project <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
                </div>
              </article>
            `).join('')}
          </div>` : `
          <div class="kdt-empty-state"><p class="kdt-eyebrow text-gray-500">Portfolio update</p><h3>New project stories are being prepared.</h3><p>In the meantime, tell us about the work you need delivered.</p><a href="#contact" class="kdt-text-link">Start a conversation <span class="kdt-arrow-icon" aria-hidden="true"></span></a></div>
          `}
        </div>
      </section>

      <!-- Editorial -->
      <section class="kdt-section bg-[#f0f0ed]">
        <div class="kdt-container">
          <div class="mb-10 md:mb-14">
            <p class="kdt-eyebrow text-gray-500 mb-3">Ideas from KDT</p>
            <h2 class="kdt-section-title">Editorial</h2>
          </div>
          ${articles.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            ${articles.map(e => `
              <article class="kdt-card bg-white overflow-hidden flex flex-col">
                <div class="aspect-[16/9] bg-gray-200">
                  <img src="${imageUrl(e.image_url, editorialImg)}" alt="${escapeAttr(e.title)}" class="w-full h-full object-cover" />
                </div>
                <div class="p-5 flex flex-col flex-grow">
                  <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-3 leading-snug">${escapeAttr(e.title)}</h3>
                  <p class="text-xs text-gray-500 mb-3">${escapeAttr(e.date || '')}</p>
                  <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 gap-2">
                    ${e.tags ? `<p class="text-[11px] text-gray-500 line-clamp-1"><span class="font-medium">Tag/s:</span> ${escapeAttr(e.tags)}</p>` : '<div></div>'}
                    <a href="${BASE}article.html?slug=${escapeAttr(e.slug)}" class="kdt-text-link flex-shrink-0">Read <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>` : `
          <div class="kdt-empty-state"><p class="kdt-eyebrow text-gray-500">Editorial update</p><h3>New technical perspectives are on the way.</h3><p>Explore KDT’s services while the next article is being prepared.</p><a href="${BASE}services.html" class="kdt-text-link">Explore services <span class="kdt-arrow-icon" aria-hidden="true"></span></a></div>
          `}
        </div>
      </section>
    `;
}
})();
