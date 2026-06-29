export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot40AtomicMotions = [
  {
    id: "result-phone-hold",
    purpose: "Maintain the mobile result surface in a close angled crop.",
    timingFrames: [0, 52],
    properties: {
      rotateZ: [-2.2, -1.4],
      scale: [1.01, 1],
    },
    reviewRisk: "The phone edge should not hide generated content.",
  },
  {
    id: "generated-copy-reveal",
    purpose: "Reveal the AI-generated result text as the semantic center.",
    timingFrames: [6, 28],
    properties: {
      opacity: [0, 1],
      translateY: [10, 0],
      lineStaggerFrames: 5,
    },
    reviewRisk: "Small result text must remain readable and bounded.",
  },
  {
    id: "ai-sparkle-pop",
    purpose: "Mark the generated text as AI-produced without adding random decoration.",
    timingFrames: [12, 34],
    properties: {
      scale: [0.6, 1.12, 1],
      opacity: [0, 1, 0.72],
    },
    reviewRisk: "Sparkle must stay near the result text and remain subtle.",
  },
  {
    id: "feedback-icons-settle",
    purpose: "Expose review actions below the generated result.",
    timingFrames: [22, 42],
    properties: {
      opacity: [0, 1],
      translateY: [8, 0],
      staggerFrames: 3,
    },
    reviewRisk: "Icons need enough spacing for production adaptation.",
  },
  {
    id: "composer-return-hold",
    purpose: "Settle the next prompt composer at the bottom.",
    timingFrames: [34, 52],
    properties: {
      opacity: [0, 1],
      translateY: [16, 0],
    },
    reviewRisk: "End frame must hold without flash or late drift.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot40AtomicMotionIds = shot40AtomicMotions.map((motion) => motion.id);

export const shot40AtomicMotionPackage = {
  shotId: "shot_40",
  libraryId: "mobile-generated-result-card-pop",
  choreographyId: "mobileGeneratedResultCardPop",
  sceneType: "aiRecommendation",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
