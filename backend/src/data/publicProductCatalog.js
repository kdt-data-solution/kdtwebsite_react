// Canonical public product identities and scopes, matching the website catalog.
// Keep private knowledge source notes in db/knowledgeSeeds.js.
export const PUBLIC_PRODUCT_CATALOG = [
  {
    name: 'AxisStruct',
    slug: 'construct-pro',
    category: 'Structural software',
    description: 'Create frame and planar-truss models, organize loads, and explore structural analysis results in one focused workflow.',
    highlights: ['Frame and truss modeling', 'Load organization', 'Analysis results'],
  },
  {
    name: 'Vantage',
    slug: 'structural-chatbot',
    category: 'Business intelligence',
    description: 'Connect data preparation and analysis steps in a visual workflow, then run the workflow and review its outputs and visualizations.',
    highlights: ['Visual workflow canvas', 'Data preparation and analysis', 'Outputs and visualizations'],
  },
  {
    name: 'TakeOff',
    slug: 'cardko',
    category: 'Estimating',
    description: 'Measure calibrated PDF plans, organize quantities with material assemblies, review a bill of quantities, and export an Excel estimate.',
    highlights: ['PDF plan take-off', 'Material quantities and costing', 'BOQ to Excel'],
  },
  {
    name: 'Kuwalog',
    slug: 'wms',
    category: 'Warehouse management',
    description: 'Coordinate stock lookup, receiving, assigned picking, bin transfers, and cycle counts through warehouse and scan-assisted mobile workflows, with offline sync for supported mobile changes.',
    highlights: ['Stock lookup and receiving', 'Pick, transfer, and count', 'Offline mobile sync'],
  },
  {
    name: 'Nexus',
    slug: 'membership',
    category: 'Professional organization membership',
    description: 'Bring professional-organization member records, events, learning, CPD/CPDD, and certificate workflows together in one portal.',
    highlights: ['Member services', 'Events and learning', 'Organization-specific portal'],
  },
];
