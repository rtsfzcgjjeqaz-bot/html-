import {
  SHOT_50_DURATION_FRAMES,
  Shot50ModularDashboardGridBuildChoreography,
} from "../runtime/choreography/modularDashboardGridBuild";

export const modularDashboardGridBuildRegistryEntry = {
  id: "modularDashboardGridBuild",
  libraryId: "modular-dashboard-grid-build",
  sourceShotId: "shot_50",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_50_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_50/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_50/runtime/atomic/shot50-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_50/runtime/choreography/modularDashboardGridBuild.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_50/runtime/catalog-entry/modular-dashboard-grid-build.library-entry.ts",
  Component: Shot50ModularDashboardGridBuildChoreography,
} as const;
