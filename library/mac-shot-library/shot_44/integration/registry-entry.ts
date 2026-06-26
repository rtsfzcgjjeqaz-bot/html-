import {
  SHOT_44_DURATION_FRAMES,
  Shot44DualDeviceFeatureStageChoreography,
} from "./runtime/choreography/dualDeviceFeatureStage";

export const dualDeviceFeatureStageRegistryEntry = {
  id: "dualDeviceFeatureStage",
  libraryId: "dual-device-feature-stage",
  sourceShotId: "shot_44",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_44_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_44/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_44/runtime/shot/shot44-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_44/runtime/shot/shot44-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_44/runtime/catalog-entry/dual-device-feature-stage.library-entry.ts",
  Component: Shot44DualDeviceFeatureStageChoreography,
} as const;
