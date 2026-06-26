import {
  SHOT_40_DURATION_FRAMES,
  Shot40MobileGeneratedResultCardPopChoreography,
} from "./runtime/choreography/mobileGeneratedResultCardPop";

export const mobileGeneratedResultCardPopRegistryEntry = {
  id: "mobileGeneratedResultCardPop",
  libraryId: "mobile-generated-result-card-pop",
  sourceShotId: "shot_40",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_40_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_40/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_40/runtime/shot/shot40-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_40/runtime/shot/shot40-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_40/runtime/catalog-entry/mobile-generated-result-card-pop.library-entry.ts",
  Component: Shot40MobileGeneratedResultCardPopChoreography,
} as const;
