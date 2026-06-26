export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot44AtomicMotions = [
  {
    id: "cta-title-fade",
    purpose: "Introduce the feature stage with a compact CTA title.",
    timingFrames: [0, 38],
    properties: { opacity: [0, 1], translateY: [12, 0] },
    reviewRisk: "Headline must stay short and not collide with devices.",
  },
  {
    id: "mobile-device-slide-in",
    purpose: "Bring the mobile product surface into the left side of the stage.",
    timingFrames: [28, 82],
    properties: { translateX: [-130, 0], rotateZ: [-4, -1], opacity: [0, 1] },
    reviewRisk: "The phone cannot cover the title or clip at the bottom.",
  },
  {
    id: "desktop-panel-slide-in",
    purpose: "Bring the desktop/product panel into the right side of the stage.",
    timingFrames: [42, 96],
    properties: { translateX: [150, 0], rotateY: [-12, -5], opacity: [0, 1] },
    reviewRisk: "Perspective should not make the panel unreadable.",
  },
  {
    id: "surface-content-brighten",
    purpose: "Brighten content rows inside both product surfaces.",
    timingFrames: [78, 116],
    properties: { opacity: [0.42, 1], glowOpacity: [0, 0.22] },
    reviewRisk: "Highlights must point to real product regions rather than decoration.",
  },
  {
    id: "dual-device-settle",
    purpose: "Hold both surfaces in a balanced final feature layout.",
    timingFrames: [108, 126],
    properties: { scale: [1.015, 1], glowOpacity: [0.24, 0.14] },
    reviewRisk: "End state must stay stable and not drift.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot44AtomicMotionIds = shot44AtomicMotions.map((motion) => motion.id);

export const shot44AtomicMotionPackage = {
  shotId: "shot_44",
  libraryId: "dual-device-feature-stage",
  choreographyId: "dualDeviceFeatureStage",
  sceneType: "featureHighlight",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
