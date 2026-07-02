import {
  SHOT_105_DURATION_FRAMES,
  Shot105SystemRingMorphHighlightChoreography,
} from "../runtime/choreography/systemRingMorphHighlight";

export const systemRingMorphHighlightRegistryEntry = {
  id: "systemRingMorphHighlight",
  libraryId: "system-ring-morph-highlight",
  sourceShotId: "shot_105",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_105_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_105/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_105/runtime/atomic/shot105-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_105/runtime/choreography/systemRingMorphHighlight.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_105/runtime/catalog-entry/system-ring-morph-highlight.library-entry.ts",
  Component: Shot105SystemRingMorphHighlightChoreography,
} as const;
