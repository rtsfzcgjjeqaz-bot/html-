export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot123AtomicMotions: AtomicMotion[] = [
  { id: "cleanStageRise", label: "Clean Stage Rise", frameRange: [0, 18], purpose: "Resolve a bright app/search stage without blank white flash.", reusable: true, reviewRisk: "Background must keep subtle depth." },
  { id: "phonePanelLift", label: "Phone Panel Lift", frameRange: [6, 34], purpose: "Lift a mobile UI surface from the lower frame into focus.", reusable: true, reviewRisk: "Device crop should feel intentional." },
  { id: "headlineQuestionReveal", label: "Headline Question Reveal", frameRange: [12, 36], purpose: "Reveal a short need or query headline above the UI.", reusable: true, reviewRisk: "Copy must remain inside safe area." },
  { id: "languageToggleFocus", label: "Language Toggle Focus", frameRange: [24, 48], purpose: "Settle paired language pills as the semantic control.", reusable: true, reviewRisk: "Do not add unrelated labels or decoration." },
  { id: "promptInputGlow", label: "Prompt Input Glow", frameRange: [34, 58], purpose: "Highlight the prompt/input field as the action target.", reusable: true, reviewRisk: "Glow should support hierarchy, not wash out text." },
  { id: "softHoldSettle", label: "Soft Hold Settle", frameRange: [52, 66], purpose: "Stabilize the search state for review.", reusable: true, reviewRisk: "No late drift or text movement." },
];

export const shot123AtomicMotionIds = shot123AtomicMotions.map((motion) => motion.id);

export const shot123MotionPackageStatus = {
  shotId: "shot_123",
  libraryId: "language-need-prompt-focus",
  choreographyId: "languageNeedPromptFocus",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
