export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot64AtomicMotions = [
  {
    id: "dark-card-stack-bloom",
    purpose: "Reveal the surrounding proof-card stack in a dark environment.",
    timingFrames: [0, 18],
    properties: { opacity: [0, 1], blur: [10, 2], scale: [0.96, 1] },
    reviewRisk: "Opening must not read as black or empty.",
  },
  {
    id: "background-cards-depth-drift",
    purpose: "Move non-active cards backward to create comparison depth.",
    timingFrames: [6, 36],
    properties: { translateX: [-36, 24], scale: [1, 0.88], opacity: [0.8, 0.42] },
    reviewRisk: "Depth cards should stay semantic, not random floating tiles.",
  },
  {
    id: "foreground-card-focus-snap",
    purpose: "Snap the active high-investment card into focus.",
    timingFrames: [12, 34],
    properties: { opacity: [0, 1], translateY: [26, 0], scale: [0.92, 1] },
    reviewRisk: "Active card must be clearly dominant and inside safe area.",
  },
  {
    id: "result-label-number-pop",
    purpose: "Reveal bold label and numbered result marker.",
    timingFrames: [24, 44],
    properties: { opacity: [0, 1], translateY: [8, 0], glow: [0, 1] },
    reviewRisk: "Text must not overflow and number cannot feel arbitrary.",
  },
  {
    id: "impact-card-hold-settle",
    purpose: "Hold the focused proof card for reading.",
    timingFrames: [44, 57],
    properties: { scale: [1.02, 1], glow: [1, 0.74] },
    reviewRisk: "Hold must remain stable rather than jittery.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot64AtomicMotionIds = shot64AtomicMotions.map((motion) => motion.id);

export const shot64AtomicMotionPackage = {
  shotId: "shot_64",
  libraryId: "big-number-investment-impact",
  choreographyId: "bigNumberInvestmentImpact",
  sceneType: "resultComparison",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
