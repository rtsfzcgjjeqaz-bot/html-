import {
  SHOT_106_DURATION_FRAMES,
  Shot106GradientFormCardRevealChoreography,
} from "../runtime/choreography/gradientFormCardReveal";

export const gradientFormCardRevealRegistryEntry = {
  id: "gradientFormCardReveal",
  libraryId: "gradient-form-card-reveal",
  sourceShotId: "shot_106",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_106_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_106/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_106/runtime/atomic/shot106-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_106/runtime/choreography/gradientFormCardReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_106/runtime/catalog-entry/gradient-form-card-reveal.library-entry.ts",
  Component: Shot106GradientFormCardRevealChoreography,
} as const;
