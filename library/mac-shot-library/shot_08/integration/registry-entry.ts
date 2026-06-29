import {
  SHOT_08_DURATION_FRAMES,
  Shot08AIRecommendationChoreography,
} from "../runtime/choreography/aiRecommendationCursorPanelReveal";

export const aiRecommendationCursorPanelRevealRegistryEntry = {
  id: "aiRecommendationCursorPanelReveal",
  libraryId: "ai-recommendation-cursor-panel-reveal",
  sourceShotId: "shot_08",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_08_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_08/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_08/runtime/atomic/shot08-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_08/runtime/choreography/aiRecommendationCursorPanelReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_08/runtime/catalog-entry/ai-recommendation-cursor-panel-reveal.library-entry.ts",
  Component: Shot08AIRecommendationChoreography,
} as const;
