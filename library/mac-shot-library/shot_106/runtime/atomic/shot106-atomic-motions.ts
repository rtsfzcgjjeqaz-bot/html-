export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot106AtomicMotions: AtomicMotion[] = [
  { id: "sparkTravel", label: "Spark Travel", frameRange: [0, 26], purpose: "Move a small luminous spark toward the card position.", reusable: true, reviewRisk: "Spark should point to a semantic target." },
  { id: "gradientCardReveal", label: "Gradient Card Reveal", frameRange: [18, 58], purpose: "Expand a gradient panel from light bar to card.", reusable: true, reviewRisk: "Gradient should not cause text contrast issues." },
  { id: "titleWordResolve", label: "Title Word Resolve", frameRange: [44, 76], purpose: "Reveal a short feature word inside the card.", reusable: true, reviewRisk: "Low text capacity." },
  { id: "focusSubtitleFade", label: "Focus Subtitle Fade", frameRange: [60, 92], purpose: "Fade in short supporting copy.", reusable: true, reviewRisk: "Subtitle must stay concise." },
  { id: "cardEdgeShimmer", label: "Card Edge Shimmer", frameRange: [78, 96], purpose: "Sweep light across the card edge before hold.", reusable: true, reviewRisk: "Avoid repeated shimmer that feels decorative." },
];

export const shot106AtomicMotionIds = shot106AtomicMotions.map((motion) => motion.id);

export const shot106MotionPackageStatus = {
  shotId: "shot_106",
  libraryId: "gradient-form-card-reveal",
  choreographyId: "gradientFormCardReveal",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
