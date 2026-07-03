import {
  SHOT_123_DURATION_FRAMES,
  Shot123LanguageNeedPromptFocusChoreography,
} from "../runtime/choreography/languageNeedPromptFocus";

export const languageNeedPromptFocusRegistryEntry = {
  id: "languageNeedPromptFocus",
  libraryId: "language-need-prompt-focus",
  sourceShotId: "shot_123",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_123_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_123/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_123/runtime/atomic/shot123-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_123/runtime/choreography/languageNeedPromptFocus.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_123/runtime/catalog-entry/language-need-prompt-focus.library-entry.ts",
  Component: Shot123LanguageNeedPromptFocusChoreography,
} as const;
