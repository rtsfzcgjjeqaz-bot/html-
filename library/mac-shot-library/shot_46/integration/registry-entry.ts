import {
  SHOT_46_DURATION_FRAMES,
  Shot46DarkProductEngineCoverChoreography,
} from "./runtime/choreography/darkProductEngineCover";

export const darkProductEngineCoverRegistryEntry = {
  id: "darkProductEngineCover",
  libraryId: "dark-product-engine-cover",
  sourceShotId: "shot_46",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_46_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_46/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_46/runtime/shot/shot46-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_46/runtime/shot/shot46-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_46/runtime/catalog-entry/dark-product-engine-cover.library-entry.ts",
  Component: Shot46DarkProductEngineCoverChoreography,
} as const;
