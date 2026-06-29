import {
  SHOT_24_DURATION_FRAMES,
  Shot24StepFlowChoreography,
} from "../runtime/choreography/stepFlowProductModuleFanout";

export const stepFlowProductModuleFanoutRegistryEntry = {
  id: "stepFlowProductModuleFanout",
  libraryId: "step-flow-product-module-fanout",
  sourceShotId: "shot_24",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_24_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_24/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_24/runtime/atomic/shot24-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_24/runtime/choreography/stepFlowProductModuleFanout.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_24/runtime/catalog-entry/step-flow-product-module-fanout.library-entry.ts",
  Component: Shot24StepFlowChoreography,
} as const;
