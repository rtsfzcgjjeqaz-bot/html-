export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot136AtomicMotions: AtomicMotion[] = [
  { id: "agentCardFloatIn", label: "Agent Card Float In", frameRange: [0, 58], purpose: "Bring agent/template cards into a product catalog field.", reusable: true, reviewRisk: "Cards should not clutter the headline." },
  { id: "headlineScaleReveal", label: "Headline Scale Reveal", frameRange: [24, 76], purpose: "Resolve a short central hook headline.", reusable: true, reviewRisk: "Headline must stay short and centered." },
  { id: "cardParallaxSettle", label: "Card Parallax Settle", frameRange: [48, 108], purpose: "Settle cards with layered depth.", reusable: true, reviewRisk: "Parallax should not push cards off-screen." },
  { id: "ctaChipPulse", label: "CTA Chip Pulse", frameRange: [66, 122], purpose: "Subtly emphasize actionable chips inside selected cards.", reusable: true, reviewRisk: "Pulse should not look like an ad banner." },
  { id: "hookHold", label: "Hook Hold", frameRange: [116, 140], purpose: "Hold final cover hook for reading.", reusable: true, reviewRisk: "No late drift over the headline." },
];

export const shot136AtomicMotionIds = shot136AtomicMotions.map((motion) => motion.id);

export const shot136MotionPackageStatus = {
  shotId: "shot_136",
  libraryId: "prebuilt-agent-cards-reveal",
  choreographyId: "prebuiltAgentCardsReveal",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
