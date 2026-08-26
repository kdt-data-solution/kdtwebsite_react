import '../styles/style.css';
import { API_BASE } from '../utils/auth.js';

const BASE = import.meta.env.BASE_URL;
const root = document.querySelector('#project-page');

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatLongDate(s) {
  if (!s) return '';
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + 'T00:00:00' : s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function imageUrl(url) {
  if (!url) return `${BASE}assets/images/kdt-products.png`;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

function notFound() {
  root.innerHTML = `
    <section class="kdt-section"><div class="kdt-container text-center">
      <h1 class="kdt-section-title mb-5">Project not found</h1>
      <a href="${BASE}portfolio.html" class="kdt-btn kdt-btn-dark">Back to Portfolio</a>
    </div>
    </section>
  `;
}

(async function init() {
  if (!slug) return notFound();

  let project;
  try {
    const res = await fetch(`${API_BASE}/api/portfolio/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) return notFound();
    project = await res.json();
  } catch {
    return notFound();
  }

  document.title = `${project.title} — KDT`;

  const tags = (project.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const tagsHtml = tags.length
    ? tags.map(t => `<span class="inline-block border border-black/20 px-4 py-1.5 text-xs font-medium text-gray-700">${escapeHtml(t)}</span>`).join('')
    : '<span class="text-xs text-gray-400">No tags</span>';

  root.innerHTML = `
    <section class="kdt-section bg-[#f7f7f5]">
      <div class="kdt-container">

        <div class="flex justify-end mb-6">
          <button id="go-back" class="kdt-btn kdt-btn-outline">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Go back
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end mb-10 md:mb-14">
          <div><p class="kdt-eyebrow text-gray-500 mb-4">KDT Project</p><h1 class="kdt-display text-gray-950 max-w-4xl">
            ${escapeHtml(project.title)}
          </h1></div>
          ${project.date ? `<p class="text-sm text-gray-600 md:mt-3">${escapeHtml(formatLongDate(project.date))}</p>` : ''}
        </div>

        <div class="mb-10 max-w-5xl">
          <div class="bg-white border border-black/10 overflow-hidden">
            <img src="${imageUrl(project.image_url)}" alt="${escapeHtml(project.title)}" class="w-full h-auto object-contain" />
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2 mb-8">
          <span class="text-sm font-semibold text-gray-900 mr-1">Tags:</span>
          ${tagsHtml}
        </div>

        ${project.description ? `<p class="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl mb-10 whitespace-pre-wrap">${escapeHtml(project.description)}</p>` : ''}

        <div class="pt-6 border-t border-gray-200">
          <a href="${BASE}#contact" class="kdt-btn kdt-btn-dark">
            Build with us <span class="kdt-arrow-icon" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </section>
  `;

  document.getElementById('go-back')?.addEventListener('click', () => {
    if (document.referrer && document.referrer.includes(window.location.host)) history.back();
    else window.location.href = `${BASE}portfolio.html`;
  });
})();
