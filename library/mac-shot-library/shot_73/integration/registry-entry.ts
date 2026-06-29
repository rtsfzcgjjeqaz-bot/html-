import {
  SHOT_73_DURATION_FRAMES,
  Shot73PlatformCapabilityMatrixRevealChoreography,
} from "../runtime/choreography/platformCapabilityMatrixReveal";

export const platformCapabilityMatrixRevealRegistryEntry = {
  id: "platformCapabilityMatrixReveal",
  libraryId: "platform-capability-matrix-reveal",
  sourceShotId: "shot_73",
  sceneType: "resultComparison",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_73_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_73/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_73/runtime/atomic/shot73-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_73/runtime/choreography/platformCapabilityMatrixReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_73/runtime/catalog-entry/platform-capability-matrix-reveal.library-entry.ts",
  Component: Shot73PlatformCapabilityMatrixRevealChoreography,
} as const;
