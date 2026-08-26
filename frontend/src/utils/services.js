import { API_BASE } from './auth.js';

export const fallbackWebsiteServices = [
  { slug: 'architecture', title: 'Architecture and Engineering Services', href: 'services.html' },
  { slug: 'data', title: 'Data Science and Analytics', href: 'services-data.html' },
  { slug: 'software', title: 'Software Development', href: 'services-software.html' },
];

const bootcampLink = {
  slug: 'bootcamp',
  title: 'Bootcamp',
  href: 'services-bootcamp.html',
  isStatic: true,
};

export async function getWebsiteServices() {
  try {
    const response = await fetch(`${API_BASE}/api/services`);
    if (!response.ok) throw new Error(`Services request failed (${response.status})`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Services response is not a list');

    const metadataBySlug = new Map(
      fallbackWebsiteServices.map(service => [service.slug, service]),
    );
    return [
      ...rows.map(row => ({
        ...metadataBySlug.get(row.slug),
        ...row,
        href: metadataBySlug.get(row.slug)?.href
          || `services.html?slug=${encodeURIComponent(row.slug || '')}`,
      })),
      bootcampLink,
    ];
  } catch {
    return [...fallbackWebsiteServices, bootcampLink];
  }
}
