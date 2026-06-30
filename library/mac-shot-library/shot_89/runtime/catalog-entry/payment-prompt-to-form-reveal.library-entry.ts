import type { ShotLibraryEntry } from "./types";
import { shot89AtomicMotionIds } from "../atomic/shot89-atomic-motions";

export const paymentPromptToFormRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "payment-prompt-to-form-reveal",
  choreographyId: "paymentPromptToFormReveal",
  sourceShotId: "shot_89",
  sceneType: "searchDemo",
  title: "Payment Prompt To Form Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 54,
  actionBreakdownPath: "library/mac-shot-library/shot_89/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_89/runtime/atomic/shot89-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_89/runtime/choreography/paymentPromptToFormReveal.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_89/runtime/choreography/paymentPromptToFormReveal.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_89/paymentPromptToFormReveal.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_89_searchDemo_3p70-5p40.mp4",
  atomicMotionIds: [...shot89AtomicMotionIds],
};
