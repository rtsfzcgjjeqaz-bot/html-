import {
  SHOT_11_DURATION_FRAMES,
  Shot11ResultComparisonChoreography,
} from "../runtime/choreography/resultComparisonBigNumberBurst";

export const resultComparisonBigNumberBurstRegistryEntry = {
  id: "resultComparisonBigNumberBurst",
  libraryId: "result-comparison-big-number-burst",
  sourceShotId: "shot_11",
  sceneType: "resultComparison",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_11_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_11/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_11/runtime/atomic/shot11-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_11/runtime/choreography/resultComparisonBigNumberBurst.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_11/runtime/catalog-entry/result-comparison-big-number-burst.library-entry.ts",
  Component: Shot11ResultComparisonChoreography,
} as const;
