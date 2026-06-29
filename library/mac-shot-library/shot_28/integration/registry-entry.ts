import {
  SHOT_28_DURATION_FRAMES,
  Shot28StepFlowChoreography,
} from "../runtime/choreography/stepFlowTimelineCalculation";

export const stepFlowTimelineCalculationRegistryEntry = {
  id: "stepFlowTimelineCalculation",
  libraryId: "step-flow-timeline-calculation",
  sourceShotId: "shot_28",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_28_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_28/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_28/runtime/atomic/shot28-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_28/runtime/choreography/stepFlowTimelineCalculation.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_28/runtime/catalog-entry/step-flow-timeline-calculation.library-entry.ts",
  Component: Shot28StepFlowChoreography,
} as const;
