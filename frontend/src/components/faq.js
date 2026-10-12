import '../styles/style.css';
import { escapeHtml, getContentSection } from '../utils/content.js';

const faqItems = [
  { question: 'Who is the KDT product suite for?', answer: 'KDT products support structural engineers, estimators and project teams, business and data teams, warehouse operations, and professional organizations.' },
  { question: 'Can I ask KDT which product fits my work?', answer: 'Yes. Share your role and the work you need to support, and the KDT team can discuss the relevant product or service with you.' },
  { question: 'Does KDT offer services and education too?', answer: 'Yes. Alongside its product suite, KDT provides engineering, data, and software services, plus bootcamps and courses.' },
];

export const ready = (async function renderFaq() {
  const content = await getContentSection('home.faq', {
    eyebrow: 'Questions, answered',
    title: 'A clearer place to start.',
    body: 'Explore the suite, or talk with KDT about the work you need to do.',
  });
  document.querySelector('#faq').innerHTML = `
    <section class="kdt-faq-section" aria-labelledby="faq-heading">
      <div class="kdt-container kdt-faq-grid">
        <div><p class="kdt-eyebrow">${escapeHtml(content.eyebrow)}</p><h2 id="faq-heading">${escapeHtml(content.title)}</h2><p>${escapeHtml(content.body)}</p><a href="#contact">Talk to our team <span aria-hidden="true">↗</span></a></div>
        <div class="kdt-faq-list">${faqItems.map(item => `<details><summary>${escapeHtml(item.question)}<span aria-hidden="true">+</span></summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</div>
      </div>
    </section>
  `;
})();
