export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot73AtomicMotions = [
  {
    id: "wide-solution-board-focus",
    purpose: "Bring the full dark capability board from blur into focus.",
    timingFrames: [0, 42],
    properties: { opacity: [0, 1], blur: [12, 0], scale: [0.98, 1] },
    reviewRisk: "Opening must not look like an empty dark frame.",
  },
  {
    id: "promise-panel-slide-in",
    purpose: "Reveal the left value promise panel as the scene anchor.",
    timingFrames: [18, 66],
    properties: { opacity: [0, 1], translateX: [-42, 0] },
    reviewRisk: "Large copy must stay readable and inside safe area.",
  },
  {
    id: "capability-column-build",
    purpose: "Build matrix columns and headers in a controlled sequence.",
    timingFrames: [44, 118],
    properties: { opacity: [0, 1], translateY: [18, 0], staggerFrames: 8 },
    reviewRisk: "Matrix should communicate structure, not random cards.",
  },
  {
    id: "solution-tile-highlight-sweep",
    purpose: "Resolve highlighted blue solution tiles across the matrix.",
    timingFrames: [82, 154],
    properties: { opacity: [0, 1], glow: [0, 1], staggerFrames: 10 },
    reviewRisk: "Highlights cannot overpower labels or become decoration.",
  },
  {
    id: "outcome-proof-panel-push",
    purpose: "Introduce the right product/result proof panel with depth.",
    timingFrames: [110, 168],
    properties: { opacity: [0, 1], translateX: [34, 0], scale: [0.94, 1] },
    reviewRisk: "Right panel must not cover the capability matrix.",
  },
  {
    id: "bottom-summary-rail-reveal",
    purpose: "Reveal the bottom caption rail for solution summary.",
    timingFrames: [142, 190],
    properties: { opacity: [0, 1], translateY: [16, 0] },
    reviewRisk: "Caption should support the scene, not read as a subtitle-only shot.",
  },
  {
    id: "matrix-camera-settle",
    purpose: "Apply a restrained full-board push and hold.",
    timingFrames: [0, 219],
    properties: { scale: [0.985, 1.018], translateY: [6, 0] },
    reviewRisk: "Final frame needs to be stable enough for review.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot73AtomicMotionIds = shot73AtomicMotions.map((motion) => motion.id);

export const shot73AtomicMotionPackage = {
  shotId: "shot_73",
  libraryId: "platform-capability-matrix-reveal",
  choreographyId: "platformCapabilityMatrixReveal",
  sceneType: "resultComparison",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
