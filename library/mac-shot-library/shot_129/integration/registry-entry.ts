import {
  SHOT_129_DURATION_FRAMES,
  Shot129LanguageProcessingProgressRailChoreography,
} from "../runtime/choreography/languageProcessingProgressRail";

export const languageProcessingProgressRailRegistryEntry = {
  id: "languageProcessingProgressRail",
  libraryId: "language-processing-progress-rail",
  sourceShotId: "shot_129",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_129_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_129/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_129/runtime/atomic/shot129-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_129/runtime/choreography/languageProcessingProgressRail.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_129/runtime/catalog-entry/language-processing-progress-rail.library-entry.ts",
  Component: Shot129LanguageProcessingProgressRailChoreography,
} as const;
