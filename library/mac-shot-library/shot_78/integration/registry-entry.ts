import {
  SHOT_78_DURATION_FRAMES,
  Shot78DocumentSelectionAiToolbarChoreography,
} from "../runtime/choreography/documentSelectionAiToolbar";

export const documentSelectionAiToolbarRegistryEntry = {
  id: "documentSelectionAiToolbar",
  libraryId: "document-selection-ai-toolbar",
  sourceShotId: "shot_78",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_78_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_78/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_78/runtime/shot/shot78-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_78/runtime/shot/shot78-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_78/runtime/catalog-entry/document-selection-ai-toolbar.library-entry.ts",
  Component: Shot78DocumentSelectionAiToolbarChoreography,
} as const;
