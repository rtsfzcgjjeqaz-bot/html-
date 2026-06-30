import {
  SHOT_90_DURATION_FRAMES,
  Shot90PaymentFormAutoFillTableChoreography,
} from "../runtime/choreography/paymentFormAutoFillTable";

export const paymentFormAutoFillTableRegistryEntry = {
  id: "paymentFormAutoFillTable",
  libraryId: "payment-form-auto-fill-table",
  sourceShotId: "shot_90",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_90_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_90/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_90/runtime/atomic/shot90-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_90/runtime/choreography/paymentFormAutoFillTable.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_90/runtime/catalog-entry/payment-form-auto-fill-table.library-entry.ts",
  Component: Shot90PaymentFormAutoFillTableChoreography,
} as const;
