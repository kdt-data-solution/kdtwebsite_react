import { homeProducts } from '../data/homeProducts.js';
import { API_BASE } from './auth.js';
import { getContentSection } from './content.js';
import { getPublicJson } from './publicJson.js';

function normalizeProduct(row, index, metadata = {}) {
  const slug = String(row.slug || metadata.slug || '').trim();
  const href = metadata.href || `product.html?slug=${encodeURIComponent(slug)}`;

  return {
    ...row,
    ...metadata,
    name: metadata.name || row.title || 'Untitled product',
    description: metadata.description || row.description || '',
    number: String(index + 1).padStart(2, '0'),
    slug,
    href,
    logo: metadata.logo || row.image_url || '',
  };
}

/**
 * Load website product presentation data. The five public product identities
 * and scopes are canonical in homeProducts; CMS/API data can still provide
 * ancillary presentation fields, but legacy records cannot rename or redefine
 * these products, and an empty API response cannot remove them.
 */
export async function getWebsiteProducts() {
  const fallbackSection = {
    eyebrow: 'Built by KDT',
    title: 'Popular products',
    subtitle: 'KDT products A–Z',
    items: homeProducts,
  };

  const [section, productsResult] = await Promise.all([
    getContentSection('home.products', fallbackSection),
    getPublicJson(`${API_BASE}/api/products`)
      .then(rows => {
        if (!Array.isArray(rows)) throw new Error('Products response is not a list');
        return rows;
      })
      .then(rows => ({ ok: true, rows }))
      .catch(() => ({ ok: false, rows: [] })),
  ]);

  const presentationItems = Array.isArray(section.items) && section.items.length
    ? section.items
    : homeProducts;
  const metadataBySlug = new Map(
    presentationItems
      .filter(item => item?.slug)
      .map(item => [String(item.slug), item]),
  );

  const rows = productsResult.ok ? productsResult.rows : presentationItems;
  const rowsBySlug = new Map(rows.map(row => [String(row.slug || ''), row]));
  const canonicalSlugs = new Set(homeProducts.map(product => product.slug));
  const items = homeProducts.map((canonical, index) => {
    const row = rowsBySlug.get(canonical.slug) || {};
    const metadata = metadataBySlug.get(canonical.slug) || {};
    return normalizeProduct(row, index, { ...metadata, ...canonical });
  });

  // Keep separately managed products available after the canonical suite.
  rows.forEach(row => {
    const slug = String(row.slug || '');
    if (!slug || canonicalSlugs.has(slug)) return;
    items.push(normalizeProduct(row, items.length, metadataBySlug.get(slug)));
  });

  return { ...section, items };
}
