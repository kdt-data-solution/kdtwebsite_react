import '../styles/style.css';
import { getCourseBySlug } from '../data/courses.js';

const BASE = import.meta.env.BASE_URL;
const root = document.querySelector('#course-page');

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function notFound() {
  root.innerHTML = `
    <section class="pt-32 pb-20 container mx-auto px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-3">Course not found</h1>
      <a href="${BASE}services-bootcamp.html" class="inline-block bg-foreground text-white px-6 py-2.5 rounded-md text-sm font-medium hover:shadow-2xl transition">Back to Bootcamp</a>
    </section>
  `;
}

const course = slug && getCourseBySlug(slug);
if (!course) {
  notFound();
} else {
  document.title = `${course.title} — KDT`;

  const tagsHtml = course.tags
    .map(
      (t) =>
        `<span class="inline-block bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-md">${escapeHtml(t)}</span>`,
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
    <section class="pt-24 sm:pt-28 pb-12 md:pb-20 bg-background">
      <div class="container mx-auto px-4 sm:px-6 md:px-8">
        <div class="flex justify-end mb-6 md:mb-8">
          <a href="${BASE}services-bootcamp.html" class="inline-flex items-center gap-2 bg-foreground text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-2xl transition">
            <img src="${BASE}assets/images/arrow-left.svg" alt="" class="w-5 h-5 flex-shrink-0" />
            Go back
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          <!-- Hero card -->
          <div class="lg:col-span-2 relative rounded-xl overflow-hidden shadow-md bg-gray-100 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[560px]">
            <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-lg p-4 sm:p-5 md:p-6 max-w-md">
              <h2 class="text-base sm:text-lg md:text-xl font-bold text-white mb-2 drop-shadow-md">${escapeHtml(course.title)}</h2>
              <p class="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow">${escapeHtml(course.desc)}</p>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="bg-gray-100 rounded-xl p-5 sm:p-6 md:p-7 shadow-md flex flex-col">
            <h1 class="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">${escapeHtml(course.title)}</h1>

            <div class="mb-5">
              <span class="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-md">${escapeHtml(course.status)}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
              ${tagsHtml}
            </div>

            <div class="border border-gray-300 border-dashed rounded-lg p-4 sm:p-5 mb-6 space-y-3">
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

            <a href="${escapeHtml(course.registerHref)}" target="_blank" rel="noopener noreferrer" class="block w-full text-center bg-foreground text-white py-3 rounded-md text-sm font-semibold hover:shadow-2xl transition mt-auto">
              Register Now
            </a>
          </aside>
        </div>
      </div>
    </section>
  `;
}
