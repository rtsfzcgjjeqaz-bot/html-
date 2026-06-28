import {
  SHOT_74_DURATION_FRAMES,
  Shot74CleanBrandFinalCtaChoreography,
} from "../runtime/choreography/cleanBrandFinalCta";

export const cleanBrandFinalCtaRegistryEntry = {
  id: "cleanBrandFinalCta",
  libraryId: "clean-brand-final-cta",
  sourceShotId: "shot_74",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_74_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_74/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_74/runtime/shot/shot74-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_74/runtime/shot/shot74-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_74/runtime/catalog-entry/clean-brand-final-cta.library-entry.ts",
  Component: Shot74CleanBrandFinalCtaChoreography,
} as const;
