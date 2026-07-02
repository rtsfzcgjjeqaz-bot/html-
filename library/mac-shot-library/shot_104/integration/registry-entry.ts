import {
  SHOT_104_DURATION_FRAMES,
  Shot104LuminousLineBeginHookChoreography,
} from "../runtime/choreography/luminousLineBeginHook";

export const luminousLineBeginHookRegistryEntry = {
  id: "luminousLineBeginHook",
  libraryId: "luminous-line-begin-hook",
  sourceShotId: "shot_104",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_104_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_104/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_104/runtime/atomic/shot104-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_104/runtime/choreography/luminousLineBeginHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_104/runtime/catalog-entry/luminous-line-begin-hook.library-entry.ts",
  Component: Shot104LuminousLineBeginHookChoreography,
} as const;
