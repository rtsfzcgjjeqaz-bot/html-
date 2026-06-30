export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot89AtomicMotions: AtomicMotion[] = [
  {
    id: "promptRailResolve",
    label: "Prompt Rail Resolve",
    frameRange: [0, 12],
    purpose: "Bring the prompt label and input rail into view.",
    reusable: true,
    reviewRisk: "Rail must remain within safe area and not feel decorative.",
  },
  {
    id: "paymentCommandType",
    label: "Payment Command Type",
    frameRange: [8, 34],
    purpose: "Type the natural language payment command across the rail.",
    reusable: true,
    reviewRisk: "Long command text can overflow.",
  },
  {
    id: "searchChipActivate",
    label: "Search Chip Activate",
    frameRange: [28, 42],
    purpose: "Show the explicit submit/search action.",
    reusable: true,
    reviewRisk: "Activation must read as an action, not a random pulse.",
  },
  {
    id: "recordingSubtitleReveal",
    label: "Recording Subtitle Reveal",
    frameRange: [24, 42],
    purpose: "Reveal the supporting explanation under the prompt.",
    reusable: true,
    reviewRisk: "Subtitle should be optional for small formats.",
  },
  {
    id: "paymentFormPushIn",
    label: "Payment Form Push In",
    frameRange: [34, 54],
    purpose: "Show the structured result form emerging from the prompt.",
    reusable: true,
    reviewRisk: "Form must not cover the prompt too early.",
  },
  {
    id: "demoSoftSettle",
    label: "Demo Soft Settle",
    frameRange: [46, 54],
    purpose: "Hold the relationship between prompt and generated form.",
    reusable: true,
    reviewRisk: "End state should not imply another transition.",
  },
];

export const shot89AtomicMotionIds = shot89AtomicMotions.map((motion) => motion.id);

export const shot89MotionPackageStatus = {
  shotId: "shot_89",
  libraryId: "payment-prompt-to-form-reveal",
  choreographyId: "paymentPromptToFormReveal",
  sceneType: "searchDemo",
  visualApproved: false,
  implementationVerified: false,
  approved: false,
  allowedInFactory: false,
} as const;
