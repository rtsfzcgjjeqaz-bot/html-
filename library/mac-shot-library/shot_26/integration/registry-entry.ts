import {
  SHOT_26_DURATION_FRAMES,
  Shot26AppGridChoreography,
} from "../runtime/choreography/appGridTiltedDashboardCallout";

export const appGridTiltedDashboardCalloutRegistryEntry = {
  id: "appGridTiltedDashboardCallout",
  libraryId: "app-grid-tilted-dashboard-callout",
  sourceShotId: "shot_26",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_26_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_26/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_26/runtime/atomic/shot26-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_26/runtime/choreography/appGridTiltedDashboardCallout.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_26/runtime/catalog-entry/app-grid-tilted-dashboard-callout.library-entry.ts",
  Component: Shot26AppGridChoreography,
} as const;
