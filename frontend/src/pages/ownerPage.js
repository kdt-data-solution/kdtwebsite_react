import '../styles/style.css';
import { contentUrl, escapeHtml, getPageContent } from '../utils/content.js';

const img = name => `${import.meta.env.BASE_URL}assets/images/${name}`;

(async function renderOwnerPage() {
  const sections = await getPageContent('owner', {
    'owner.hero': {
      eyebrow: 'About KDT', title: 'Company Owner',
      body: 'Leadership grounded in software development, data science, artificial intelligence, and engineering.',
    },
    'owner.profile': {
      eyebrow: 'KDT Leadership', title: 'Kristoffer Dave A. Tabong', subtitle: 'Company Owner & President',
      body: "Kristoffer is a data scientist and software development leader with twelve years of professional experience. As President, he leads KDT's overall operations and the end-to-end delivery of custom software, data science, and AI solutions across web, mobile, and desktop platforms.",
      image_url: 'assets/images/kdt-owner-transparent-840.png',
      image_alt: 'Kristoffer Dave A. Tabong, Company Owner and President of KDT Network and Data Solution',
      items: [
        { type: 'paragraph', text: 'His multidisciplinary background includes directing construction-systems analytics, teaching data science and AI at the University of Santo Tomas, and structural engineering for vertical structures and major infrastructure across Southeast Asia, North America, the Middle East, and Europe. He currently also serves as a Junior Managing Engineer (Structural) consultant at the University of the Philippines.' },
        { type: 'stat', value: '12 years', label: 'Professional experience' },
        { type: 'stat', value: '4 pillars', label: 'KDT service leadership' },
        { type: 'stat', value: '3rd & 8th', label: 'National board exam placements' },
        { type: 'credentials', text: 'MS in Data Science, Asian Institute of Management; BS Civil Engineering, Magna Cum Laude, University of Santo Tomas. AWS Academy Cloud Architecting graduate and passer of the NCEES FE Civil and PE Civil Structural Engineering examinations. Associate Member, Association of Structural Engineers of the Philippines (ASEP).' },
        { type: 'link', label: 'View Resume (PDF)', href: 'assets/documents/kristoffer-dave-tabong-resume.pdf' },
        { type: 'link', label: 'LinkedIn', href: 'https://www.linkedin.com/in/kristoffer-dave-tabong-7183b2a7/' },
      ],
    },
  });
  const hero = sections['owner.hero'];
  const profile = sections['owner.profile'];
  const profileItems = profile.items || [];
  const extraParagraph = profileItems.find(item => item.type === 'paragraph');
  const stats = profileItems.filter(item => item.type === 'stat');
  const credentials = profileItems.find(item => item.type === 'credentials');
  const links = profileItems.filter(item => item.type === 'link');
  const resume = links.find(item => /resume/i.test(item.label || ''));
  const linkedin = links.find(item => /linkedin/i.test(item.label || ''));

document.querySelector('#owner-page').innerHTML = `
  <section class="bg-[#0b0b0b] text-white py-14 md:py-20" aria-labelledby="owner-page-heading">
    <div class="kdt-container">
      <header class="max-w-4xl">
        <p class="kdt-eyebrow text-gray-400 mb-4">${escapeHtml(hero.eyebrow)}</p>
        <h1 id="owner-page-heading" class="kdt-display text-white">${escapeHtml(hero.title)}</h1>
        <p class="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mt-6">
          ${escapeHtml(hero.body)}
        </p>
      </header>
    </div>
  </section>

  <section class="kdt-section bg-[#f7f7f5]">
    <div class="kdt-container">
      <article class="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-px bg-black/15 border border-black/15 items-stretch" aria-labelledby="owner-profile-heading">
        <div class="w-full min-h-[590px] lg:min-h-[760px] bg-white flex items-end justify-center overflow-hidden px-3 pt-8">
          <img src="${contentUrl(profile.image_url)}" alt="${escapeHtml(profile.image_alt)}" width="840" height="1262" loading="lazy" decoding="async" class="block w-auto max-w-full h-auto max-h-[720px] object-contain object-bottom" />
        </div>
        <div class="bg-white p-7 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center">
          <p class="kdt-eyebrow text-gray-500 mb-4">${escapeHtml(profile.eyebrow)}</p>
          <h2 id="owner-profile-heading" class="kdt-section-title">${escapeHtml(profile.title)}</h2>
          <p class="text-base sm:text-lg font-medium text-gray-700 mt-3 mb-7">${escapeHtml(profile.subtitle)}</p>
          <p class="text-gray-600 text-base leading-relaxed mb-6">
            ${escapeHtml(profile.body)}
          </p>
          <p class="text-gray-600 text-base leading-relaxed mb-8">
            ${escapeHtml(extraParagraph?.text || '')}
          </p>

          <dl class="grid grid-cols-1 sm:grid-cols-3 gap-5 border-y border-black/20 py-6 mb-6">
            ${stats.map(stat => `<div><dt class="text-lg font-bold text-gray-900">${escapeHtml(stat.value)}</dt><dd class="text-xs text-gray-500 mt-1">${escapeHtml(stat.label)}</dd></div>`).join('')}
          </dl>
          <p class="text-sm text-gray-600 leading-relaxed">
            ${escapeHtml(credentials?.text || '')}
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            ${resume ? `<a href="${contentUrl(resume.href)}" target="_blank" rel="noopener noreferrer" class="kdt-btn kdt-btn-dark" aria-label="View ${escapeHtml(profile.title)}'s resume in PDF format">${escapeHtml(resume.label)}</a>` : ''}
            ${linkedin ? `<a href="${contentUrl(linkedin.href)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-11 h-11 bg-[#111] border border-[#111] hover:bg-[#333]" aria-label="View ${escapeHtml(profile.title)}'s LinkedIn profile" title="LinkedIn">
              <img src="${img('linkedin.svg')}" alt="" aria-hidden="true" class="w-6 h-6" />
            </a>` : ''}
          </div>
        </div>
      </article>
    </div>
  </section>
`;
})();
