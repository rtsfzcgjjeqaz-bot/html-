import {
  SHOT_124_DURATION_FRAMES,
  Shot124TranslationAiResponsePanelChoreography,
} from "../runtime/choreography/translationAiResponsePanel";

export const translationAiResponsePanelRegistryEntry = {
  id: "translationAiResponsePanel",
  libraryId: "translation-ai-response-panel",
  sourceShotId: "shot_124",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_124_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_124/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_124/runtime/atomic/shot124-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_124/runtime/choreography/translationAiResponsePanel.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_124/runtime/catalog-entry/translation-ai-response-panel.library-entry.ts",
  Component: Shot124TranslationAiResponsePanelChoreography,
} as const;
