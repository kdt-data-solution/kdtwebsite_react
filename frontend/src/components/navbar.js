import '../styles/style.css';
import { homeProducts } from '../data/homeProducts.js';
import { escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';
import { fallbackWebsiteServices, getWebsiteServices } from '../utils/services.js';

const BASE = import.meta.env.BASE_URL;
const navLink = (href, label, extra = '') => `<a href="${BASE}${href}" class="kdt-nav-link ${extra}"><span class="kdt-nav-label">${escapeHtml(label)}</span></a>`;

function productHref(product) {
  const href = String(product.href || '').trim();
  if (!href || href.startsWith('#')) return `${BASE}${href || '#product-directory'}`;
  if (/^https?:\/\//i.test(href)) return href;
  return `${BASE}${href.replace(/^\/+/, '')}`;
}

function productLinks(items, extra = '') {
  return items.map(product => `
    <a href="${escapeHtml(productHref(product))}" class="kdt-nav-link ${extra}">
      <span class="kdt-nav-label">${escapeHtml(product.name || product.title)}</span>
    </a>
  `).join('');
}

function serviceLinks(items, extra = '') {
  return items.map(service => navLink(service.href, service.title, extra)).join('');
}

const initialServices = [
  ...fallbackWebsiteServices,
  { slug: 'bootcamp', title: 'Bootcamp', href: 'services-bootcamp.html' },
];

document.querySelector('#navbar').innerHTML = `
<nav class="kdt-navbar" aria-label="Primary navigation">
  <div class="kdt-container">
    <div class="kdt-navbar-utility">
      <a class="kdt-brand" href="${BASE}" aria-label="KDT Network and Data Solution home"><img src="${BASE}assets/images/kdt-black.png" alt="KDT Network and Data Solution" class="kdt-brand-logo"></a>
      <div class="kdt-utility-links"><span class="kdt-utility-label">Network &amp; Data Solutions</span></div>
      <button id="mobile-menu-button" class="kdt-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
    </div>
    <div class="kdt-navbar-row"><div class="kdt-desktop-nav">
      ${navLink('', 'Home')}
      <div class="kdt-nav-dropdown"><button id="desktop-services-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-services-menu">Services <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-services-menu" class="kdt-dropdown-menu">${serviceLinks(initialServices)}</div></div>
      <div class="kdt-nav-dropdown"><button id="desktop-products-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-products-menu">Products <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-products-menu" class="kdt-dropdown-menu">${productLinks(homeProducts)}</div></div>
      ${navLink('media.html', 'Media')}
      <div class="kdt-nav-dropdown"><button id="desktop-about-button" type="button" class="kdt-nav-link kdt-nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="desktop-about-menu">About KDT <span class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="desktop-about-menu" class="kdt-dropdown-menu kdt-dropdown-right">${navLink('owner.html', 'Company Owner')}${navLink('about.html', 'Company Profile')}</div></div>
      <a href="${BASE}#contact" class="kdt-btn kdt-btn-light kdt-nav-cta">Contact us</a>
    </div></div>
    <div id="mobile-menu" class="kdt-mobile-menu" hidden>
      ${navLink('', 'Home')}<p class="kdt-mobile-heading">Services</p><div id="mobile-services-menu">${serviceLinks(initialServices, 'kdt-mobile-sub-link')}</div><p class="kdt-mobile-heading">Products</p><div id="mobile-products-menu">${productLinks(homeProducts, 'kdt-mobile-sub-link')}</div>${navLink('media.html', 'Media')}<button id="mobile-about-button" type="button" class="kdt-nav-link kdt-mobile-about" aria-expanded="false" aria-controls="mobile-about-menu"><span class="kdt-nav-label">About KDT</span> <span id="mobile-about-icon" class="kdt-nav-chevron" aria-hidden="true"></span></button><div id="mobile-about-menu" class="kdt-mobile-about-menu" hidden>${navLink('owner.html', 'Company Owner', 'kdt-mobile-sub-link')}${navLink('about.html', 'Company Profile', 'kdt-mobile-sub-link')}</div><a href="${BASE}#contact" class="kdt-btn kdt-btn-light">Contact us</a>
    </div>
  </div>
</nav>`;

const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); menuButton.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu'); mobileMenu?.toggleAttribute('hidden', open); });
document.getElementById('mobile-about-button')?.addEventListener('click', event => { const button = event.currentTarget; const open = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!open)); document.getElementById('mobile-about-menu')?.toggleAttribute('hidden', open); document.getElementById('mobile-about-icon')?.classList.toggle('is-open', !open); });

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
  const links = document.querySelectorAll('#navbar a[href]'); const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach(link => { const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/'; if (linkPath === currentPath) link.classList.add('is-active'); link.addEventListener('click', () => { links.forEach(item => item.classList.remove('is-active')); link.classList.add('is-active'); }); });
  if (currentPath.endsWith('/about.html') || currentPath.endsWith('/owner.html')) document.getElementById('desktop-about-button')?.classList.add('is-active');
})();

getWebsiteProducts().then(content => {
  const items = content.items?.length ? content.items : homeProducts;
  const desktopMenu = document.getElementById('desktop-products-menu');
  const mobileProductsMenu = document.getElementById('mobile-products-menu');
  if (desktopMenu) desktopMenu.innerHTML = productLinks(items);
  if (mobileProductsMenu) mobileProductsMenu.innerHTML = productLinks(items, 'kdt-mobile-sub-link');
});

getWebsiteServices().then(items => {
  const desktopMenu = document.getElementById('desktop-services-menu');
  const mobileMenu = document.getElementById('mobile-services-menu');
  if (desktopMenu) desktopMenu.innerHTML = serviceLinks(items);
  if (mobileMenu) mobileMenu.innerHTML = serviceLinks(items, 'kdt-mobile-sub-link');
});
