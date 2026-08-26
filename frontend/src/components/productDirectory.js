import '../styles/style.css';
import { contentUrl, escapeHtml } from '../utils/content.js';
import { getWebsiteProducts } from '../utils/products.js';

const root = document.querySelector('#product-directory');

(async function renderProductDirectory() {
const content = await getWebsiteProducts();
const productsSource = content.items;
const groups = [...productsSource]
  .sort((a, b) => a.name.localeCompare(b.name))
  .reduce((result, product) => {
    const letter = product.name.charAt(0).toUpperCase();
    (result[letter] ||= []).push(product);
    return result;
  }, {});

root.innerHTML = `
  <section class="bg-[#f1f1ef] border-b border-black/10" aria-labelledby="product-directory-heading">
    <div class="kdt-container py-12 sm:py-14 lg:py-16">
      <h2 id="product-directory-heading" class="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-gray-950 mb-8">All products list</h2>

      <div class="bg-white border border-black/15">
        <button id="product-directory-toggle" type="button" class="w-full min-h-16 px-5 sm:px-6 flex items-center justify-between gap-5 text-left font-medium text-sm text-gray-950" aria-expanded="true" aria-controls="product-directory-panel">
          <span>${escapeHtml(content.subtitle || 'KDT products A–Z')}</span>
          <span class="kdt-directory-chevron is-open" aria-hidden="true"></span>
        </button>

        <div id="product-directory-panel" class="border-t border-black/10 px-5 py-8 sm:px-6 sm:py-10">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-8">
            ${Object.entries(groups).map(([letter, products]) => `
              <div>
                <h3 class="text-base font-semibold text-gray-950 mb-3">${letter}</h3>
                <ul class="m-0 p-0 list-none">
                  ${products.map((product) => `<li class="border-b border-black/10 text-sm"><a href="${contentUrl(product.href || `product.html?slug=${encodeURIComponent(product.slug || '')}`)}" class="block py-3 text-gray-700 hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">${escapeHtml(product.name)}</a></li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const toggle = root.querySelector('#product-directory-toggle');
const panel = root.querySelector('#product-directory-panel');
const chevron = toggle?.querySelector('.kdt-directory-chevron');

function setExpanded(expanded) {
  toggle?.setAttribute('aria-expanded', String(expanded));
  panel?.toggleAttribute('hidden', !expanded);
  chevron?.classList.toggle('is-open', expanded);
}

toggle?.addEventListener('click', () => {
  setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('#view-product-directory')) return;
  setExpanded(true);
});
})();
