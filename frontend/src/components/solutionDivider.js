import '../styles/style.css';
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

(async function renderSolutionDivider() {
  const content = await getContentSection('home.solution-divider', {
    eyebrow: 'From insight to execution',
    title: 'What can KDT help you build next?',
    image_url: 'assets/images/kdt-ai-engineering-divider.png',
    cta_label: 'Talk with our team', cta_url: '#contact',
  });
  document.querySelector('#solution-divider').innerHTML = `
  <section class="kdt-solution-divider relative overflow-hidden bg-[#06101a] text-white flex items-center" aria-labelledby="solution-divider-heading">
    <img
      src="${contentUrl(content.image_url)}"
      alt=""
      width="2172"
      height="724"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div class="absolute inset-0 bg-black/30" aria-hidden="true"></div>

    <div class="kdt-container relative z-10 py-14 sm:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1px_minmax(280px,0.7fr)] items-center gap-8 lg:gap-14">
        <div>
          <p class="kdt-eyebrow text-blue-200 mb-4">${escapeHtml(content.eyebrow)}</p>
          <h2 id="solution-divider-heading" class="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">
            ${escapeHtml(content.title)}
          </h2>
        </div>

        <div class="hidden lg:block h-20 bg-white/55" aria-hidden="true"></div>

        <div class="border-t border-white/40 pt-7 lg:border-0 lg:pt-0 lg:flex lg:justify-center">
          <a href="${contentUrl(content.cta_url)}" class="kdt-btn kdt-divider-cta">
            ${escapeHtml(content.cta_label)} <span class="kdt-arrow-icon" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </div>
  </section>
`;
})();
