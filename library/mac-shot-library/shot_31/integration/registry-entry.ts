import {
  SHOT_31_DURATION_FRAMES,
  Shot31FinalCTAChoreography,
} from "../runtime/choreography/finalCtaBrandEndCard";

export const finalCtaBrandEndCardRegistryEntry = {
  id: "finalCtaBrandEndCard",
  libraryId: "final-cta-brand-end-card",
  sourceShotId: "shot_31",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_31_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_31/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_31/runtime/atomic/shot31-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_31/runtime/choreography/finalCtaBrandEndCard.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_31/runtime/catalog-entry/final-cta-brand-end-card.library-entry.ts",
  Component: Shot31FinalCTAChoreography,
} as const;
