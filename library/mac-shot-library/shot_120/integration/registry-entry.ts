import {
  SHOT_120_DURATION_FRAMES,
  Shot120DarkGoogleAiBusinessHookChoreography,
} from "../runtime/choreography/darkGoogleAiBusinessHook";

export const darkGoogleAiBusinessHookRegistryEntry = {
  id: "darkGoogleAiBusinessHook",
  libraryId: "dark-google-ai-business-hook",
  sourceShotId: "shot_120",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_120_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_120/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_120/runtime/atomic/shot120-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_120/runtime/choreography/darkGoogleAiBusinessHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_120/runtime/catalog-entry/dark-google-ai-business-hook.library-entry.ts",
  Component: Shot120DarkGoogleAiBusinessHookChoreography,
} as const;
