import {
  SHOT_88_DURATION_FRAMES,
  Shot88AiPromptCardStackHookChoreography,
} from "../runtime/choreography/aiPromptCardStackHook";

export const aiPromptCardStackHookRegistryEntry = {
  id: "aiPromptCardStackHook",
  libraryId: "ai-prompt-card-stack-hook",
  sourceShotId: "shot_88",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_88_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_88/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_88/runtime/atomic/shot88-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_88/runtime/choreography/aiPromptCardStackHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_88/runtime/catalog-entry/ai-prompt-card-stack-hook.library-entry.ts",
  Component: Shot88AiPromptCardStackHookChoreography,
} as const;
