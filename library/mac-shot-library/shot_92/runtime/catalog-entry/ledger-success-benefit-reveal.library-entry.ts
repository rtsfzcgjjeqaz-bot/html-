import type { ShotLibraryEntry } from "./types";
import { shot92AtomicMotionIds } from "../atomic/shot92-atomic-motions";

export const ledgerSuccessBenefitRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "ledger-success-benefit-reveal",
  choreographyId: "ledgerSuccessBenefitReveal",
  sourceShotId: "shot_92",
  sceneType: "featureHighlight",
  title: "Ledger Success Benefit Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 63,
  actionBreakdownPath: "library/mac-shot-library/shot_92/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_92/runtime/atomic/shot92-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_92/runtime/choreography/ledgerSuccessBenefitReveal.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_92/runtime/choreography/ledgerSuccessBenefitReveal.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_92/ledgerSuccessBenefitReveal.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_92_featureHighlight_12p00-14p00.mp4",
  atomicMotionIds: [...shot92AtomicMotionIds],
};
