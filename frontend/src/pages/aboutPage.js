import '../styles/style.css';
import { getSiteSettings } from '../utils/siteSettings.js';
import { contentUrl, escapeHtml, getPageContent } from '../utils/content.js';

const fallbackStats = [
  { value: '3+', label: 'Years Experience' },
  { value: '30+', label: 'Successful Projects' },
  { value: '2+', label: 'Active Partners' },
  { value: '9+', label: 'Team Members' },
];

const img = (name) => `${import.meta.env.BASE_URL}assets/images/${name}`;

const redirectLegacyOwnerUrl = () => {
  if (window.location.hash === '#owner-spotlight') {
    window.location.replace(`${import.meta.env.BASE_URL}owner.html`);
  }
};

redirectLegacyOwnerUrl();
window.addEventListener('hashchange', redirectLegacyOwnerUrl);

const fallbackValues = [
  {
    title: 'Innovation',
    desc: 'Creating new ideas and improving solutions to meet changing needs.',
    icon: 'assets/images/ai-innovation-01-stroke-rounded.svg',
  },
  {
    title: 'Quality',
    desc: 'Delivering high-standard products and services that meet expectations.',
    icon: 'assets/images/quality.svg',
  },
  {
    title: 'Integrity',
    desc: 'Serving with honesty, transparency, and strong moral principles.',
    icon: 'assets/images/integrity.svg',
  },
];

(async function renderAboutPage() {
const sections = await getPageContent('about', {
  'about.hero': {
    eyebrow: 'Company Profile', title: 'KDT Network and Data Solution',
    body: 'KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm dedicated to providing efficient and cost-effective data science and analytics, information technology, and professional design services. Combining these skillsets, we aim to be digital enablers for companies, institutions, and organizations.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776392434/about-illustration_fj4suq.png',
    image_alt: 'KDT engineering, data, and digital solutions',
    cta_label: 'View Company Profile (PDF)', cta_url: 'assets/documents/kdt-company-profile.pdf',
  },
  'about.stats': { items: fallbackStats },
  'about.values': { eyebrow: 'Our principles', title: 'We are committed to', subtitle: 'Creating intuitive digital solutions that simplify everyday processes', items: fallbackValues },
  'about.story': {
    eyebrow: 'Who we are', title: 'Our Story',
    body: 'KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm committed to helping organizations transform and improve through technology and design. By combining expertise in data science and analytics, information technology, and professional design services, KDT positions itself as a digital enabler for companies, institutions, and organizations. Their goal is to provide efficient and cost-effective solutions that support better decision-making, streamlined operations, and improved digital presence across various industries.',
    subtitle: 'KDT offers a wide range of services that cater to modern digital needs. Delivering practical digital solutions that help businesses and organizations adapt to the evolving technological landscape, improve productivity, and achieve long-term growth through innovation.',
  },
});
const hero = sections['about.hero'];
const stats = sections['about.stats'].items || fallbackStats;
const valuesContent = sections['about.values'];
const values = valuesContent.items || fallbackValues;
const story = sections['about.story'];

document.querySelector('#about-page').innerHTML = `
  <!-- About Hero -->
  <section class="bg-[#0b0b0b] text-white overflow-hidden">
    <div class="kdt-container px-0">
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
        <div class="kdt-hero-copy flex flex-col justify-center items-start">
          <p class="kdt-eyebrow text-gray-400 mb-4">${escapeHtml(hero.eyebrow)}</p>
          <h1 class="kdt-display text-white">
            ${escapeHtml(hero.title)}
          </h1>
          <p class="text-gray-300 text-base sm:text-lg leading-relaxed mt-6 mb-8 max-w-xl">
            ${escapeHtml(hero.body)}
          </p>
          <a href="${contentUrl(hero.cta_url)}" target="_blank" rel="noopener noreferrer" class="kdt-btn kdt-btn-light">
            ${escapeHtml(hero.cta_label)}
          </a>
        </div>
        <div class="w-full min-h-[420px] lg:min-h-full bg-[#ededeb] flex items-center justify-center p-8 sm:p-12">
          <img src="${contentUrl(hero.image_url)}" alt="${escapeHtml(hero.image_alt)}" class="w-full h-full max-h-[520px] object-contain" onerror="this.parentElement.classList.add('bg-gray-200');this.style.display='none'" />
        </div>
      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <section class="bg-white border-b border-black/10">
    <div class="kdt-container">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10">
        ${stats
          .map(
            (s) => `
          <div class="bg-white px-4 py-7 sm:px-6 sm:py-9 text-left">
            <p class="text-2xl md:text-3xl font-semibold text-gray-950">${escapeHtml(s.value)}</p>
            <p class="text-xs md:text-sm text-gray-600 mt-1">${escapeHtml(s.label)}</p>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- We are Committed To -->
  <section class="kdt-section bg-[#f7f7f5]">
    <div class="kdt-container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-end mb-10 md:mb-14">
        <div>
          <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(valuesContent.eyebrow)}</p>
          <h2 class="kdt-section-title">${escapeHtml(valuesContent.title)}</h2>
        </div>
        <p class="text-gray-600 text-base sm:text-lg max-w-xl lg:justify-self-end">
          ${escapeHtml(valuesContent.subtitle)}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10">
        ${values
          .map(
            (v) => `
          <article class="bg-white p-7 sm:p-9 min-h-64 flex flex-col items-start">
            <div class="text-gray-900 mb-8"><img src="${contentUrl(v.icon)}" alt="" class="w-10 h-10" /></div>
            <h3 class="font-semibold text-gray-950 text-lg md:text-xl mb-3">${escapeHtml(v.title)}</h3>
            <p class="text-gray-600 text-sm leading-relaxed max-w-sm">${escapeHtml(v.description || v.desc)}</p>
          </article>
        `,
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Our Story -->
  <section class="kdt-section bg-white">
    <div class="kdt-container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

        <div>
          <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(story.eyebrow)}</p>
          <h2 class="kdt-section-title mb-6">${escapeHtml(story.title)}</h2>
          <p class="text-gray-600 text-base leading-relaxed mb-5">
            ${escapeHtml(story.body)}
          </p>
          <p class="text-gray-600 text-base leading-relaxed mb-8">
            ${escapeHtml(story.subtitle)}
          </p>

          <div class="border-t border-black/20">
            <div class="flex items-center gap-3 border-b border-black/20 w-full py-4">
              <img src="${img('loc.svg')}" alt="Address" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Address</p>
                <p class="text-xs text-gray-600" id="about-address">Loading...</p>
              </div>
            </div>

            <div class="flex items-center gap-3 border-b border-black/20 w-full py-4">
              <img src="${img('clock-01-stroke-rounded.svg')}" alt="Business Hours" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Business hours</p>
                <p class="text-xs text-gray-600" id="about-hours">Loading...</p>
              </div>
            </div>

            <div class="flex items-center gap-3 border-b border-black/20 w-full py-4">
              <img src="${img('contact.svg')}" alt="Contact" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Contact information</p>
                <p class="text-xs text-gray-600" id="about-contact">Loading...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-px bg-black/10 border border-black/10 w-full h-full min-h-[340px] lg:min-h-[480px]">
          <div class="bg-[#0b0b0b] overflow-hidden flex items-center justify-center p-6">
            <img src="${img('kdt-black.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-[#f1f1ef] overflow-hidden flex items-center justify-center p-6">
            <img src="${img('kdt-logo.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-[#f1f1ef] overflow-hidden flex items-center justify-center p-6">
            <img src="${img('kdt-logo.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-[#0b0b0b] overflow-hidden flex items-center justify-center p-6">
            <img src="${img('kdt-black.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
        </div>

      </div>
    </div>
  </section>
`;

getSiteSettings().then(s => {
  const addr = document.getElementById('about-address');
  const hrs = document.getElementById('about-hours');
  const contact = document.getElementById('about-contact');
  const phone = !s.contact_phone || s.contact_phone === '639+ 000 000 000' ? '84635344' : s.contact_phone;
  const email = !s.contact_email || s.contact_email === 'kdy@gmail.com' ? 'kristoffer.tabong@kdtdatasolution.com' : s.contact_email;
  if (addr) addr.textContent = s.address || '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City';
  if (hrs) hrs.textContent = s.business_hours || 'Monday - Friday (8:00 am - 5:00 pm)';
  if (contact) contact.textContent = `${phone} | ${email}`;
});
})();
