import { homeProducts } from '../data/homeProducts.js';
import { API_BASE } from './auth.js';
import { getContentSection } from './content.js';

function normalizeProduct(row, index, metadata = {}) {
  const slug = String(row.slug || metadata.slug || '').trim();
  const href = metadata.href || `product.html?slug=${encodeURIComponent(slug)}`;

  return {
    ...metadata,
    ...row,
    name: row.title || metadata.name || 'Untitled product',
    number: String(index + 1).padStart(2, '0'),
    slug,
    href,
  };
}

/**
 * Load website product presentation data with the Django-managed Products table
 * as the source of truth. The home.products section still controls headings and
 * may provide legacy page links for existing products.
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
    fetch(`${API_BASE}/api/products`)
      .then(async response => {
        if (!response.ok) throw new Error(`Products request failed (${response.status})`);
        const rows = await response.json();
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
  const items = rows.map((row, index) =>
    normalizeProduct(row, index, metadataBySlug.get(String(row.slug || ''))),
  );

  return { ...section, items };
}
