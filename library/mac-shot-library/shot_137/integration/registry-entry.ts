import {
  SHOT_137_DURATION_FRAMES,
  Shot137WorkflowStepperBridgeChoreography,
} from "../runtime/choreography/workflowStepperBridge";

export const workflowStepperBridgeRegistryEntry = {
  id: "workflowStepperBridge",
  libraryId: "workflow-stepper-bridge",
  sourceShotId: "shot_137",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_137_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_137/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_137/runtime/atomic/shot137-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_137/runtime/choreography/workflowStepperBridge.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_137/runtime/catalog-entry/workflow-stepper-bridge.library-entry.ts",
  Component: Shot137WorkflowStepperBridgeChoreography,
} as const;
