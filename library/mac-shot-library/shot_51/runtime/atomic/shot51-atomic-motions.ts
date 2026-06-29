export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot51AtomicMotions = [
  {
    id: "warm-insight-canvas-fade",
    purpose: "Open into a warm analytical product canvas.",
    timingFrames: [0, 18],
    properties: { opacity: [0, 1], warmth: [0, 1] },
    reviewRisk: "Opening cannot feel like a blank beige slide.",
  },
  {
    id: "dashboard-card-lift",
    purpose: "Bring the main data dashboard into view as the primary anchor.",
    timingFrames: [8, 38],
    properties: { opacity: [0, 1], translateY: [22, 0], scale: [0.96, 1] },
    reviewRisk: "Dashboard card must stay readable inside safe area.",
  },
  {
    id: "hero-metric-stagger",
    purpose: "Resolve hero object, KPI figures, and status chips in sequence.",
    timingFrames: [24, 58],
    properties: { opacity: [0, 1], translateY: [8, 0], staggerFrames: 5 },
    reviewRisk: "Metrics must be semantic and not decorative number noise.",
  },
  {
    id: "timeline-bars-draw",
    purpose: "Draw the planning/price-insight bars horizontally.",
    timingFrames: [42, 76],
    properties: { scaleX: [0, 1], opacity: [0, 1], staggerFrames: 4 },
    reviewRisk: "Bars need consistent alignment and readable grouping.",
  },
  {
    id: "analysis-rows-resolve",
    purpose: "Reveal supporting rows that explain the insight.",
    timingFrames: [52, 84],
    properties: { opacity: [0, 1], translateX: [12, 0], staggerFrames: 4 },
    reviewRisk: "Rows should not overcrowd the central timeline.",
  },
  {
    id: "page-stack-fan-settle",
    purpose: "Transform the single insight page into a reusable app-system stack.",
    timingFrames: [70, 102],
    properties: { opacity: [0, 1], rotate: [-6, 6], translateX: [-90, 90] },
    reviewRisk: "Fanout must not bury the core dashboard or become a pure carousel.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot51AtomicMotionIds = shot51AtomicMotions.map((motion) => motion.id);

export const shot51AtomicMotionPackage = {
  shotId: "shot_51",
  libraryId: "vehicle-timeline-metric-insight",
  choreographyId: "vehicleTimelineMetricInsight",
  sceneType: "priceInsight",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
