import {
  SHOT_133_DURATION_FRAMES,
  Shot133DistributionActionBarFlowChoreography,
} from "../runtime/choreography/distributionActionBarFlow";

export const distributionActionBarFlowRegistryEntry = {
  id: "distributionActionBarFlow",
  libraryId: "distribution-action-bar-flow",
  sourceShotId: "shot_133",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_133_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_133/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_133/runtime/atomic/shot133-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_133/runtime/choreography/distributionActionBarFlow.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_133/runtime/catalog-entry/distribution-action-bar-flow.library-entry.ts",
  Component: Shot133DistributionActionBarFlowChoreography,
} as const;
