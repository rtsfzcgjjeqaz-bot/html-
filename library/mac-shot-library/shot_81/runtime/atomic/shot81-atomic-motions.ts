export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot81AtomicMotions = [
  {
    id: "ambient-code-glow-resolve",
    purpose: "Resolve the dark blue-violet product-demo atmosphere without adding decorative clutter.",
    timingFrames: [0, 14],
    properties: { opacity: [0, 1], scale: [0.96, 1], blur: [18, 0] },
    reviewRisk: "Glow must support the interface and not become an abstract background-only shot.",
  },
  {
    id: "keyword-headline-focus",
    purpose: "Reveal a short top headline and emphasize the code keyword as the semantic hook.",
    timingFrames: [6, 28],
    properties: { opacity: [0, 1], translateY: [-8, 0], keywordColor: "#7b8cff" },
    reviewRisk: "Long replacement text may overflow or weaken the keyword emphasis.",
  },
  {
    id: "angled-code-canvas-push",
    purpose: "Bring the code editor surface up from the lower left with a subtle camera push.",
    timingFrames: [10, 36],
    properties: { opacity: [0, 1], translateY: [36, 0], translateX: [-38, 0], scale: [0.9, 1] },
    reviewRisk: "The editor must not crop out the active selection or feel like a static screenshot.",
  },
  {
    id: "code-line-stagger-build",
    purpose: "Build code rows in staggered passes to show active generation.",
    timingFrames: [18, 46],
    properties: { rowOpacity: [0, 1], staggerFrames: 2, rows: 12 },
    reviewRisk: "Rows need structural hierarchy and should not look like arbitrary decorative lines.",
  },
  {
    id: "selection-block-lock",
    purpose: "Land a focused blue selection block on the code canvas.",
    timingFrames: [28, 50],
    properties: { opacity: [0, 1], scaleX: [0.7, 1], glow: [0.2, 1] },
    reviewRisk: "Selection should stay attached to the code and not float independently.",
  },
  {
    id: "code-canvas-settle",
    purpose: "Stabilize the full composition for review at the end of the shot.",
    timingFrames: [48, 62],
    properties: { scale: [1.018, 1], glow: [1, 0.76] },
    reviewRisk: "End frame must be stable with no late movement that implies the shot is unfinished.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot81AtomicMotionIds = shot81AtomicMotions.map((motion) => motion.id);

export const shot81AtomicMotionPackage = {
  shotId: "shot_81",
  libraryId: "dark-prompt-code-canvas-push",
  choreographyId: "darkPromptCodeCanvasPush",
  sceneType: "searchDemo",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
