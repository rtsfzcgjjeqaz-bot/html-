import {
  SHOT_117_DURATION_FRAMES,
  Shot117FloatingWorkflowStepRailChoreography,
} from "../runtime/choreography/floatingWorkflowStepRail";

export const floatingWorkflowStepRailRegistryEntry = {
  id: "floatingWorkflowStepRail",
  libraryId: "floating-workflow-step-rail",
  sourceShotId: "shot_117",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_117_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_117/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_117/runtime/atomic/shot117-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_117/runtime/choreography/floatingWorkflowStepRail.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_117/runtime/catalog-entry/floating-workflow-step-rail.library-entry.ts",
  Component: Shot117FloatingWorkflowStepRailChoreography,
} as const;
