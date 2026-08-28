import "../styles/style.css";
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

const fallbackServices = [
  {
    title: 'Architecture and Engineering Services',
    desc: 'Professional design and engineering solutions tailored to your project requirements.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/eng-card_b99f6c.webp',
    href: 'services.html',
  },
  {
    title: 'Data Science and Analytics',
    desc: 'Transform your data into actionable insights with our advanced analytics solutions.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/dsa-card_bnnv0x.png',
    href: 'services-data.html',
  },
  {
    title: 'Software Development',
    desc: 'Custom software and web applications tailored to your specific business needs.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317604/sd-card_jwzlef.png',
    href: 'services-software.html',
  },
  {
    title: 'Bootcamp',
    desc: 'Intensive training programs designed to upskill professionals in technology and engineering.',
    image: 'assets/images/kdt-bootcamp-workshop.png',
    href: 'services-bootcamp.html',
  },
];

function cardsHtml(services) { return services.map(s => `
  <article class="kdt-card group flex flex-col overflow-hidden bg-white">
    <div class="block bg-gray-200 aspect-[16/10] overflow-hidden">
      <img src="${contentUrl(s.image)}" alt="" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
    </div>
    <div class="p-5 sm:p-6 flex-grow flex flex-col border-t border-black/10">
      <p class="kdt-eyebrow text-gray-500 mb-3">KDT Service</p>
      <h3 class="text-gray-950 font-semibold text-lg sm:text-xl leading-snug">${escapeHtml(s.title)}</h3>
      <p class="text-gray-600 text-sm leading-relaxed mt-3 mb-6 flex-grow">
        ${escapeHtml(s.description || s.desc)}
      </p>
      <a href="${contentUrl(s.href)}" class="kdt-text-link">
        Explore service <span class="kdt-arrow-icon" aria-hidden="true"></span>
      </a>
    </div>
  </article>
`).join(''); }

(async function renderServices() {
const content = await getContentSection('home.services', {
  eyebrow: 'What we offer',
  title: 'Expertise that moves work forward.',
  body: 'KDT brings engineering, data, software, and practical training together to help organizations move from challenge to working solution.',
  items: fallbackServices,
});
document.querySelector('#services').innerHTML = `
<section class="kdt-section kdt-section-after-divider bg-[#f7f7f5]" aria-labelledby="services-heading">
  <div class="kdt-container">
    <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5 lg:gap-16 items-end mb-8 md:mb-10">
      <div>
        <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(content.eyebrow)}</p>
        <h2 id="services-heading" class="kdt-section-title">${escapeHtml(content.title)}</h2>
      </div>
      <p class="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl lg:justify-self-end">
        ${escapeHtml(content.body)}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
      ${cardsHtml(content.items.length ? content.items : fallbackServices)}
    </div>
  </div>
</section>
`;
})();
