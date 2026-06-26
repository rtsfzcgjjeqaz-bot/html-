export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot39AtomicMotions = [
  {
    id: "phone-close-crop-enter",
    purpose: "Bring a mobile prompt surface into a close-up product demo crop.",
    timingFrames: [0, 36],
    properties: {
      translateX: [90, 0],
      rotateZ: [-3, 0],
      scale: [0.96, 1],
    },
    reviewRisk: "Close crop must not cut off the active prompt or send affordance.",
  },
  {
    id: "media-thumbnail-anchor",
    purpose: "Show that the prompt is grounded in an attached visual input.",
    timingFrames: [18, 52],
    properties: {
      opacity: [0, 1],
      scale: [0.92, 1],
    },
    reviewRisk: "Thumbnail should read as app content, not a random sticker.",
  },
  {
    id: "mobile-prompt-type",
    purpose: "Reveal the user's search or creation intent inside the composer.",
    timingFrames: [28, 82],
    properties: {
      text: "Create a cute social caption for Baxter",
      cursorBlink: true,
    },
    reviewRisk: "Long prompts require wrapping and safe text bounds.",
  },
  {
    id: "composer-tools-pop",
    purpose: "Introduce microphone and camera controls as functional action affordances.",
    timingFrames: [58, 94],
    properties: {
      opacity: [0, 1],
      translateY: [12, 0],
      scale: [0.94, 1],
    },
    reviewRisk: "Controls should not overpower the prompt text.",
  },
  {
    id: "send-ready-settle",
    purpose: "Signal the prompt is ready to submit and hold a reviewable final state.",
    timingFrames: [84, 111],
    properties: {
      sendOpacity: [0.2, 1],
      glowOpacity: [0, 0.18],
    },
    reviewRisk: "End frame must not drift or flash after the send state appears.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot39AtomicMotionIds = shot39AtomicMotions.map((motion) => motion.id);

export const shot39AtomicMotionPackage = {
  shotId: "shot_39",
  libraryId: "mobile-prompt-composer-flow",
  choreographyId: "mobilePromptComposerFlow",
  sceneType: "searchDemo",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
