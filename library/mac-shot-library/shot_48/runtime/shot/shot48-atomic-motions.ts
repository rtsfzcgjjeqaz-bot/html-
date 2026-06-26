export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot48AtomicMotions = [
  {
    id: "workflow-canvas-wash-in",
    purpose: "Bring up the neutral product canvas while avoiding a blank first frame.",
    timingFrames: [0, 24],
    properties: {
      opacity: [0, 1],
      backgroundShiftY: [10, 0],
    },
    reviewRisk: "Opening must read as a designed interface scene, not an empty white slide.",
  },
  {
    id: "primary-step-card-lift",
    purpose: "Introduce the source workflow step as the first semantic anchor.",
    timingFrames: [12, 48],
    properties: {
      opacity: [0, 1],
      translateY: [22, 0],
      scale: [0.96, 1],
    },
    reviewRisk: "Card cannot drift outside safe area or feel like a decorative tile.",
  },
  {
    id: "directional-connector-draw",
    purpose: "Draw a left-to-right dependency rail between workflow cards.",
    timingFrames: [40, 82],
    properties: {
      scaleX: [0, 1],
      opacity: [0, 1],
      direction: "left-to-right",
    },
    reviewRisk: "Connector must preserve direction and not become a random line.",
  },
  {
    id: "dependent-step-card-reveal",
    purpose: "Reveal the downstream assessment card after the connector establishes sequence.",
    timingFrames: [68, 108],
    properties: {
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.965, 1],
    },
    reviewRisk: "Second card needs to feel caused by the first step, not simply duplicated.",
  },
  {
    id: "card-detail-progressive-resolve",
    purpose: "Resolve labels, status chips, and row details inside each card.",
    timingFrames: [52, 128],
    properties: {
      rowOpacity: [0, 1],
      rowTranslateY: [8, 0],
      staggerFrames: 6,
    },
    reviewRisk: "Dense detail should remain readable and not create visual clutter.",
  },
  {
    id: "camera-soft-push-settle",
    purpose: "Give the workflow a subtle product-video push and stable reviewable end frame.",
    timingFrames: [0, 162],
    properties: {
      scale: [0.985, 1.025],
      translateY: [6, 0],
    },
    reviewRisk: "Camera movement must not crop card shadows, labels, or connector endpoints.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot48AtomicMotionIds = shot48AtomicMotions.map((motion) => motion.id);

export const shot48AtomicMotionPackage = {
  shotId: "shot_48",
  libraryId: "connected-workflow-step-cards",
  choreographyId: "connectedWorkflowStepCards",
  sceneType: "stepFlow",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
