export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot90AtomicMotions: AtomicMotion[] = [
  { id: "promptContextHold", label: "Prompt Context Hold", frameRange: [0, 18], purpose: "Keep the prompt source visible above the generated form.", reusable: true, reviewRisk: "Prompt context must stay secondary." },
  { id: "tiltedFormSurfaceResolve", label: "Tilted Form Surface Resolve", frameRange: [0, 28], purpose: "Move from cropped close view to complete readable form surface.", reusable: true, reviewRisk: "Panel cannot crop key table fields." },
  { id: "paymentChipReveal", label: "Payment Chip Reveal", frameRange: [16, 36], purpose: "Reveal form header chips for payment metadata.", reusable: true, reviewRisk: "Header chips should not compete with ledger rows." },
  { id: "ledgerRowsAutofill", label: "Ledger Rows Autofill", frameRange: [24, 52], purpose: "Fill ledger names and amounts in sequence.", reusable: true, reviewRisk: "Rows need clear timing and readable values." },
  { id: "actionButtonsPop", label: "Action Buttons Pop", frameRange: [38, 58], purpose: "Make Add buttons appear as actionable outputs.", reusable: true, reviewRisk: "Buttons should not pulse excessively." },
  { id: "automationStatusConfirm", label: "Automation Status Confirm", frameRange: [48, 71], purpose: "Confirm the system completed the automated action.", reusable: true, reviewRisk: "Status chip should have semantic label and controlled glow." },
];

export const shot90AtomicMotionIds = shot90AtomicMotions.map((motion) => motion.id);

export const shot90MotionPackageStatus = {
  shotId: "shot_90",
  libraryId: "payment-form-auto-fill-table",
  choreographyId: "paymentFormAutoFillTable",
  sceneType: "appGrid",
  visualApproved: false,
  implementationVerified: false,
  approved: false,
  allowedInFactory: false,
} as const;
