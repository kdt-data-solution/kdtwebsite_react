import '../styles/style.css';
import { courses } from '../data/courses.js';

const BASE = import.meta.env.BASE_URL;

function courseCardHtml(c) {
  const tagsHtml = c.tags
    .map(
      (t) =>
        `<span class="inline-block bg-foreground text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-md">${t}</span>`,
    )
    .join('');

  return `
    <div class="flex flex-col rounded-md overflow-hidden shadow-md bg-background border border-gray-200 transition-shadow duration-300 hover:shadow-2xl">
      <div class="overflow-hidden">
        <img src="${c.image}" alt="${c.title}" class="w-full h-44 sm:h-48 md:h-52 object-cover" />
      </div>
      <div class="p-5 sm:p-6 flex-grow flex flex-col">
        <h3 class="text-gray-900 font-bold text-base sm:text-lg md:text-xl leading-snug mb-2 line-clamp-2 sm:min-h-[3.25rem] md:min-h-[3.5rem]">${c.title}</h3>
        <p class="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-6 sm:min-h-[8.5rem]">${c.desc}</p>
        <div class="flex flex-wrap gap-2 mb-4 sm:min-h-[3.5rem] content-start">${tagsHtml}</div>
        <div class="flex items-center gap-2 text-gray-700 text-xs sm:text-sm mb-2">
          <img src="${BASE}assets/images/calendarr.svg" alt="" class="w-4 h-4 flex-shrink-0" />
          <span>${c.startDate}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-700 text-xs sm:text-sm mb-5">
          <img src="${BASE}assets/images/user.svg" alt="" class="w-4 h-4 flex-shrink-0" />
          <span>${c.level}</span>
        </div>
        <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
          <a href="${BASE}course.html?slug=${encodeURIComponent(c.slug)}" class="flex-1 bg-background text-gray-900 py-2.5 md:py-3 text-xs sm:text-sm rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">View Course</a>
          <a href="${c.registerHref}" target="_blank" rel="noopener noreferrer" class="flex-1 text-white bg-foreground py-2.5 md:py-3 text-xs sm:text-sm rounded-md font-semibold hover:shadow-2xl transition-shadow text-center">Register Now</a>
        </div>
      </div>
    </div>
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
    <div class="bootcamp-review group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-gray-100 rounded-lg border border-gray-200 shadow-sm p-5 transition-colors duration-300 hover:bg-foreground hover:border-foreground">
      <p class="text-sm font-semibold text-gray-900 group-hover:text-background mb-2 transition-colors duration-300">${r.name}</p>
      <p class="text-xs md:text-sm text-gray-600 group-hover:text-background leading-relaxed transition-colors duration-300">${r.text}</p>
    </div>
  `;
}

document.querySelector('#bootcamp-page').innerHTML = `
  <!-- Hero -->
  <section class="pt-24 sm:pt-28 pb-12 md:pb-20 bg-background overflow-x-hidden">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-4 md:gap-6 lg:gap-8 items-center w-full min-w-0">
        <div class="text-center md:text-left flex flex-col items-center md:items-start w-full min-w-0">
          <h1 class="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-sm md:max-w-full break-words">
            Start Your Tech Journey<br/>Today
          </h1>
          <p class="text-gray-600 text-sm md:text-base lg:w-140 mb-6 leading-relaxed">
            Gain practical, in-demand skills through hands-on training designed for real-world applications. Learn from experienced mentors who guide you every step of the way. Build the confidence and portfolio you need to start your career in tech.
          </p>
          <a href="https://events.kdtdatasolution.com" target="_blank" rel="noopener noreferrer" class="inline-block bg-foreground text-white px-6 py-2.5 rounded-md text-sm font-medium hover:shadow-2xl transition">
            Learn more
          </a>
        </div>
        <div id="bootcamp-slider" class="relative rounded-lg w-full max-w-sm md:ml-auto overflow-hidden bg-gray-100">
          <!-- First image is "relative" so it dictates the container height -->
          <img class="bootcamp-slide block w-full h-auto opacity-100 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot2-card_pynov3.png" alt="Bootcamp 1" onerror="this.style.display='none'" />
          <img class="bootcamp-slide absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot3-card_spoada.png" alt="Bootcamp 2" onerror="this.style.display='none'" />
          <img class="bootcamp-slide absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000" src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776349570/boot1-card_e86ffg.png" alt="Bootcamp 3" onerror="this.style.display='none'" />
          <div id="bootcamp-dots" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bootcamp Reviews (marquee) -->
  <section class="pb-12 md:pb-16 bg-background overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="mb-8 md:mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Bootcamp Reviews for Batch 1</h2>
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
  <section class="pb-12 md:pb-16 bg-background">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI Bootcamp Series 2026</h2>
        <p class="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
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
