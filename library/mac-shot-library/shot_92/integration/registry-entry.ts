import {
  SHOT_92_DURATION_FRAMES,
  Shot92LedgerSuccessBenefitRevealChoreography,
} from "../runtime/choreography/ledgerSuccessBenefitReveal";

export const ledgerSuccessBenefitRevealRegistryEntry = {
  id: "ledgerSuccessBenefitReveal",
  libraryId: "ledger-success-benefit-reveal",
  sourceShotId: "shot_92",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_92_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_92/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_92/runtime/atomic/shot92-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_92/runtime/choreography/ledgerSuccessBenefitReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_92/runtime/catalog-entry/ledger-success-benefit-reveal.library-entry.ts",
  Component: Shot92LedgerSuccessBenefitRevealChoreography,
} as const;
