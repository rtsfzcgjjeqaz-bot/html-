import type { ShotLibraryEntry } from "./types";

export const guardMetricTrendCardsLibraryEntry: ShotLibraryEntry = {
  libraryId: "guard-metric-trend-cards",
  choreographyId: "guardMetricTrendCards",
  sourceShotId: "shot_141",
  sceneType: "priceInsight",
  title: "Guard Metric Trend Cards",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 120,
  actionBreakdownPath: "src/motion/shot_141/shot141-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_141/shot141-atomic-motions.ts",
  choreographyPath: "src/motion/shot_141/shot141-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/guardMetricTrendCards.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_141/guardMetricTrendCards.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_141_priceInsight_16p2-20p1.mp4",
  atomicMotionIds: ["numberMetricCountUp", "trendCardSweep", "dashboardRowSettle", "metricComparisonHold"],
};
