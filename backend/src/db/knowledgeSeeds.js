// Seed entries are based on implemented code and each source repository's
// README. Keep source_note private: it is for admin review and never goes to AI.
export const KNOWLEDGE_SEEDS = [
  {
    slug: 'axisstruct-product-overview',
    title: 'AxisStruct structural modeling and analysis',
    product_slug: 'construct-pro',
    keywords: 'axis axisstruct structural engineering model modeling frame planar truss loads analysis results demo',
    source_note: 'TABS/README.md (recovery baseline and verified engine scope); engine/Tabs.Engine/Model/AnalysisCapabilities.cs; engine/Tabs.Engine/Solver/FrameAnalysis.cs; engine/Tabs.Engine/Solver/Truss2DAnalysis.cs.',
    body: 'AxisStruct brings structural modeling and analysis into one focused desktop workflow. Create 3D frame and planar pin-jointed truss models, organize joint loads, and review analysis results across linear-static frame and X-Z planar truss workflows. Contact KDT to arrange a demo and discuss your structural modeling needs.',
    is_published: true,
  },
  {
    slug: 'takeoff-product-overview',
    title: 'TakeOff quantity take-off and materials estimating',
    product_slug: 'cardko',
    keywords: 'takeoff take off quantity estimating estimator PDF plan calibrate measurement material assembly BOQ Excel demo',
    source_note: 'JPF_Estimate/README.md (current status and not-yet-done); src/JpfEstimate.App/Services/AppState.cs; src/JpfEstimate.Application/Estimating/ConsolidationService.cs; src/JpfEstimate.Excel/EstimateExcelExporter.cs.',
    body: 'TakeOff helps estimators turn PDF plan sheets into organized material estimates. Import plan pages or start with a blank sheet, calibrate scale, record area, length, count and other measurement types, and connect quantities to material assemblies. Consolidate estimate lines and material costs into a bill of quantities, then export the workbook to Excel. Contact KDT to see how the workflow fits your estimating needs.',
    is_published: true,
  },
  {
    slug: 'nexus-product-overview',
    title: 'Nexus professional organization portal',
    product_slug: 'membership',
    keywords: 'nexus association professional organization membership members directory events learning CPD CPDD certificates administration',
    source_note: 'apo_app/README.md (product boundary and separate deployment); backend/src/routes/member.routes.js; backend/src/routes/member.learning.routes.js; backend/src/routes/admin.events.routes.js; backend/src/routes/admin.cpdd.routes.js.',
    body: 'Nexus brings professional-organization member records and member-facing services together with event administration and registration, learning, CPD/CPDD, and certificate workflows. Organization administrators can manage member services, events, and learning activities through the portal. Contact KDT to arrange a demo and discuss the workflows that matter to your organization.',
    is_published: true,
  },
  {
    slug: 'kuwalog-product-overview',
    title: 'Kuwalog warehouse workflows and mobile app',
    product_slug: 'wms',
    keywords: 'kuwalog warehouse inventory stock receive receiving pick picking transfer count cycle count barcode QR mobile offline sync',
    source_note: 'WMS/README.md; WMS-mobile/README.md (screens, offline-first, known follow-ups); WMS-mobile/app/(app)/pick; WMS-mobile/app/(app)/receive; WMS-mobile/src/lib/sync-queue.ts.',
    body: 'Kuwalog brings warehouse administration and mobile floor workflows together. Teams can look up stock, receive purchase orders, complete assigned picks, transfer items between bins, and perform cycle counts with scan-assisted workflows. Mobile users can work with cached lists and queue supported changes offline for syncing when connectivity returns. Contact KDT to explore how Kuwalog can support your warehouse operations.',
    is_published: true,
  },
  {
    slug: 'vantage-product-overview',
    title: 'Vantage visual data-mining and analytics workflows',
    product_slug: 'structural-chatbot',
    keywords: 'vantage data analytics data mining visual workflow node operators transformation machine learning charts visualization',
    source_note: 'kdtminer/README.md (active-development status); kdtminer/core/operator.py; kdtminer/core/executor.py; kdtminer/ui/workflow_canvas.py; kdtminer/ui/results_panel.py.',
    body: 'Vantage brings data access, preparation, and analysis into a visual, node-based workflow. Connect workflow steps, run them, and review outputs and visualizations in a desktop application. Contact KDT to discuss your data and workflow needs or arrange a demo.',
    is_published: true,
  },
];
