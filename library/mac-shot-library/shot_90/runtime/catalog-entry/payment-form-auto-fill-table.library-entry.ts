import type { ShotLibraryEntry } from "./types";
import { shot90AtomicMotionIds } from "../atomic/shot90-atomic-motions";

export const paymentFormAutoFillTableLibraryEntry: ShotLibraryEntry = {
  libraryId: "payment-form-auto-fill-table",
  choreographyId: "paymentFormAutoFillTable",
  sourceShotId: "shot_90",
  sceneType: "appGrid",
  title: "Payment Form Auto Fill Table",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 71,
  actionBreakdownPath: "library/mac-shot-library/shot_90/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_90/runtime/atomic/shot90-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_90/runtime/choreography/paymentFormAutoFillTable.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_90/runtime/choreography/paymentFormAutoFillTable.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_90/paymentFormAutoFillTable.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_90_appGrid_5p40-7p67.mp4",
  atomicMotionIds: [...shot90AtomicMotionIds],
};
