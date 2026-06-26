import {
  SHOT_38_DURATION_FRAMES,
  Shot38MobileAiBriefCardRevealChoreography,
} from "./runtime/choreography/mobileAiBriefCardReveal";

export const mobileAiBriefCardRevealRegistryEntry = {
  id: "mobileAiBriefCardReveal",
  libraryId: "mobile-ai-brief-card-reveal",
  sourceShotId: "shot_38",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_38_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_38/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_38/runtime/shot/shot38-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_38/runtime/shot/shot38-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_38/runtime/catalog-entry/mobile-ai-brief-card-reveal.library-entry.ts",
  Component: Shot38MobileAiBriefCardRevealChoreography,
} as const;
