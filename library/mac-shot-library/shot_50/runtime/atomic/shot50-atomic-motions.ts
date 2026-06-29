export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot50AtomicMotions = [
  {
    id: "website-headline-lockup-reveal",
    purpose: "Establish the app-building promise before the dashboard appears.",
    timingFrames: [0, 30],
    properties: {
      opacity: [0, 1],
      translateY: [-10, 0],
    },
    reviewRisk: "Headline cannot dominate so much that the shot becomes a static hero slide.",
  },
  {
    id: "dashboard-shell-slide-in",
    purpose: "Bring the main browser/dashboard surface into the center of the frame.",
    timingFrames: [12, 54],
    properties: {
      opacity: [0, 1],
      translateY: [26, 0],
      scale: [0.965, 1],
    },
    reviewRisk: "Browser shell must stay inside safe area and keep a clear appGrid read.",
  },
  {
    id: "metric-cards-stagger",
    purpose: "Resolve KPI counters after the shell is visible.",
    timingFrames: [34, 78],
    properties: {
      opacity: [0, 1],
      translateY: [10, 0],
      staggerFrames: 6,
    },
    reviewRisk: "Counters should read as data modules rather than decorative chips.",
  },
  {
    id: "heatmap-cells-paint",
    purpose: "Build the central grid cell by cell to show configurability.",
    timingFrames: [42, 96],
    properties: {
      opacity: [0.18, 1],
      scale: [0.86, 1],
      staggerFrames: 2,
    },
    reviewRisk: "Cell count should remain restrained enough to avoid visual noise.",
  },
  {
    id: "insight-modules-resolve",
    purpose: "Reveal gauge, calendar, and side modules as supporting app blocks.",
    timingFrames: [72, 126],
    properties: {
      opacity: [0, 1],
      translateX: [18, 0],
    },
    reviewRisk: "Supporting modules should not compete with the dashboard core.",
  },
  {
    id: "module-fanout-settle",
    purpose: "Spread secondary modules outward to imply a flexible app system.",
    timingFrames: [102, 150],
    properties: {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.94, 1],
    },
    reviewRisk: "Fanout cannot feel like random floating cards or obscure the main surface.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot50AtomicMotionIds = shot50AtomicMotions.map((motion) => motion.id);

export const shot50AtomicMotionPackage = {
  shotId: "shot_50",
  libraryId: "modular-dashboard-grid-build",
  choreographyId: "modularDashboardGridBuild",
  sceneType: "appGrid",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
