import { aiRecommendationCursorPanelRevealLibraryEntry } from "./ai-recommendation-cursor-panel-reveal.library-entry";
import { resultComparisonBigNumberBurstLibraryEntry } from "./result-comparison-big-number-burst.library-entry";
import { stepFlowProductModuleFanoutLibraryEntry } from "./step-flow-product-module-fanout.library-entry";
import { appGridTiltedDashboardCalloutLibraryEntry } from "./app-grid-tilted-dashboard-callout.library-entry";
import { stepFlowTimelineCalculationLibraryEntry } from "./step-flow-timeline-calculation.library-entry";
import { finalCtaBrandEndCardLibraryEntry } from "./final-cta-brand-end-card.library-entry";

export { aiRecommendationCursorPanelRevealLibraryEntry } from "./ai-recommendation-cursor-panel-reveal.library-entry";
export { resultComparisonBigNumberBurstLibraryEntry } from "./result-comparison-big-number-burst.library-entry";
export { stepFlowProductModuleFanoutLibraryEntry } from "./step-flow-product-module-fanout.library-entry";
export { appGridTiltedDashboardCalloutLibraryEntry } from "./app-grid-tilted-dashboard-callout.library-entry";
export { stepFlowTimelineCalculationLibraryEntry } from "./step-flow-timeline-calculation.library-entry";
export { finalCtaBrandEndCardLibraryEntry } from "./final-cta-brand-end-card.library-entry";
export type { ShotLibraryEntry } from "./types";

export const shotLibraryCatalog = [
  aiRecommendationCursorPanelRevealLibraryEntry,
  resultComparisonBigNumberBurstLibraryEntry,
  stepFlowProductModuleFanoutLibraryEntry,
  appGridTiltedDashboardCalloutLibraryEntry,
  stepFlowTimelineCalculationLibraryEntry,
  finalCtaBrandEndCardLibraryEntry,
] as const;

export const shotLibraryCatalogById = Object.fromEntries(
  shotLibraryCatalog.map((entry) => [entry.libraryId, entry]),
);

export const shotLibraryCatalogByChoreographyId = Object.fromEntries(
  shotLibraryCatalog.map((entry) => [entry.choreographyId, entry]),
);
