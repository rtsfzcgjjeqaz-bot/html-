import {
  SHOT_82_DURATION_FRAMES,
  Shot82CodePreviewToggleFocusChoreography,
} from "../runtime/choreography/codePreviewToggleFocus";

export const codePreviewToggleFocusRegistryEntry = {
  id: "codePreviewToggleFocus",
  libraryId: "code-preview-toggle-focus",
  sourceShotId: "shot_82",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_82_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_82/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_82/runtime/shot/shot82-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_82/runtime/shot/shot82-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_82/runtime/catalog-entry/code-preview-toggle-focus.library-entry.ts",
  Component: Shot82CodePreviewToggleFocusChoreography,
} as const;
