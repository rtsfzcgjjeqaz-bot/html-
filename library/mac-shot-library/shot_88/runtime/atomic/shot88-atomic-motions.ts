export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot88AtomicMotions: AtomicMotion[] = [
  {
    id: "backgroundGlowResolve",
    label: "Background Glow Resolve",
    frameRange: [0, 24],
    purpose: "Create the dark AI stage and direct attention toward the center stack.",
    reusable: true,
    reviewRisk: "Glow must not overpower the text or turn into abstract decoration.",
  },
  {
    id: "headlineReveal",
    label: "Headline Reveal",
    frameRange: [8, 34],
    purpose: "Reveal the product/prompt hook as the main title.",
    reusable: true,
    reviewRisk: "Long localized titles can crowd the upper safe area.",
  },
  {
    id: "staggeredTaskCardCascade",
    label: "Staggered Task Card Cascade",
    frameRange: [20, 58],
    purpose: "Build a denser six-card workflow stack with connected stagger timing.",
    reusable: true,
    reviewRisk: "Card count should feel rich without making the stack unreadable.",
  },
  {
    id: "activePromptCardPush",
    label: "Active Prompt Card Push",
    frameRange: [34, 78],
    purpose: "Bring the current AI action forward as the visual anchor.",
    reusable: true,
    reviewRisk: "The foreground card needs a clear semantic role.",
  },
  {
    id: "promptStripReveal",
    label: "Prompt Strip Reveal",
    frameRange: [54, 92],
    purpose: "Reveal the bottom prompt strip that explains the AI interaction.",
    reusable: true,
    reviewRisk: "Prompt text must stay short and not collide with card edges.",
  },
  {
    id: "hookSoftSettle",
    label: "Hook Soft Settle",
    frameRange: [86, 114],
    purpose: "Hold the cover hook long enough to read and transition cleanly.",
    reusable: true,
    reviewRisk: "Additional movement during the hold would reduce readability.",
  },
];

export const shot88AtomicMotionIds = shot88AtomicMotions.map((motion) => motion.id);

export const shot88MotionPackageStatus = {
  shotId: "shot_88",
  libraryId: "ai-prompt-card-stack-hook",
  choreographyId: "aiPromptCardStackHook",
  sceneType: "coverHook",
  visualApproved: false,
  implementationVerified: false,
  approved: false,
  allowedInFactory: false,
} as const;
