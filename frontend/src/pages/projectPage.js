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
    <section class="pt-32 pb-20 container mx-auto px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-3">Project not found</h1>
      <a href="${BASE}portfolio.html" class="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">Back to Portfolio</a>
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
    ? tags.map(t => `<span class="inline-block border border-gray-300 rounded-md px-4 py-1.5 text-xs font-medium text-gray-700">${escapeHtml(t)}</span>`).join('')
    : '<span class="text-xs text-gray-400">No tags</span>';

  root.innerHTML = `
    <section class="pt-24 sm:pt-28 pb-12 md:pb-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">

        <div class="flex justify-end mb-6">
          <button id="go-back" class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Go back
          </button>
        </div>

        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            ${escapeHtml(project.title)}
          </h1>
          ${project.date ? `<p class="text-sm text-gray-600 md:mt-3">${escapeHtml(formatLongDate(project.date))}</p>` : ''}
        </div>

        <div class="mb-10 max-w-4xl">
          <div class="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
            <img src="${imageUrl(project.image_url)}" alt="${escapeHtml(project.title)}" class="w-full h-auto object-contain" />
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2 mb-8">
          <span class="text-sm font-semibold text-gray-900 mr-1">Tags:</span>
          ${tagsHtml}
        </div>

        ${project.description ? `<p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mb-10 whitespace-pre-wrap">${escapeHtml(project.description)}</p>` : ''}

        <div class="pt-6 border-t border-gray-200">
          <a href="${BASE}#contact" class="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition">
            Build with Us
          </a>
        </div>
      </div>
    </section>
  `;

  document.getElementById('go-back').addEventListener('click', () => {
    if (document.referrer && document.referrer.includes(window.location.host)) history.back();
    else window.location.href = `${BASE}portfolio.html`;
  });
})();
