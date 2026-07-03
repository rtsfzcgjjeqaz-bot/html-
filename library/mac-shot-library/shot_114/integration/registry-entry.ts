import {
  SHOT_114_DURATION_FRAMES,
  Shot114DocumentActionPanelRevealChoreography,
} from "../runtime/choreography/documentActionPanelReveal";

export const documentActionPanelRevealRegistryEntry = {
  id: "documentActionPanelReveal",
  libraryId: "document-action-panel-reveal",
  sourceShotId: "shot_114",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_114_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_114/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_114/runtime/atomic/shot114-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_114/runtime/choreography/documentActionPanelReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_114/runtime/catalog-entry/document-action-panel-reveal.library-entry.ts",
  Component: Shot114DocumentActionPanelRevealChoreography,
} as const;
