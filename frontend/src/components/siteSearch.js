import { homeProducts } from '../data/homeProducts.js';
import { escapeHtml } from '../utils/content.js';

const BASE = import.meta.env.BASE_URL;

const searchItems = [
  ...homeProducts.map(product => ({
    title: product.name,
    kind: 'Product',
    description: product.description,
    href: product.href,
    terms: `${product.category} ${product.searchTerms} ${product.audiences.join(' ')} ${(product.highlights || []).join(' ')}`,
  })),
  { title: 'Architecture & Engineering Services', kind: 'Service', description: 'Engineering and design support for building projects.', href: 'services.html', terms: 'structural civil architecture engineering design consultancy' },
  { title: 'Data Science & Analytics', kind: 'Service', description: 'Analytics, dashboards, and data solutions for better decisions.', href: 'services-data.html', terms: 'business intelligence data dashboards analysis' },
  { title: 'Software Development', kind: 'Service', description: 'Custom software and digital products shaped around your workflow.', href: 'services-software.html', terms: 'applications websites software development digital systems' },
  { title: 'Community & Perspectives', kind: 'Community', description: 'Explore KDT articles and perspectives across engineering, data, and software.', href: 'media.html', terms: 'community articles editorials insights perspectives' },
  { title: 'KDT Bootcamp', kind: 'Education', description: 'Practical technology and engineering learning programs.', href: 'services-bootcamp.html', terms: 'education training bootcamp workshop' },
  { title: 'Basic Programming and Vibe Coding', kind: 'Education', description: 'A beginner-friendly introduction to programming and AI-assisted building.', href: 'course.html?slug=basic-programming-and-vibe-coding', terms: 'course learning coding programming python ai' },
  { title: 'AI Chatbots & Agents', kind: 'Education', description: 'Learn the foundations of chatbots, agents, retrieval, and deployment.', href: 'course.html?slug=ai-chatbots-and-agents', terms: 'course learning ai chatbot agent' },
  { title: 'Data Visualization & Dashboards', kind: 'Education', description: 'Learn to analyze data and communicate insights with dashboards.', href: 'course.html?slug=data-visualization-and-dashboard', terms: 'course learning data analytics dashboard visualization' },
  { title: 'AI and Python Automation', kind: 'Education', description: 'Explore automation workflows using Python and AI tools.', href: 'course.html?slug=automation-using-ai-and-python', terms: 'course learning automation python ai' },
];

function matchesFor(query) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];
  return searchItems
    .map(item => {
      const title = item.title.toLocaleLowerCase();
      const searchable = `${item.title} ${item.description} ${item.kind} ${item.terms}`.toLocaleLowerCase();
      const index = searchable.indexOf(normalized);
      return { item, index, score: title === normalized ? 0 : (title.startsWith(normalized) ? 1 : (title.includes(normalized) ? 2 : 3)) };
    })
    .filter(result => result.index !== -1)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, 7)
    .map(result => result.item);
}

export function initSiteSearch() {
  const form = document.querySelector('.kdt-site-search');
  const input = document.getElementById('site-search-input');
  const results = document.getElementById('site-search-results');
  if (!form || !input || !results) return;

  let matches = [];
  let activeIndex = -1;
  const close = () => {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  };
  const render = () => {
    matches = matchesFor(input.value);
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    if (!input.value.trim()) {
      results.replaceChildren();
      close();
      return;
    }

    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (!matches.length) {
      results.innerHTML = `<div class="kdt-search-empty"><strong>No matches for “${escapeHtml(input.value.trim())}”</strong><span>Try a product name, profession, or work area.</span><a href="${BASE}#contact">Ask our team <span aria-hidden="true">↗</span></a></div>`;
      return;
    }
    results.innerHTML = matches.map((item, index) => `
      <a id="site-search-option-${index}" role="option" aria-selected="false" href="${BASE}${escapeHtml(item.href)}" class="kdt-search-option">
        <span class="kdt-search-option-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small></span>
        <span class="kdt-search-kind">${escapeHtml(item.kind)}</span>
      </a>
    `).join('');
  };
  const setActive = index => {
    const options = [...results.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => option.setAttribute('aria-selected', String(optionIndex === activeIndex)));
    input.setAttribute('aria-activedescendant', options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', () => { if (input.value.trim()) render(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' && !results.hidden && matches.length) {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === 'ArrowUp' && !results.hidden && matches.length) {
      event.preventDefault();
      setActive(activeIndex < 0 ? matches.length - 1 : activeIndex - 1);
    } else if (event.key === 'Escape') {
      close();
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = activeIndex >= 0 ? matches[activeIndex] : matchesFor(input.value)[0];
    if (selected) window.location.href = `${BASE}${selected.href}`;
    else if (input.value.trim()) render();
  });
  document.addEventListener('click', event => {
    if (!form.contains(event.target)) close();
  });
}
