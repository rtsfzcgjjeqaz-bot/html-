export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot92AtomicMotions: AtomicMotion[] = [
  { id: "successCardEnter", label: "Success Card Enter", frameRange: [0, 18], purpose: "Bring the completed-action card into view.", reusable: true, reviewRisk: "Card cannot crop CTA buttons." },
  { id: "confirmationMarkPop", label: "Confirmation Mark Pop", frameRange: [8, 24], purpose: "Emphasize successful completion with a green confirmation mark.", reusable: true, reviewRisk: "Mark must stay semantic." },
  { id: "successButtonsSettle", label: "Success Buttons Settle", frameRange: [16, 34], purpose: "Settle action buttons under the success message.", reusable: true, reviewRisk: "Button labels must stay short." },
  { id: "cardRecede", label: "Card Recede", frameRange: [28, 46], purpose: "Move the success card back so the benefit headline can take over.", reusable: true, reviewRisk: "Recede should not look like an accidental fade." },
  { id: "benefitHeadlineReveal", label: "Benefit Headline Reveal", frameRange: [36, 56], purpose: "Reveal the concise product benefit after the completed action.", reusable: true, reviewRisk: "Headline should not exceed safe width." },
  { id: "finalBenefitHold", label: "Final Benefit Hold", frameRange: [54, 63], purpose: "Hold the benefit statement for readability.", reusable: true, reviewRisk: "No extra motion should distract from the headline." },
];

export const shot92AtomicMotionIds = shot92AtomicMotions.map((motion) => motion.id);

export const shot92MotionPackageStatus = {
  shotId: "shot_92",
  libraryId: "ledger-success-benefit-reveal",
  choreographyId: "ledgerSuccessBenefitReveal",
  sceneType: "featureHighlight",
  visualApproved: false,
  implementationVerified: false,
  approved: false,
  allowedInFactory: false,
} as const;
