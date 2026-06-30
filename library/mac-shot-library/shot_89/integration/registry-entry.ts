import {
  SHOT_89_DURATION_FRAMES,
  Shot89PaymentPromptToFormRevealChoreography,
} from "../runtime/choreography/paymentPromptToFormReveal";

export const paymentPromptToFormRevealRegistryEntry = {
  id: "paymentPromptToFormReveal",
  libraryId: "payment-prompt-to-form-reveal",
  sourceShotId: "shot_89",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_89_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_89/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_89/runtime/atomic/shot89-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_89/runtime/choreography/paymentPromptToFormReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_89/runtime/catalog-entry/payment-prompt-to-form-reveal.library-entry.ts",
  Component: Shot89PaymentPromptToFormRevealChoreography,
} as const;
