import "../styles/style.css";
import { Dropdown } from './Dropdown.js';
import { escapeHtml, getContentSection } from '../utils/content.js';

const faqData = [
  {
    question: "What services do you offer?",
    answer: "We provide data analytics, software development, and engineering professional design services tailored to your business needs."
  },
  {
    question: "How can I get started?",
    answer: "Simply contact us through our website or call our team. We'll schedule a consultation to discuss your project requirements."
  },
  {
    question: "What is your pricing model?",
    answer: "Our pricing is project-based and depends on the scope and complexity. We provide detailed quotes after understanding your needs."
  },
  {
    question: "Do you offer support after project completion?",
    answer: "Yes, we provide ongoing support and maintenance services to ensure your solution continues to perform optimally."
  }
];

(async function renderFaq() {
const content = await getContentSection('home.faq', {
  eyebrow: 'Questions, answered',
  title: 'Frequently Asked Questions',
  body: 'Clear answers about KDT services, project engagement, pricing, and ongoing support.',
  items: faqData,
});
const dropdownsHTML = content.items.map(item => new Dropdown(escapeHtml(item.question), escapeHtml(item.answer)).render()).join('');

document.querySelector("#faq").innerHTML = `
<section class="kdt-section bg-white" aria-labelledby="faq-heading">
  <div class="kdt-container">
    <div class="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-10 lg:gap-20 items-start">

      <div>
        <p class="kdt-eyebrow text-gray-500 mb-3">${escapeHtml(content.eyebrow)}</p>
        <h2 id="faq-heading" class="kdt-section-title">
          ${escapeHtml(content.title)}
        </h2>
        <p class="text-gray-600 text-base leading-relaxed mt-5 max-w-lg">
          ${escapeHtml(content.body)}
        </p>
      </div>

      <div class="w-full border-t border-black">
        ${dropdownsHTML}
      </div>
      
    </div>
  </div>
</section>
`;

Dropdown.initializeDropdowns();
})();
