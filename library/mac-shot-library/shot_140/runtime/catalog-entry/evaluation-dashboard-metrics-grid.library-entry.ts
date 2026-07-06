import type { ShotLibraryEntry } from "./types";

export const evaluationDashboardMetricsGridLibraryEntry: ShotLibraryEntry = {
  libraryId: "evaluation-dashboard-metrics-grid",
  choreographyId: "evaluationDashboardMetricsGrid",
  sourceShotId: "shot_140",
  sceneType: "resultComparison",
  title: "Evaluation Dashboard Metrics Grid",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 131,
  actionBreakdownPath: "src/motion/shot_140/shot140-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_140/shot140-atomic-motions.ts",
  choreographyPath: "src/motion/shot_140/shot140-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/evaluationDashboardMetricsGrid.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_140/evaluationDashboardMetricsGrid.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_140_resultComparison_12-16p2.mp4",
  atomicMotionIds: ["metricCardGridBuild", "pieChartSweep", "miniTrendReveal", "dashboardFocusHold"],
};
