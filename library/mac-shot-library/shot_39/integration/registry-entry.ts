import {
  SHOT_39_DURATION_FRAMES,
  Shot39MobilePromptComposerFlowChoreography,
} from "./runtime/choreography/mobilePromptComposerFlow";

export const mobilePromptComposerFlowRegistryEntry = {
  id: "mobilePromptComposerFlow",
  libraryId: "mobile-prompt-composer-flow",
  sourceShotId: "shot_39",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_39_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_39/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_39/runtime/shot/shot39-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_39/runtime/shot/shot39-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_39/runtime/catalog-entry/mobile-prompt-composer-flow.library-entry.ts",
  Component: Shot39MobilePromptComposerFlowChoreography,
} as const;
