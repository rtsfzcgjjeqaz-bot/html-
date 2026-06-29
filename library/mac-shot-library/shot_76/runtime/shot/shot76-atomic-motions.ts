export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot76AtomicMotions = [
  {
    id: "dark-hero-stage-resolve",
    purpose: "Establish the dark AI assistant hero stage.",
    timingFrames: [0, 18],
    properties: { opacity: [0, 1], glow: [0, 1] },
    reviewRisk: "Stage should not begin as an empty black frame.",
  },
  {
    id: "desktop-assistant-panel-push",
    purpose: "Bring the main desktop AI assistant surface forward.",
    timingFrames: [6, 42],
    properties: { opacity: [0, 1], translateX: [-54, 0], rotateY: [8, 0], scale: [0.92, 1] },
    reviewRisk: "Panel tilt must not reduce greeting readability.",
  },
  {
    id: "phone-panel-depth-parallax",
    purpose: "Introduce a smaller phone surface as responsive context.",
    timingFrames: [16, 52],
    properties: { opacity: [0, 1], translateX: [44, 0], scale: [0.9, 1], delayFrames: 10 },
    reviewRisk: "Phone cannot overlap the main greeting.",
  },
  {
    id: "assistant-greeting-reveal",
    purpose: "Resolve the central assistant greeting.",
    timingFrames: [22, 56],
    properties: { opacity: [0, 1], translateY: [12, 0], gradientText: true },
    reviewRisk: "Greeting must remain short or dynamically scaled.",
  },
  {
    id: "hero-value-cta-reveal",
    purpose: "Reveal value text and Canvas CTA below the panels.",
    timingFrames: [44, 74],
    properties: { opacity: [0, 1], translateY: [12, 0], staggerFrames: 8 },
    reviewRisk: "CTA must align to a semantic product action.",
  },
  {
    id: "assistant-hero-camera-settle",
    purpose: "Apply a gentle final push and hold.",
    timingFrames: [0, 85],
    properties: { scale: [0.985, 1.018], translateY: [8, 0] },
    reviewRisk: "End frame must be stable for review.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot76AtomicMotionIds = shot76AtomicMotions.map((motion) => motion.id);

export const shot76AtomicMotionPackage = {
  shotId: "shot_76",
  libraryId: "dark-assistant-device-hero",
  choreographyId: "darkAssistantDeviceHero",
  sceneType: "websiteHero",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
