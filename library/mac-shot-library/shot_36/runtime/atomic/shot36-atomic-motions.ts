export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot36AtomicMotions = [
  {
    id: "prompt-field-emerge",
    purpose: "Introduce the search or writing intent with a centered prompt input.",
    timingFrames: [0, 56],
    properties: {
      opacity: [0, 1],
      translateY: [18, 0],
      widthRatio: [0.22, 0.44],
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    reviewRisk: "The field should not feel like an empty decorative pill; it needs visible typing or intent.",
  },
  {
    id: "typed-query-reveal",
    purpose: "Show the user's prompt forming before the workspace result appears.",
    timingFrames: [24, 96],
    properties: {
      characters: ["S", "Summarize", "Summarize my notes"],
      cursorBlink: true,
    },
    reviewRisk: "Long localized strings need width constraints and ellipsis behavior.",
  },
  {
    id: "workspace-angled-enter",
    purpose: "Move from prompt intent into the generated email workspace.",
    timingFrames: [68, 136],
    properties: {
      rotateY: [12, 0],
      rotateZ: [1.4, 0],
      translateX: [180, 0],
      scale: [0.9, 1],
    },
    reviewRisk: "Excessive perspective will make the email draft unreadable.",
  },
  {
    id: "draft-lines-generate",
    purpose: "Reveal generated email content rows in a clear top-to-bottom order.",
    timingFrames: [112, 212],
    properties: {
      rowStaggerFrames: 10,
      opacity: [0, 1],
      translateY: [10, 0],
    },
    reviewRisk: "Rows must read as content generation, not random loading skeletons.",
  },
  {
    id: "ai-suggestion-rail-settle",
    purpose: "Add a small assistant recommendation area without stealing focus from the draft.",
    timingFrames: [174, 250],
    properties: {
      opacity: [0, 1],
      translateX: [28, 0],
      highlightOpacity: [0, 0.24],
    },
    reviewRisk: "The rail should stay secondary and not create layout clutter.",
  },
  {
    id: "final-review-hold",
    purpose: "Lock the completed result long enough for visual QA.",
    timingFrames: [238, 288],
    properties: {
      cameraScale: [1.012, 1],
      glowOpacity: [0.26, 0.14],
    },
    reviewRisk: "End state must avoid flash, blank frame, or post-motion drift.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot36AtomicMotionIds = shot36AtomicMotions.map((motion) => motion.id);

export const shot36AtomicMotionPackage = {
  shotId: "shot_36",
  libraryId: "email-draft-generation-demo",
  choreographyId: "emailDraftGenerationDemo",
  sceneType: "searchDemo",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
