export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot43AtomicMotions = [
  {
    id: "dark-stage-fade",
    purpose: "Move into a dark result-focused product surface.",
    timingFrames: [0, 34],
    properties: { opacity: [0, 1], backgroundLift: [0, 0.18] },
    reviewRisk: "Contrast must stay high enough for card text.",
  },
  {
    id: "capability-card-wall-enter",
    purpose: "Reveal multiple result/capability cards as a structured grid.",
    timingFrames: [18, 78],
    properties: { translateX: [-80, 0], rotateY: [12, 0], staggerFrames: 7 },
    reviewRisk: "The card wall should feel like product content, not scattered panels.",
  },
  {
    id: "primary-card-push-forward",
    purpose: "Make one result card the semantic focus.",
    timingFrames: [64, 124],
    properties: { scale: [0.94, 1.08], translateZ: [0, 70], opacity: [0.72, 1] },
    reviewRisk: "Push must preserve safe bounds and text readability.",
  },
  {
    id: "supporting-cards-dim",
    purpose: "Reduce competing card contrast as the primary result appears.",
    timingFrames: [96, 142],
    properties: { opacity: [0.72, 0.32], blurPx: [0, 1.5] },
    reviewRisk: "Background cards should remain contextual, not disappear into black.",
  },
  {
    id: "result-badge-ring-settle",
    purpose: "Resolve the shot with a glowing capability badge.",
    timingFrames: [128, 171],
    properties: { scale: [0.84, 1.04, 1], ringOpacity: [0, 1, 0.72] },
    reviewRisk: "The ring must be tied to the result label and not become ornamental noise.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot43AtomicMotionIds = shot43AtomicMotions.map((motion) => motion.id);

export const shot43AtomicMotionPackage = {
  shotId: "shot_43",
  libraryId: "dark-capability-cards-burst",
  choreographyId: "darkCapabilityCardsBurst",
  sceneType: "resultComparison",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
