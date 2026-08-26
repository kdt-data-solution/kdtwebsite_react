import '../styles/style.css';
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

const fallback = {
  eyebrow: 'Industry partners',
  title: 'Collaboration built around shared expertise.',
  body: 'KDT works with industry partners to connect specialist knowledge, technology, and practical delivery.',
  items: [
    { name: 'JPF', image: 'assets/images/jpf.png' },
    { name: 'Maverick', image: 'assets/images/mav.png' },
  ],
};

(async function renderPartners() {
  const content = await getContentSection('home.partners', fallback);
  document.querySelector('#partners').innerHTML = `
  <section class="kdt-section bg-white border-y border-black/10" aria-labelledby="partners-heading">
    <div class="kdt-container">
      <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-center">
        <div>
          <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(content.eyebrow)}</p>
          <h2 id="partners-heading" class="kdt-section-title">${escapeHtml(content.title)}</h2>
          <p class="text-gray-600 text-base leading-relaxed mt-5 max-w-xl">
            ${escapeHtml(content.body)}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
          ${content.items.map((partner) => `
            <div class="min-h-44 sm:min-h-52 bg-[#f7f7f5] flex items-center justify-center p-8 sm:p-10">
              <img src="${contentUrl(partner.image)}" alt="${escapeHtml(partner.name)} industry partner logo" loading="lazy" decoding="async" class="h-16 sm:h-20 w-auto max-w-full object-contain" />
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>
`;
})();
