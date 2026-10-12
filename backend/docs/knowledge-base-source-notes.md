# Product knowledge source notes

These notes record the evidence used for the initial public chatbot entries and
homepage product descriptions. Read source-repository README statements as
status reports, and verify capability claims in implemented code. The source
repositories were inspected read-only.

| Public product | Evidence and claims used | Boundaries retained in public copy |
| --- | --- | --- |
| AxisStruct / AXIS | `TABS/README.md` identifies AXIS as recovery-stage and says it is not for production engineering or construction documents. The verified packaged scope is limited linear-static 3D frames and X-Z planar pin-jointed trusses. `engine/Tabs.Engine/Model/AnalysisCapabilities.cs`, `engine/Tabs.Engine/Solver/FrameAnalysis.cs`, and `engine/Tabs.Engine/Solver/Truss2DAnalysis.cs` implement the bounded analysis paths. | No design-code verification, full building-analysis, construction-document, or professional-reliance promise. |
| TakeOff | `JPF_Estimate/README.md` documents PDF sheet import, scale calibration, area/length/count and related measurements, assembly assignment, materials pricing, BOQ consolidation, and Excel export. `src/JpfEstimate.App/Services/AppState.cs` handles sheet import/calibration and assignments; `src/JpfEstimate.Application/Estimating/ConsolidationService.cs` consolidates estimates. | README says labor costing is not implemented; no labor-cost promise. |
| Nexus | `apo_app/README.md` states each organization has its own deployment and database and is not a multi-tenant app. Implemented route families include member records and member learning (`backend/src/routes/member.routes.js`, `member.learning.routes.js`), admin event workflows (`admin.events.routes.js`), CPD/CPDD (`admin.cpdd.routes.js`), and certificates. | Do not present aspirational configuration, payments, or every white-label module as universally enabled. Confirm modules per deployment. |
| Kuwalog | `WMS/README.md` describes the web WMS. `WMS-mobile/README.md` and its routes document stock lookup, purchase-order receiving, assigned picks, bin transfers, cycle counts, scanning, local cache, offline outbox, and sync. | Mobile pack and ship screens are explicitly listed as stubs; omit those as available workflows. |
| Vantage | `kdtminer/README.md` describes a visual workflow app and marks the project as active development. Implemented workflow building and execution are in `kdtminer/core/operator.py`, `kdtminer/core/executor.py`, `kdtminer/ui/workflow_canvas.py`, and `kdtminer/ui/results_panel.py`. | Do not claim every listed operator/chart, or model deployment, is complete. Confirm supported operations and formats. |

The app's static public catalog is in `backend/src/data/publicProductCatalog.js`;
the five idempotent published starter entries and private source notes are in
`backend/src/db/knowledgeSeeds.js`. Keep those notes current if either source
code or public product wording changes.
