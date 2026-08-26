import '../styles/style.css';
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

const fallback = {
  eyebrow: 'Free KDT webinar',
  title: 'Build smarter with KDT.',
  body: 'Join our free webinar on practical AI, engineering, and digital systems for real organizational challenges.',
  subtitle: 'Online · Free registration · Schedule to be announced',
  image_url: 'assets/images/kdt-webinar-command-center.png',
  cta_label: 'Register your interest',
  cta_url: '#contact',
};

(async function renderHero() {
  const content = await getContentSection('home.hero', fallback);
  document.querySelector('#hero').innerHTML = `
  <section class="kdt-event-hero text-white" aria-labelledby="home-heading">
    <img
      src="${contentUrl(content.image_url)}"
      alt=""
      width="1672"
      height="941"
      decoding="async"
      fetchpriority="high"
      class="kdt-event-hero-image"
    />
    <div class="kdt-event-hero-gradient" aria-hidden="true"></div>

    <div class="kdt-container relative z-10 flex min-h-[390px] items-center py-10 sm:py-12">
      <div class="flex max-w-xl flex-col items-start">
        <p class="kdt-eyebrow text-gray-400 mb-4">${escapeHtml(content.eyebrow)}</p>
        <h1 id="home-heading" class="text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
          ${escapeHtml(content.title)}
        </h1>
        <p class="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-gray-200">
          ${escapeHtml(content.body)}
        </p>
        <p class="mt-4 text-xs text-gray-300">${escapeHtml(content.subtitle)}</p>
        <div class="mt-5">
          <a href="${contentUrl(content.cta_url)}" class="kdt-btn kdt-btn-light">
            ${escapeHtml(content.cta_label)} <span class="kdt-arrow-icon" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </div>
  </section>
`;
})();
