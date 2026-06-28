export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot71AtomicMotions = [
  {
    id: "mobile-governance-stage-vignette",
    purpose: "Establish a dark focused stage behind the phone stack.",
    timingFrames: [0, 36],
    properties: { opacity: [0, 1], radialFocus: "center-right" },
    reviewRisk: "Background must not become the primary visual.",
  },
  {
    id: "center-phone-focus-rise",
    purpose: "Bring the primary mobile workflow screen into focus.",
    timingFrames: [8, 58],
    properties: { opacity: [0, 1], translateY: [34, 0], scale: [0.94, 1] },
    reviewRisk: "Phone content must stay readable and inside safe area.",
  },
  {
    id: "side-phone-depth-fan",
    purpose: "Fan supporting mobile screens into a governance stack.",
    timingFrames: [32, 96],
    properties: { opacity: [0, 1], translateX: [-42, 0], rotate: [-4, 0], staggerFrames: 10 },
    reviewRisk: "Stack should read as product context, not random screenshots.",
  },
  {
    id: "qg-badge-anchor-pop",
    purpose: "Attach QG labels to each phone group.",
    timingFrames: [58, 122],
    properties: { opacity: [0, 1], translateY: [-10, 0], staggerFrames: 12 },
    reviewRisk: "Badges must be close enough to the related device cluster.",
  },
  {
    id: "quality-copy-reveal",
    purpose: "Reveal the three high-level governance claims around the stack.",
    timingFrames: [72, 152],
    properties: { opacity: [0, 1], translateX: [-20, 0], staggerFrames: 18 },
    reviewRisk: "Large text cannot collide with phones or leave frame.",
  },
  {
    id: "governance-connector-resolve",
    purpose: "Draw short semantic connectors between copy and device groups.",
    timingFrames: [108, 168],
    properties: { opacity: [0, 1], width: [0, 1], staggerFrames: 9 },
    reviewRisk: "Connectors should be restrained and non-decorative.",
  },
  {
    id: "mobile-stack-camera-settle",
    purpose: "Apply a gentle push-in and hold for review.",
    timingFrames: [0, 213],
    properties: { scale: [0.985, 1.025], translateY: [8, -2] },
    reviewRisk: "Final frame needs to feel stable and template-ready.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot71AtomicMotionIds = shot71AtomicMotions.map((motion) => motion.id);

export const shot71AtomicMotionPackage = {
  shotId: "shot_71",
  libraryId: "mobile-quality-governance-stack",
  choreographyId: "mobileQualityGovernanceStack",
  sceneType: "aiRecommendation",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
