import '../styles/style.css';
import { courses as fallbackCourses } from '../data/courses.js';
import { API_BASE } from '../utils/auth.js';
import { contentUrl, escapeHtml } from '../utils/content.js';

const BASE = import.meta.env.BASE_URL;

function courseCardHtml(c) {
  const tagsHtml = c.tags
    .map(
      (t) =>
        `<span class="inline-block border border-black/20 text-gray-700 text-[10px] sm:text-xs font-medium px-2.5 py-1">${escapeHtml(t)}</span>`,
    )
    .join('');

  return `
    <article class="kdt-card group flex flex-col overflow-hidden bg-white">
      <div class="overflow-hidden">
        <img src="${contentUrl(c.image)}" alt="${escapeHtml(c.title)}" class="w-full h-44 sm:h-48 md:h-52 object-cover" />
      </div>
      <div class="p-5 sm:p-6 flex-grow flex flex-col">
        <p class="kdt-eyebrow text-gray-500 mb-3">KDT Bootcamp</p>
        <h3 class="text-gray-950 font-semibold text-lg md:text-xl leading-snug mb-2 line-clamp-2 sm:min-h-[3.25rem] md:min-h-[3.5rem]">${escapeHtml(c.title)}</h3>
        <p class="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-6 sm:min-h-[8.5rem]">${escapeHtml(c.desc)}</p>
        <div class="flex flex-wrap gap-2 mb-4 sm:min-h-[3.5rem] content-start">${tagsHtml}</div>
        <div class="flex items-center gap-2 text-gray-700 text-xs sm:text-sm mb-2">
          <img src="${BASE}assets/images/calendarr.svg" alt="" class="w-4 h-4 flex-shrink-0" />
          <span>${escapeHtml(c.startDate)}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-700 text-xs sm:text-sm mb-5">
          <img src="${BASE}assets/images/user.svg" alt="" class="w-4 h-4 flex-shrink-0" />
          <span>${escapeHtml(c.level)}</span>
        </div>
        <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
          <a href="${BASE}course.html?slug=${encodeURIComponent(c.slug)}" class="kdt-btn kdt-btn-outline flex-1">View course</a>
          <a href="${contentUrl(c.registerHref)}" target="_blank" rel="noopener noreferrer" class="kdt-btn kdt-btn-dark flex-1">Register now</a>
        </div>
      </div>
    </article>
  `;
}

const reviews = [
  {
    name: 'Review 1',
    text: 'The host was able to explain the topic very well.',
  },
  {
    name: 'Review 2',
    text: 'Overall the first day of the lesson was a positive and engaging experince. The content was clear and well-structured. I am looking forward to the next lessons.',
  },
  {
    name: 'Review 3',
    text: 'Dave, presents himself very professionally and is expert on the topic. He discussed it patienly and very clearly all throughout the session.',
  },
  {
    name: 'Review 4',
    text: 'What I like about the training is the materials and flow of the lesson is very organzied and systematic.',
  },
  {
    name: 'Review 5',
    text: 'The content is very useful and comprehensive... Thank you for this Beginners Module.',
  },
];

function reviewCardHtml(r) {
  return `
    <article class="bootcamp-review flex-shrink-0 w-72 sm:w-80 md:w-96 bg-[#f1f1ef] border border-black/10 p-6">
      <p class="kdt-eyebrow text-gray-500 mb-4">${r.name}</p>
      <p class="text-sm md:text-base text-gray-700 leading-relaxed">“${r.text}”</p>
    </article>
  `;
}

async function loadCourses() {
  try {
    const response = await fetch(`${API_BASE}/api/courses`);
    if (!response.ok) return fallbackCourses;
    const rows = await response.json();
    return rows.map(row => {
      const fallback = fallbackCourses.find(course => course.slug === row.slug) || {};
      return {
        ...fallback, ...row,
        topics: row.topics?.length ? row.topics : (fallback.topics || []),
        inclusions: row.inclusions?.length ? row.inclusions : (fallback.inclusions || []),
      };
    });
  } catch {
    return fallbackCourses;
  }
}

(async function renderBootcamp() {
const courses = await loadCourses();
document.querySelector('#bootcamp-page').innerHTML = `
  <!-- Hero -->
  <section class="bg-[#0b0b0b] text-white overflow-hidden">
    <div class="kdt-container px-0">
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[590px]">
        <div class="kdt-hero-copy flex flex-col justify-center items-start">
          <p class="kdt-eyebrow text-gray-400 mb-4">KDT Learning</p>
          <h1 class="kdt-display text-white">
            Start Your Tech Journey<br/>Today
          </h1>
          <p class="text-gray-300 text-base sm:text-lg max-w-xl mt-6 mb-8 leading-relaxed">
            Gain practical, in-demand skills through hands-on training designed for real-world applications. Learn from experienced mentors who guide you every step of the way. Build the confidence and portfolio you need to start your career in tech.
          </p>
          <a href="https://events.kdtdatasolution.com" target="_blank" rel="noopener noreferrer" class="kdt-btn kdt-btn-light">
            Explore upcoming events <span class="kdt-arrow-icon is-external" aria-hidden="true"></span>
          </a>
        </div>
        <div id="bootcamp-slider" class="relative w-full min-h-[420px] lg:min-h-full overflow-hidden bg-[#242624]">
          <!-- First image is "relative" so it dictates the container height -->
          <img class="bootcamp-slide absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot2-card_pynov3.png" alt="KDT bootcamp participants and learning session" onerror="this.style.display='none'" />
          <img class="bootcamp-slide absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot3-card_spoada.png" alt="Bootcamp 2" onerror="this.style.display='none'" />
          <img class="bootcamp-slide absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot1-card_e86ffg.png" alt="Bootcamp 3" onerror="this.style.display='none'" />
          <div id="bootcamp-dots" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bootcamp Reviews (marquee) -->
  <section class="kdt-section bg-white overflow-hidden">
    <div class="kdt-container">
      <div class="mb-10 md:mb-14">
        <p class="kdt-eyebrow text-gray-500 mb-3">Participant feedback</p>
        <h2 class="kdt-section-title mb-2">Bootcamp Reviews for Batch 1</h2>
        <p class="text-gray-500 text-sm">August 23 - September 2025</p>
      </div>
    </div>

    <div class="reviews-marquee-wrapper relative overflow-hidden w-full">
      <div class="reviews-marquee-track flex gap-5 md:gap-6 w-max">
        ${reviews.map(reviewCardHtml).join('')}
      </div>
    </div>
  </section>

  <!-- AI Bootcamp Series 2026 -->
  <section class="kdt-section bg-[#f7f7f5]">
    <div class="kdt-container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-end mb-10 md:mb-14">
        <div>
          <p class="kdt-eyebrow text-gray-500 mb-3">Course catalog</p>
          <h2 class="kdt-section-title">AI Bootcamp Series 2026</h2>
        </div>
        <p class="text-gray-600 text-base sm:text-lg max-w-xl lg:justify-self-end">
          Build your future-ready skills through a guided, hands-on bootcamp series
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
        ${courses.map(courseCardHtml).join('')}
      </div>
    </div>
  </section>

  <style>
    .reviews-marquee-track {
      animation: reviews-scroll 30s linear infinite;
    }
    .reviews-marquee-track:hover {
      animation-play-state: paused;
    }
    @keyframes reviews-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .reviews-marquee-track { animation: none; }
    }
  </style>
`;

(function initReviewsMarquee() {
  const track = document.querySelector('.reviews-marquee-track');
  const wrapper = document.querySelector('.reviews-marquee-wrapper');
  if (!track || !wrapper) return;

  const originalHTML = track.innerHTML;
  const SPEED_PX_PER_SEC = 60;

  const ensureWidth = () => {
    track.innerHTML = originalHTML;
    let safety = 0;
    while (track.scrollWidth < wrapper.clientWidth * 2 && safety < 20) {
      track.innerHTML += originalHTML;
      safety++;
    }
    track.innerHTML += track.innerHTML;
    const halfWidth = track.scrollWidth / 2;
    const duration = halfWidth / SPEED_PX_PER_SEC;
    track.style.animationDuration = duration + 's';
  };

  ensureWidth();
  window.addEventListener('resize', ensureWidth);
})();

(function initBootcampSlider() {
  const slides = document.querySelectorAll('.bootcamp-slide');
  if (slides.length < 2) return;

  const dotsContainer = document.getElementById('bootcamp-dots');
  let current = 0;

  // Build dot indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.className = 'w-2 h-2 rounded-full bg-white/50 hover:bg-white transition';
    dot.addEventListener('click', () => show(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('button').forEach((d, i) => {
      d.className = 'rounded-full transition ' + (i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white');
    });
  }

  function show(i) {
    slides[current].classList.remove('opacity-100');
    slides[current].classList.add('opacity-0');
    current = i;
    slides[current].classList.remove('opacity-0');
    slides[current].classList.add('opacity-100');
    updateDots();
  }

  updateDots();

  // Auto-advance every 4s
  let timer = setInterval(() => show((current + 1) % slides.length), 4000);

  // Pause on hover
  const slider = document.getElementById('bootcamp-slider');
  slider?.addEventListener('mouseenter', () => clearInterval(timer));
  slider?.addEventListener('mouseleave', () => {
    timer = setInterval(() => show((current + 1) % slides.length), 4000);
  });
})();
})();
