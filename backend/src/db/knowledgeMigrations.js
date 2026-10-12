import { KNOWLEDGE_SEEDS } from './knowledgeSeeds.js';

// Exact snapshots of the first public knowledge entries. Matching the seeded
// body prevents this migration from replacing an administrator's edited copy.
export const LEGACY_KNOWLEDGE_SEEDS = [
  {
    slug: 'axisstruct-product-overview',
    title: 'AxisStruct product overview and current limits',
    keywords: 'axis axisstruct structural engineering frame analysis truss recovery scope availability',
    body: 'AxisStruct is KDT’s public product name for the AXIS structural-engineering desktop application. The AXIS repository describes the software as recovery-stage and explicitly says it is not for production engineering or construction documents. Its documented packaged numerical scope is limited linear-static 3D frame analysis and X-Z planar pin-jointed truss analysis with joint loads. The app supports structural model and load workflows, but this limited solver scope must not be presented as full building analysis, design-code verification, or construction-document capability. Do not give structural or safety advice. Ask the KDT team about current access and product status.',
  },
  {
    slug: 'takeoff-product-overview',
    title: 'TakeOff quantity take-off and materials estimating',
    keywords: 'takeoff take off quantity estimating estimator PDF plan calibrate measurement material assembly BOQ Excel Fajardo',
    body: 'TakeOff is a Windows desktop app for construction quantity take-off and materials estimating from PDF plans. The workflow imports selected PDF pages or blank sheets, calibrates a drawing scale, records area, length, count and other supported measurements, assigns measurements to material assemblies, prices materials from a local reference database, consolidates a bill of quantities and exports an Excel estimate workbook. It also supports manual estimate lines for items that are not tied to a plan measurement. The current README says labor costing is not implemented. Ask KDT about the current release and supported assembly catalog.',
  },
  {
    slug: 'nexus-product-overview',
    title: 'Nexus professional organization portal',
    keywords: 'nexus association professional organization membership members directory events learning CPD CPDD certificates administration',
    body: 'Nexus is a configurable portal for professional organizations. Implemented areas include member records and member-facing services, event administration and registration workflows, learning and CPD/CPDD tools, and certificate workflows, with organization administrators managing content and operations. Each organization is deployed with its own application and database; the project README explicitly says it is not a shared multi-tenant application. Do not promise every organization module, payment provider, or white-label configuration without confirming its setup. Ask KDT which modules are enabled for a specific organization.',
  },
  {
    slug: 'kuwalog-product-overview',
    title: 'Kuwalog warehouse workflows and mobile app',
    keywords: 'kuwalog warehouse inventory stock receive receiving pick picking transfer count cycle count barcode QR mobile offline sync',
    body: 'Kuwalog combines a warehouse web application and a worker-focused mobile app. The mobile app includes stock lookup, purchase-order receiving, assigned pick tasks, bin-to-bin transfers and cycle counts. Barcode or QR scanning supports floor workflows. The app caches lists and queues supported changes while offline, then syncs them when connectivity returns. The project README identifies pack and ship mobile screens as stubs, so do not describe those workflows as available. Ask KDT about warehouse setup and the current supported release.',
  },
  {
    slug: 'vantage-product-overview',
    title: 'Vantage visual data-mining and analytics workflows',
    keywords: 'vantage data analytics data mining visual workflow node operators transformation machine learning charts visualization',
    body: 'Vantage is a desktop visual data-mining and analytics application. Users assemble node-based workflows from data access, preparation, machine-learning and evaluation operators, run the connected workflow, and inspect results and visualizations. Its repository marks the project as active development and tracks feature status separately; the assistant must not claim that every planned operator, chart, or model-deployment capability is complete. Confirm current supported inputs and workflow needs with KDT.',
  },
];

export function migrateLegacyKnowledgeSeeds(database) {
  const currentBySlug = new Map(KNOWLEDGE_SEEDS.map((entry) => [entry.slug, entry]));
  const update = database.prepare(`
    UPDATE knowledge_base_entries
    SET title = CASE WHEN title = ? THEN ? ELSE title END,
        body = ?,
        keywords = CASE WHEN keywords = ? THEN ? ELSE keywords END,
        updated_at = datetime('now')
    WHERE slug = ? AND body = ? AND is_published = 1
  `);

  return database.transaction(() => LEGACY_KNOWLEDGE_SEEDS.reduce((updated, legacy) => {
    const current = currentBySlug.get(legacy.slug);
    if (!current) return updated;
    const result = update.run(
      legacy.title,
      current.title,
      current.body,
      legacy.keywords,
      current.keywords,
      legacy.slug,
      legacy.body,
    );
    return updated + result.changes;
  }, 0))();
}

export function seedKnowledgeEntries(database) {
  const hasBeenSeeded = database.prepare(
    "SELECT 1 FROM knowledge_base_seed_state WHERE key = 'default-seeds'",
  );
  const hasAnyEntries = database.prepare('SELECT 1 FROM knowledge_base_entries LIMIT 1');
  const markSeeded = database.prepare(
    "INSERT OR IGNORE INTO knowledge_base_seed_state (key) VALUES ('default-seeds')",
  );
  const insert = database.prepare(`
    INSERT OR IGNORE INTO knowledge_base_entries
      (slug, title, body, product_slug, keywords, source_note, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  if (!hasBeenSeeded.get()) {
    database.transaction(() => {
      // Treat an existing knowledge base as initialized. This keeps absent seed
      // slugs (including intentionally deleted entries) from being recreated.
      if (!hasAnyEntries.get()) {
        for (const entry of KNOWLEDGE_SEEDS) {
          insert.run(
            entry.slug,
            entry.title,
            entry.body,
            entry.product_slug,
            entry.keywords,
            entry.source_note,
            entry.is_published ? 1 : 0,
          );
        }
      }
      markSeeded.run();
    })();
  }

  return migrateLegacyKnowledgeSeeds(database);
}
