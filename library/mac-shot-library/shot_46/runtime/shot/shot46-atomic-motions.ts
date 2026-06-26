export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot46AtomicMotions = [
  {
    id: "dark-engine-stage-fade",
    purpose: "Reveal the dark product-engine environment without starting on a dead black frame.",
    timingFrames: [0, 18],
    properties: {
      opacity: [0, 1],
      ambientGlow: [0, 0.22],
    },
    reviewRisk: "Opening should feel intentional and not like a blank or failed render.",
  },
  {
    id: "core-module-rise",
    purpose: "Make the central product module become the semantic anchor.",
    timingFrames: [8, 34],
    properties: {
      opacity: [0, 1],
      translateY: [18, 0],
      scale: [0.9, 1],
      glowOpacity: [0.08, 0.44],
    },
    reviewRisk: "Core module must remain the focus; glow cannot wash out the shape.",
  },
  {
    id: "connection-rails-extend",
    purpose: "Connect the core to surrounding workflow lanes.",
    timingFrames: [18, 48],
    properties: {
      scaleX: [0, 1],
      opacity: [0, 0.82],
      staggerFrames: 4,
    },
    reviewRisk: "Rails need to imply system connections, not decorative random lines.",
  },
  {
    id: "workflow-nodes-activate",
    purpose: "Activate nearby nodes to show the core powering a network.",
    timingFrames: [28, 58],
    properties: {
      opacity: [0.18, 1],
      scale: [0.86, 1],
      staggerFrames: 5,
    },
    reviewRisk: "Node count should stay restrained to avoid visual clutter.",
  },
  {
    id: "camera-push-settle",
    purpose: "Give the cover hook a compact cinematic push and stable end frame.",
    timingFrames: [0, 67],
    properties: {
      scale: [0.96, 1.02],
      translateY: [8, 0],
    },
    reviewRisk: "Push should not crop rails or move the center module off safe area.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot46AtomicMotionIds = shot46AtomicMotions.map((motion) => motion.id);

export const shot46AtomicMotionPackage = {
  shotId: "shot_46",
  libraryId: "dark-product-engine-cover",
  choreographyId: "darkProductEngineCover",
  sceneType: "coverHook",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
