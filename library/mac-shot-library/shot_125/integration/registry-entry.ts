import {
  SHOT_125_DURATION_FRAMES,
  Shot125NeedNotCopyMorphChoreography,
} from "../runtime/choreography/needNotCopyMorph";

export const needNotCopyMorphRegistryEntry = {
  id: "needNotCopyMorph",
  libraryId: "need-not-copy-morph",
  sourceShotId: "shot_125",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_125_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_125/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_125/runtime/atomic/shot125-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_125/runtime/choreography/needNotCopyMorph.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_125/runtime/catalog-entry/need-not-copy-morph.library-entry.ts",
  Component: Shot125NeedNotCopyMorphChoreography,
} as const;
