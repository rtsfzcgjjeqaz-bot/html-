import {
  SHOT_112_DURATION_FRAMES,
  Shot112AngledGlassToolbarHookChoreography,
} from "../runtime/choreography/angledGlassToolbarHook";

export const angledGlassToolbarHookRegistryEntry = {
  id: "angledGlassToolbarHook",
  libraryId: "angled-glass-toolbar-hook",
  sourceShotId: "shot_112",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_112_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_112/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_112/runtime/atomic/shot112-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_112/runtime/choreography/angledGlassToolbarHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_112/runtime/catalog-entry/angled-glass-toolbar-hook.library-entry.ts",
  Component: Shot112AngledGlassToolbarHookChoreography,
} as const;
