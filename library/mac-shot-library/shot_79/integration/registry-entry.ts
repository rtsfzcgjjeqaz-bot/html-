import {
  SHOT_79_DURATION_FRAMES,
  Shot79AiSuggestionCardFromSelectionChoreography,
} from "../runtime/choreography/aiSuggestionCardFromSelection";

export const aiSuggestionCardFromSelectionRegistryEntry = {
  id: "aiSuggestionCardFromSelection",
  libraryId: "ai-suggestion-card-from-selection",
  sourceShotId: "shot_79",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_79_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_79/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_79/runtime/shot/shot79-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_79/runtime/shot/shot79-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_79/runtime/catalog-entry/ai-suggestion-card-from-selection.library-entry.ts",
  Component: Shot79AiSuggestionCardFromSelectionChoreography,
} as const;
