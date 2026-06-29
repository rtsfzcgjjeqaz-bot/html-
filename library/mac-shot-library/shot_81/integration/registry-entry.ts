import {
  SHOT_81_DURATION_FRAMES,
  Shot81DarkPromptCodeCanvasPushChoreography,
} from "../runtime/choreography/darkPromptCodeCanvasPush";

export const darkPromptCodeCanvasPushRegistryEntry = {
  id: "darkPromptCodeCanvasPush",
  libraryId: "dark-prompt-code-canvas-push",
  sourceShotId: "shot_81",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_81_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_81/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_81/runtime/atomic/shot81-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_81/runtime/choreography/darkPromptCodeCanvasPush.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_81/runtime/catalog-entry/dark-prompt-code-canvas-push.library-entry.ts",
  Component: Shot81DarkPromptCodeCanvasPushChoreography,
} as const;
