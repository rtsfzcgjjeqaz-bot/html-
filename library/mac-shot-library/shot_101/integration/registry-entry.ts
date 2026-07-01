import {
  SHOT_101_DURATION_FRAMES,
  Shot101SaasRowStreamOverviewChoreography,
} from "../runtime/choreography/saasRowStreamOverview";

export const saasRowStreamOverviewRegistryEntry = {
  id: "saasRowStreamOverview",
  libraryId: "saas-row-stream-overview",
  sourceShotId: "shot_101",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_101_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_101/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_101/runtime/atomic/shot101-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_101/runtime/choreography/saasRowStreamOverview.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_101/runtime/catalog-entry/saas-row-stream-overview.library-entry.ts",
  Component: Shot101SaasRowStreamOverviewChoreography,
} as const;
