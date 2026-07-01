import {
  SHOT_95_DURATION_FRAMES,
  Shot95KitaabhBrandFinalCtaChoreography,
} from "../runtime/choreography/kitaabhBrandFinalCta";

export const kitaabhBrandFinalCtaRegistryEntry = {
  id: "kitaabhBrandFinalCta",
  libraryId: "kitaabh-brand-final-cta",
  sourceShotId: "shot_95",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_95_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_95/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_95/runtime/atomic/shot95-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_95/runtime/choreography/kitaabhBrandFinalCta.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_95/runtime/catalog-entry/kitaabh-brand-final-cta.library-entry.ts",
  Component: Shot95KitaabhBrandFinalCtaChoreography,
} as const;
