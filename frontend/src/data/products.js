// Public product details. Keep claims aligned with product source evidence in
// backend/docs/knowledge-base-source-notes.md.
const product = (title, description, image, steps, benefitsTitle, benefitsBlurb, benefits) => ({
  title,
  pageTitle: title,
  description,
  actions: [{ label: 'Request a demo', href: '#contact' }],
  images: [image],
  steps,
  benefitsTitle,
  benefitsBlurb,
  benefits,
  comingSoon: false,
});

export const products = {
  'construct-pro': product(
    'AxisStruct',
    'Bring structural modeling and analysis into one focused workflow. Create frame and planar-truss models, organize loads, and explore analysis results with AxisStruct, KDT’s structural software suite.',
    'assets/images/product-axis.png',
    [
      { label: 'Build a structural model', desc: 'Create and inspect frame and planar-truss model geometry.' },
      { label: 'Organize model loads', desc: 'Set up joint loads as part of your model workflow.' },
      { label: 'Explore analysis results', desc: 'Run frame and planar-truss analyses and review the results.' },
    ],
    'Model, analyze, and explore',
    'Bring model geometry, load setup, and structural analysis results together in one desktop workflow.',
    [
      { title: 'Create 3D frame and planar-truss models', icon: 'calendar' },
      { title: 'Organize joint loads within each model', icon: 'shield' },
      { title: 'Explore structural analysis results', icon: 'clock' },
    ],
  ),
  'structural-chatbot': product(
    'Vantage',
    'Bring data preparation and analysis steps together in a visual, node-based workflow. Run the workflow, then review outputs and visualizations in Vantage.',
    'assets/images/product-vantage.png',
    [
      { label: 'Build a visual workflow', desc: 'Connect data access, preparation, and analysis steps on a node-based canvas.' },
      { label: 'Run your workflow', desc: 'Execute connected workflow steps in sequence.' },
      { label: 'Review results', desc: 'Inspect workflow outputs and visualizations.' },
    ],
    'A visible path from data to results',
    'Vantage keeps workflow steps connected on a canvas so teams can run and examine data-processing work in one desktop application.',
    [
      { title: 'Build workflows with connected nodes', icon: 'calendar' },
      { title: 'Use data preparation and analysis operators', icon: 'shield' },
      { title: 'Inspect workflow outputs and visualizations', icon: 'smile' },
    ],
  ),
  cardko: product(
    'TakeOff',
    'Turn PDF plans into organized material estimates with TakeOff. Calibrate sheets, record measurements, connect quantities to material assemblies, review a bill of quantities, and export an Excel estimate.',
    'assets/images/product-takeoff.png',
    [
      { label: 'Prepare plan sheets', desc: 'Import PDF pages or add a blank sheet, then calibrate drawing scale.' },
      { label: 'Measure and assign materials', desc: 'Record plan quantities and connect them to material assemblies.' },
      { label: 'Review and export', desc: 'Consolidate quantities and material costs into a bill of quantities and Excel estimate.' },
    ],
    'A traceable quantity-to-estimate workflow',
    'Connect plan measurements to material assemblies, include manual estimate lines when needed, and carry consolidated material quantities into an Excel workbook.',
    [
      { title: 'Calibrated measurements from plan sheets', icon: 'calendar' },
      { title: 'Reusable assemblies for material quantities', icon: 'shield' },
      { title: 'Consolidated BOQ and Excel export', icon: 'clock' },
    ],
  ),
  wms: product(
    'Kuwalog',
    'Coordinate everyday stock tasks through a warehouse web application and mobile workflows. Look up inventory, receive purchase orders, complete assigned picks, transfer stock between bins, and count cycle inventory. Queue supported mobile changes offline and sync them when connectivity returns.',
    'assets/images/product-kuwalog.png',
    [
      { label: 'Receive and locate stock', desc: 'Use warehouse records and scan-assisted stock lookup to work with items and bins.' },
      { label: 'Complete floor tasks', desc: 'Handle receiving, assigned picks, transfers, and counts through the mobile workflow.' },
      { label: 'Keep working offline', desc: 'Cached lists remain available and supported changes sync after the device reconnects.' },
    ],
    'Keep warehouse work moving',
    'Kuwalog connects warehouse administration with scan-assisted mobile tasks, including an offline queue for supported changes.',
    [
      { title: 'Stock lookup and purchase-order receiving', icon: 'calendar' },
      { title: 'Assigned picks, bin transfers, and cycle counts', icon: 'shield' },
      { title: 'Offline queue with automatic sync', icon: 'clock' },
    ],
  ),
  membership: product(
    'Nexus',
    'Give your professional organization a portal for member records and services, events, learning, CPD/CPDD, and certificates. Bring member and administrator workflows together in an organization-focused system.',
    'assets/images/product-nexus.png',
    [
      { label: 'Manage member services', desc: 'Organize member records and member-facing services.' },
      { label: 'Bring people together', desc: 'Manage organization events and registration workflows.' },
      { label: 'Support professional learning', desc: 'Coordinate learning, CPD/CPDD, and certificate workflows.' },
    ],
    'One portal for member operations',
    'Bring member records, events, and professional learning workflows into an organization-specific application.',
    [
      { title: 'Member records and member-facing services', icon: 'smile' },
      { title: 'Event administration and registration workflows', icon: 'calendar' },
      { title: 'Learning, CPD/CPDD, and certificate workflows', icon: 'shield' },
    ],
  ),
};
