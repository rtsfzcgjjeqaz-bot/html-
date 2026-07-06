import {
  SHOT_130_DURATION_FRAMES,
  Shot130CompletionCheckConfettiRevealChoreography,
} from "../runtime/choreography/completionCheckConfettiReveal";

export const completionCheckConfettiRevealRegistryEntry = {
  id: "completionCheckConfettiReveal",
  libraryId: "completion-check-confetti-reveal",
  sourceShotId: "shot_130",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_130_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_130/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_130/runtime/atomic/shot130-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_130/runtime/choreography/completionCheckConfettiReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_130/runtime/catalog-entry/completion-check-confetti-reveal.library-entry.ts",
  Component: Shot130CompletionCheckConfettiRevealChoreography,
} as const;
