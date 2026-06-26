import {
  SHOT_48_DURATION_FRAMES,
  Shot48ConnectedWorkflowStepCardsChoreography,
} from "../runtime/choreography/connectedWorkflowStepCards";

export const connectedWorkflowStepCardsRegistryEntry = {
  id: "connectedWorkflowStepCards",
  libraryId: "connected-workflow-step-cards",
  sourceShotId: "shot_48",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_48_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_48/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_48/runtime/shot/shot48-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_48/runtime/shot/shot48-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_48/runtime/catalog-entry/connected-workflow-step-cards.library-entry.ts",
  Component: Shot48ConnectedWorkflowStepCardsChoreography,
} as const;
