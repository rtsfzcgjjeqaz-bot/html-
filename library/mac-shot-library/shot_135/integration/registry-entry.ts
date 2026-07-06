import {
  SHOT_135_DURATION_FRAMES,
  Shot135TranslateDubDistributeFinalCtaChoreography,
} from "../runtime/choreography/translateDubDistributeFinalCta";

export const translateDubDistributeFinalCtaRegistryEntry = {
  id: "translateDubDistributeFinalCta",
  libraryId: "translate-dub-distribute-final-cta",
  sourceShotId: "shot_135",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_135_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_135/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_135/runtime/atomic/shot135-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_135/runtime/choreography/translateDubDistributeFinalCta.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_135/runtime/catalog-entry/translate-dub-distribute-final-cta.library-entry.ts",
  Component: Shot135TranslateDubDistributeFinalCtaChoreography,
} as const;
