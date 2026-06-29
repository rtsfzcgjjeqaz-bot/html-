import {
  SHOT_43_DURATION_FRAMES,
  Shot43DarkCapabilityCardsBurstChoreography,
} from "../runtime/choreography/darkCapabilityCardsBurst";

export const darkCapabilityCardsBurstRegistryEntry = {
  id: "darkCapabilityCardsBurst",
  libraryId: "dark-capability-cards-burst",
  sourceShotId: "shot_43",
  sceneType: "resultComparison",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_43_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_43/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_43/runtime/atomic/shot43-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_43/runtime/choreography/darkCapabilityCardsBurst.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_43/runtime/catalog-entry/dark-capability-cards-burst.library-entry.ts",
  Component: Shot43DarkCapabilityCardsBurstChoreography,
} as const;
