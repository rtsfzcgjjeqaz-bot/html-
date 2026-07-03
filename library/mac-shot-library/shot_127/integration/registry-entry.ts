import {
  SHOT_127_DURATION_FRAMES,
  Shot127LangeaseKineticTextHookChoreography,
} from "../runtime/choreography/langeaseKineticTextHook";

export const langeaseKineticTextHookRegistryEntry = {
  id: "langeaseKineticTextHook",
  libraryId: "langease-kinetic-text-hook",
  sourceShotId: "shot_127",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_127_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_127/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_127/runtime/atomic/shot127-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_127/runtime/choreography/langeaseKineticTextHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_127/runtime/catalog-entry/langease-kinetic-text-hook.library-entry.ts",
  Component: Shot127LangeaseKineticTextHookChoreography,
} as const;
