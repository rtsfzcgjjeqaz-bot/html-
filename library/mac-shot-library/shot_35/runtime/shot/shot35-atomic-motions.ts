export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot35AtomicMotions = [
  {
    id: "angled-product-surface-enter",
    purpose: "Bring the main product surface into view as the hero object.",
    timingFrames: [0, 64],
    properties: {
      opacity: [0, 1],
      translateX: ["24vw", "8vw"],
      rotateY: [-14, -7],
      rotateZ: [-1.8, -0.8],
      scale: [0.97, 1.02],
    },
    reviewRisk: "Panel must not crop meaningful UI or create a blank white frame.",
  },
  {
    id: "sidebar-reveal",
    purpose: "Expose the app's navigation rail and make the surface feel like a real product.",
    timingFrames: [18, 76],
    properties: {
      opacity: [0, 1],
      translateX: [-34, 0],
    },
    reviewRisk: "Sidebar should be structural, not decorative icon noise.",
  },
  {
    id: "hero-header-settle",
    purpose: "Lock the product label/header into a readable top region.",
    timingFrames: [42, 86],
    properties: {
      opacity: [0, 1],
      translateY: [10, 0],
    },
    reviewRisk: "Header must remain replaceable and not hard-coded to a brand during production integration.",
  },
  {
    id: "workspace-content-card",
    purpose: "Prevent the hero from becoming an empty white app shell.",
    timingFrames: [104, 154],
    properties: {
      opacity: [0, 1],
      translateY: [24, 0],
      rowCount: 3,
    },
    reviewRisk: "Content card should communicate product context without becoming fake data.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot35AtomicMotionIds = shot35AtomicMotions.map((motion) => motion.id);

export const shot35AtomicMotionPackage = {
  shotId: "shot_35",
  libraryId: "website-hero-angled-product-surface",
  choreographyId: "websiteHeroAngledProductSurface",
  sceneType: "websiteHero",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
