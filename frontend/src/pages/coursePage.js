import '../styles/style.css';
import { getCourseBySlug } from '../data/courses.js';
import { API_BASE } from '../utils/auth.js';

const BASE = import.meta.env.BASE_URL;
const root = document.querySelector('#course-page');

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
}

const TOPIC_ICONS = {
  code: `<img src="${BASE}assets/images/programming.svg" alt="" class="w-6 h-6" />`,
  puzzle: `<img src="${BASE}assets/images/logic.svg" alt="" class="w-6 h-6" />`,
  ai: `<img src="${BASE}assets/images/ai-assistant.svg" alt="" class="w-6 h-6" />`,
  spark: `<img src="${BASE}assets/images/claude.svg" alt="" class="w-6 h-6" />`,
  programming: `<img src="${BASE}assets/images/programming.svg" alt="" class="w-6 h-6" />`,
  logic: `<img src="${BASE}assets/images/logic.svg" alt="" class="w-6 h-6" />`,
  'ai-assistant': `<img src="${BASE}assets/images/ai-assistant.svg" alt="" class="w-6 h-6" />`,
  claude: `<img src="${BASE}assets/images/claude.svg" alt="" class="w-6 h-6" />`,
  chatbot: `<img src="${BASE}assets/images/chatbot.svg" alt="" class="w-6 h-6" />`,
  tools: `<img src="${BASE}assets/images/tools.svg" alt="" class="w-6 h-6" />`,
  'voice-agent': `<img src="${BASE}assets/images/voice-agent.svg" alt="" class="w-6 h-6" />`,
  deployment: `<img src="${BASE}assets/images/deployment.svg" alt="" class="w-6 h-6" />`,
  'data-visualization': `<img src="${BASE}assets/images/data-visualization.svg" alt="" class="w-6 h-6" />`,
  charts: `<img src="${BASE}assets/images/charts.svg" alt="" class="w-6 h-6" />`,
  'first-dashboard': `<img src="${BASE}assets/images/first-dashboard.svg" alt="" class="w-6 h-6" />`,
  automation: `<img src="${BASE}assets/images/automation.svg" alt="" class="w-6 h-6" />`,
  agent: `<img src="${BASE}assets/images/agent.svg" alt="" class="w-6 h-6" />`,
  browser: `<img src="${BASE}assets/images/browser.svg" alt="" class="w-6 h-6" />`,
};

function topicCardHtml(topic) {
  const icon = TOPIC_ICONS[topic.icon] || TOPIC_ICONS.code;
  return `
    <article class="bg-white border border-black/10 p-6 sm:p-8 min-h-56">
      <div class="inline-flex items-center justify-center w-10 h-10 bg-[#ededeb] text-gray-700 mb-7">
        ${icon}
      </div>
      <h3 class="text-lg font-semibold text-gray-950 mb-2">${escapeHtml(topic.title)}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(topic.desc)}</p>
    </article>
  `;
}

function notFound() {
  root.innerHTML = `
    <section class="kdt-section"><div class="kdt-container text-center">
      <h1 class="kdt-section-title mb-5">Course not found</h1>
      <a href="${BASE}services-bootcamp.html" class="kdt-btn kdt-btn-dark">Back to Bootcamp</a>
    </div>
    </section>
  `;
}

(async function renderCourse() {
const fallbackCourse = slug && getCourseBySlug(slug);
let course = fallbackCourse;
if (slug) {
  try {
    const response = await fetch(`${API_BASE}/api/courses/slug/${encodeURIComponent(slug)}`);
    if (response.ok) {
      const item = await response.json();
      course = {
        ...fallbackCourse, ...item,
        topics: item.topics?.length ? item.topics : (fallbackCourse?.topics || []),
        inclusions: item.inclusions?.length ? item.inclusions : (fallbackCourse?.inclusions || []),
      };
    } else {
      course = null;
    }
  } catch {}
}
if (!course) {
  notFound();
} else {
  document.title = `${course.title} — KDT`;

  const tagsHtml = course.tags
    .map(
      (t) =>
        `<span class="inline-block border border-black/20 text-gray-700 text-xs font-medium px-3 py-1.5">${escapeHtml(t)}</span>`,
    )
    .join('');

  const inclusionsHtml = course.inclusions
    .map(
      (item) => `
      <li class="flex items-center gap-3 text-sm text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 flex-shrink-0 text-gray-900">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
        <span>${escapeHtml(item)}</span>
      </li>
    `,
    )
    .join('');

  root.innerHTML = `
    <section class="kdt-section bg-[#f7f7f5]">
      <div class="kdt-container">
        <div class="flex justify-start mb-7">
          <a href="${BASE}services-bootcamp.html" class="kdt-text-link">
            <img src="${BASE}assets/images/arrow-left.svg" alt="" class="w-5 h-5 flex-shrink-0" />
            Back to bootcamp
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          <!-- Hero card -->
          <div class="lg:col-span-2 relative overflow-hidden bg-[#ededeb] min-h-[340px] sm:min-h-[460px] lg:min-h-[620px]">
            <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-white/20 p-5 sm:p-7 max-w-xl">
              <h2 class="text-base sm:text-lg md:text-xl font-bold text-white mb-2 drop-shadow-md">${escapeHtml(course.title)}</h2>
              <p class="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow">${escapeHtml(course.desc)}</p>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="bg-white border border-black/10 p-6 sm:p-8 flex flex-col">
            <p class="kdt-eyebrow text-gray-500 mb-3">Course details</p>
            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-950 leading-tight mb-4">${escapeHtml(course.title)}</h1>

            <div class="mb-5">
              <span class="inline-block bg-[#e7f5e9] text-[#176326] text-xs font-semibold px-3 py-1">${escapeHtml(course.status)}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
              ${tagsHtml}
            </div>

            <div class="border-y border-black/20 py-5 mb-6 space-y-3">
              <div class="flex items-center gap-3 text-sm text-gray-700">
                <img src="${BASE}assets/images/calendarr.svg" alt="" class="w-5 h-5 flex-shrink-0" />
                <span>${escapeHtml(course.startDate)}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-700">
                <img src="${BASE}assets/images/user.svg" alt="" class="w-5 h-5 flex-shrink-0" />
                <span>${escapeHtml(course.level)}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-700">
                <img src="${BASE}assets/images/zoom.svg" alt="" class="w-5 h-5 flex-shrink-0" />
                <span>${escapeHtml(course.mode)}</span>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-sm font-semibold text-gray-900 mb-3">Inclusion</p>
              <ul class="space-y-3">
                ${inclusionsHtml}
              </ul>
            </div>

            <a href="${escapeHtml(course.registerHref)}" target="_blank" rel="noopener noreferrer" class="kdt-btn kdt-btn-dark w-full mt-auto">
              Register now
            </a>
          </aside>
        </div>

        ${
          course.topics && course.topics.length > 0
            ? `
        <div class="mt-16 md:mt-24">
          <p class="kdt-eyebrow text-gray-500 mb-3">Curriculum</p>
          <h2 class="kdt-section-title mb-2">Course Topics</h2>
          <p class="text-gray-600 text-base mb-8">An overview of the topics covered in each session.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            ${course.topics.map(topicCardHtml).join('')}
          </div>
        </div>
        `
            : ''
        }
      </div>
    </section>
  `;
}
})();
