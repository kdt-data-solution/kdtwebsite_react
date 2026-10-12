import '../styles/style.css';
import '../styles/home.css';
import { homeProducts } from '../data/homeProducts.js';
import { escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';
import { fallbackWebsiteServices, getWebsiteServices } from '../utils/services.js';
import { initPublicChat } from './publicChat.js';

const BASE = import.meta.env.BASE_URL;

initPublicChat();
const navLink = (href, label, extra = '') => `<a href="${BASE}${href}" class="kdt-nav-link ${extra}"><span class="kdt-nav-label">${escapeHtml(label)}</span></a>`;

function productHref(product) {
  const href = String(product.href || '').trim();
  if (!href || href.startsWith('#')) return `${BASE}${href || '#products'}`;
  if (/^https?:\/\//i.test(href)) return href;
  return `${BASE}${href.replace(/^\/+/, '')}`;
}

function productLinks(items, extra = '') {
  return items.map(product => `<a href="${escapeHtml(productHref(product))}" class="kdt-nav-link ${extra}"><span class="kdt-nav-label">${escapeHtml(product.name || product.title)}</span><span class="kdt-nav-description">${escapeHtml(product.category || '')}</span></a>`).join('');
}

function serviceLinks(items, extra = '') {
  return items.filter(service => service.slug !== 'bootcamp').map(service => navLink(service.href, service.title, extra)).join('');
}

const initialServices = fallbackWebsiteServices;
const courseLinks = [
  ['basic-programming-and-vibe-coding', 'Basic Programming and Vibe Coding'],
  ['ai-chatbots-and-agents', 'AI Chatbots & Agents'],
  ['data-visualization-and-dashboard', 'Data Visualization & Dashboards'],
  ['automation-using-ai-and-python', 'AI and Python Automation'],
].map(([slug, title]) => navLink(`course.html?slug=${slug}`, title));

document.querySelector('#navbar').innerHTML = `
<nav class="kdt-navbar" aria-label="Primary navigation">
  <div class="kdt-container kdt-navbar-inner">
    <a class="kdt-brand" href="${BASE}" aria-label="KDT Network and Data Solution home"><img src="${BASE}assets/images/kdt-black.png" alt="KDT Network and Data Solution" class="kdt-brand-logo"></a>
    <div class="kdt-desktop-nav">
      <div class="kdt-nav-dropdown"><button id="desktop-products-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-products-menu">Product <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-products-menu" class="kdt-dropdown-menu kdt-products-menu">${productLinks(homeProducts)}${navLink('#products', 'Explore products', 'kdt-dropdown-footer-link')}</div></div>
      <div class="kdt-nav-dropdown"><button id="desktop-services-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-services-menu">Services <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-services-menu" class="kdt-dropdown-menu">${serviceLinks(initialServices)}${navLink('services.html', 'Explore all services', 'kdt-dropdown-footer-link')}</div></div>
      ${navLink('media.html', 'Community')}
      <div class="kdt-nav-dropdown"><button id="desktop-education-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-education-menu">Education <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-education-menu" class="kdt-dropdown-menu kdt-dropdown-right">${navLink('services-bootcamp.html', 'Bootcamps')}${courseLinks.join('')}</div></div>
      <a href="${BASE}#site-search-input" class="kdt-nav-search" aria-label="Search KDT products, services, and learning"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span>Search</span></a>
      <a href="${BASE}#contact" class="kdt-btn kdt-btn-dark kdt-nav-cta">Talk to our team <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
    </div>
    <button id="mobile-menu-button" class="kdt-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
    <div id="mobile-menu" class="kdt-mobile-menu" hidden>
      ${navLink('#products', 'Products')}
      <div id="mobile-products-menu" class="kdt-mobile-submenu">${productLinks(homeProducts, 'kdt-mobile-sub-link')}</div>
      ${navLink('services.html', 'Services')}
      <div id="mobile-services-menu" class="kdt-mobile-submenu">${serviceLinks(initialServices, 'kdt-mobile-sub-link')}</div>
      ${navLink('media.html', 'Community')}
      ${navLink('#education', 'Education')}
      <div id="mobile-education-menu" class="kdt-mobile-submenu">${navLink('services-bootcamp.html', 'Bootcamps', 'kdt-mobile-sub-link')}${courseLinks.map(link => link.replace('class="kdt-nav-link "', 'class="kdt-nav-link kdt-mobile-sub-link"')).join('')}</div>
      ${navLink('#site-search-input', 'Search KDT')}
      <a href="${BASE}#contact" class="kdt-btn kdt-btn-dark">Talk to our team <span class="kdt-arrow-icon" aria-hidden="true"></span></a>
    </div>
  </div>
</nav>`;

const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
function closeMobileMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation menu');
  mobileMenu?.setAttribute('hidden', '');
}

mobileMenu?.addEventListener('click', event => {
  if (event.target.closest('a[href]')) closeMobileMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu();
    menuButton?.focus();
  }
});
window.addEventListener('pageshow', closeMobileMenu);
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
  mobileMenu?.toggleAttribute('hidden', open);
});

const desktopDropdownButtons = [...document.querySelectorAll('.kdt-nav-trigger')];
const closeDesktopDropdowns = (except = null) => {
  desktopDropdownButtons.forEach(button => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    button.closest('.kdt-nav-dropdown')?.classList.remove('is-open');
  });
};

desktopDropdownButtons.forEach(button => {
  const dropdown = button.closest('.kdt-nav-dropdown');
  dropdown?.addEventListener('mouseenter', () => {
    closeDesktopDropdowns(button);
    button.setAttribute('aria-expanded', 'true');
  });
  dropdown?.addEventListener('mouseleave', () => {
    button.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
  });
  dropdown?.addEventListener('focusin', () => button.setAttribute('aria-expanded', 'true'));
  dropdown?.addEventListener('focusout', event => {
    if (dropdown.contains(event.relatedTarget)) return;
    button.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
  });
  button.addEventListener('click', event => {
    event.stopPropagation();
    const willOpen = !dropdown?.classList.contains('is-open');
    closeDesktopDropdowns(button);
    button.setAttribute('aria-expanded', String(willOpen));
    dropdown?.classList.toggle('is-open', willOpen);
  });
  dropdown?.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    button.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
    button.focus();
  });
});
document.addEventListener('click', () => closeDesktopDropdowns());

(function setActiveNavLink() {
  const links = document.querySelectorAll('#navbar a[href]');
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) link.classList.add('is-active');
  });
})();

getWebsiteProducts().then(content => {
  const items = content.items?.length ? content.items : homeProducts;
  const menu = document.getElementById('desktop-products-menu');
  if (menu) menu.innerHTML = `${productLinks(items)}${navLink('#products', 'Explore products', 'kdt-dropdown-footer-link')}`;
  const mobile = document.getElementById('mobile-products-menu');
  if (mobile) mobile.innerHTML = productLinks(items, 'kdt-mobile-sub-link');
});

getWebsiteServices().then(items => {
  const services = items.filter(service => service.slug !== 'bootcamp');
  const menu = document.getElementById('desktop-services-menu');
  if (menu) menu.innerHTML = `${serviceLinks(services)}${navLink('services.html', 'Explore all services', 'kdt-dropdown-footer-link')}`;
  const mobile = document.getElementById('mobile-services-menu');
  if (mobile) mobile.innerHTML = serviceLinks(services, 'kdt-mobile-sub-link');
});
