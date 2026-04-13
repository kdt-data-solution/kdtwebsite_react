import '../styles/style.css';
import { services } from '../data/services.js';
import { API_BASE } from '../utils/auth.js';

const key = window.SERVICE_KEY || 'architecture';
const data = services[key];
const root = document.querySelector('#services-page');

const SERVICE_IMAGES = {
  architecture: 'engineering.png',
  data: 'datascience.png',
  software: 'softwaredev.png',
};

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
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  }

  async function loadDynamic() {
    let projects = [], articles = [];
    try { projects = await fetch(`${API_BASE}/api/portfolio`).then(r => r.json()); } catch {}
    try { articles = await fetch(`${API_BASE}/api/articles`).then(r => r.json()); } catch {}
    return { projects: projects.slice(0, 3), articles: articles.slice(0, 3) };
  }

  (async function render() {
    const { projects, articles } = await loadDynamic();

    root.innerHTML = `
      <!-- Hero -->
      <section class="pt-24 sm:pt-28 pb-12 md:pb-16 bg-white">
        <div class="container mx-auto px-4 sm:px-6 md:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div class="text-center md:text-left flex flex-col items-center md:items-start">
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                ${data.title}
              </h1>
              <p class="text-gray-600 text-sm md:text-base max-w-md mb-6 leading-relaxed">
                ${escapeAttr(data.description || '')}
              </p>
              <a href="#contact" class="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">
                Connect with us
              </a>
            </div>
            <div class="bg-gray-100 rounded-lg w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden">
              <img src="${BASE}assets/images/${SERVICE_IMAGES[key] || 'engineering.png'}" alt="${escapeAttr(data.pageTitle || '')}" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <!-- What We Offer -->
      <section class="py-12 md:py-16">
        <div class="container mx-auto px-4 sm:px-6 md:px-8">
          <div class="bg-gray-100 rounded-xl p-6 sm:p-10 md:p-14">
            <div class="text-center mb-8 md:mb-10">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What We Offer</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              ${(data.offerings || []).map(o => `
                <div class="bg-gray-100 border border-gray-400 rounded-lg p-6">
                  <div class="text-gray-900 mb-4">${o.icon || ''}</div>
                  <h3 class="font-bold text-gray-900 text-base md:text-lg mb-3">${escapeAttr(o.title || '')}</h3>
                  <p class="text-gray-600 text-xs md:text-sm leading-relaxed">${escapeAttr(o.desc || '')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Our Projects -->
      ${projects.length > 0 ? `
      <section class="py-12 md:py-16">
        <div class="container mx-auto px-4 sm:px-6 md:px-8">
          <div class="text-center mb-8 md:mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Projects</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            ${projects.map(p => `
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <img src="${imageUrl(p.image_url, projectImg)}" alt="${escapeAttr(p.title)}" class="w-full h-full object-cover" />
                </div>
                <div class="p-5">
                  <h3 class="text-sm md:text-base font-medium text-gray-900 text-center mb-4">${escapeAttr(p.title)}</h3>
                  <a href="${BASE}project.html?slug=${escapeAttr(p.slug)}" class="block w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition text-center">Learn More</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>` : ''}

      <!-- Editorial -->
      ${articles.length > 0 ? `
      <section class="py-12 md:py-16">
        <div class="container mx-auto px-4 sm:px-6 md:px-8">
          <div class="text-center mb-8 md:mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Editorial</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            ${articles.map(e => `
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
                <div class="aspect-[16/9] bg-gray-200">
                  <img src="${imageUrl(e.image_url, editorialImg)}" alt="${escapeAttr(e.title)}" class="w-full h-full object-cover" />
                </div>
                <div class="p-5 flex flex-col flex-grow">
                  <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-3 leading-snug">${escapeAttr(e.title)}</h3>
                  <p class="text-xs text-gray-500 mb-3">${escapeAttr(e.date || '')}</p>
                  <div class="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
                    <a href="${BASE}article.html?slug=${escapeAttr(e.slug)}" class="bg-black text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-800 transition">See More</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>` : ''}
    `;
  })();
}
