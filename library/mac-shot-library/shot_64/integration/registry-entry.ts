import {
  SHOT_64_DURATION_FRAMES,
  Shot64BigNumberInvestmentImpactChoreography,
} from "../runtime/choreography/bigNumberInvestmentImpact";

export const bigNumberInvestmentImpactRegistryEntry = {
  id: "bigNumberInvestmentImpact",
  libraryId: "big-number-investment-impact",
  sourceShotId: "shot_64",
  sceneType: "resultComparison",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_64_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_64/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_64/runtime/atomic/shot64-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_64/runtime/choreography/bigNumberInvestmentImpact.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_64/runtime/catalog-entry/big-number-investment-impact.library-entry.ts",
  Component: Shot64BigNumberInvestmentImpactChoreography,
} as const;
