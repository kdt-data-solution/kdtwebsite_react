import '../styles/style.css';
import { contentUrl, escapeHtml, getContentSection } from '../utils/content.js';

const services = [
  { title: 'Architecture & Engineering', description: 'Project design and engineering support shaped around the requirements of each build.', href: 'services.html', image: 'assets/images/industry-engineering-construction.png', label: 'Built environment' },
  { title: 'Data Science & Analytics', description: 'Data and analytics work that helps teams turn information into useful decisions.', href: 'services-data.html', image: 'assets/images/datascience.png', label: 'Insight' },
  { title: 'Software Development', description: 'Custom digital products and software built around real organizational workflows.', href: 'services-software.html', image: 'assets/images/softwaredev.png', label: 'Digital systems' },
];

export const ready = (async function renderServices() {
  const content = await getContentSection('home.services', {
    eyebrow: 'KDT services',
    title: 'Expertise for work that matters.',
    body: 'Bring KDT in for engineering, data, and software work that fits your team and your goals.',
  });
  document.querySelector('#services').innerHTML = `
    <section class="kdt-services-section" aria-labelledby="services-heading">
      <div class="kdt-container">
        <div class="kdt-section-heading-row">
          <div><p class="kdt-eyebrow">${escapeHtml(content.eyebrow)}</p><h2 id="services-heading">${escapeHtml(content.title)}</h2></div>
          <p>${escapeHtml(content.body)}</p>
        </div>
        <div class="kdt-services-grid">
          ${services.map((service, index) => `
            <article class="kdt-service-card">
              <div class="kdt-service-image"><img src="${contentUrl(service.image)}" alt="" loading="lazy" decoding="async" /><span>${service.label}</span></div>
              <div class="kdt-service-copy"><span class="kdt-service-number">0${index + 1} / SERVICE</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><a href="${contentUrl(service.href)}">Explore service <span aria-hidden="true">↗</span></a></div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
})();
