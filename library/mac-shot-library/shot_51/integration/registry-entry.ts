import {
  SHOT_51_DURATION_FRAMES,
  Shot51VehicleTimelineMetricInsightChoreography,
} from "../runtime/choreography/vehicleTimelineMetricInsight";

export const vehicleTimelineMetricInsightRegistryEntry = {
  id: "vehicleTimelineMetricInsight",
  libraryId: "vehicle-timeline-metric-insight",
  sourceShotId: "shot_51",
  sceneType: "priceInsight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_51_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_51/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_51/runtime/atomic/shot51-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_51/runtime/choreography/vehicleTimelineMetricInsight.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_51/runtime/catalog-entry/vehicle-timeline-metric-insight.library-entry.ts",
  Component: Shot51VehicleTimelineMetricInsightChoreography,
} as const;
