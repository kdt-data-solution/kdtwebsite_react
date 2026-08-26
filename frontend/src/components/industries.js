import '../styles/style.css';
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

const fallback = {
  eyebrow: 'Industries',
  title: 'Explore KDT by industry',
  items: [
  {
    title: 'Artificial Intelligence',
    icon: 'assets/images/ai-innovation-01-stroke-rounded.svg',
    image: 'assets/images/industry-artificial-intelligence.png',
    imageAlt: 'Abstract AI system transforming connected data into structured insights',
    href: 'services-data.html',
  },
  {
    title: 'Engineering and Construction',
    icon: 'assets/images/tools.svg',
    image: 'assets/images/industry-engineering-construction.png',
    imageAlt: 'Building and bridge transitioning from engineering wireframe to completed structure',
    href: 'services.html',
  },
  {
    title: 'Organization',
    icon: 'assets/images/user.svg',
    image: 'assets/images/industry-organization.png',
    imageAlt: 'Professional team coordinating connected organizational systems around a shared table',
    href: 'services-software.html',
  },
  ],
};

(async function renderIndustries() {
  const content = await getContentSection('home.industries', fallback);
  document.querySelector('#industries').innerHTML = `
  <section class="bg-[#f1f1ef] border-y border-black/15" aria-labelledby="industries-heading">
    <div class="kdt-container py-8 sm:py-10">
      <div class="mb-6 sm:mb-7">
        <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(content.eyebrow)}</p>
        <h2 id="industries-heading" class="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-gray-950">${escapeHtml(content.title)}</h2>
      </div>

      <nav class="kdt-industry-rail" aria-label="Explore KDT by industry">
        ${content.items.map((industry) => `
          <a href="${contentUrl(industry.href)}" class="kdt-industry-link">
            <span class="kdt-industry-media">
              <img src="${contentUrl(industry.image)}" alt="${escapeHtml(industry.image_alt || industry.imageAlt)}" width="1672" height="941" loading="lazy" decoding="async" />
            </span>
            <span class="kdt-industry-content">
              <img src="${contentUrl(industry.icon)}" alt="" width="22" height="22" />
              <span class="kdt-industry-title">${escapeHtml(industry.title)}</span>
              <span class="kdt-arrow-icon" aria-hidden="true"></span>
            </span>
          </a>
        `).join('')}
      </nav>
    </div>
  </section>
`;
})();
