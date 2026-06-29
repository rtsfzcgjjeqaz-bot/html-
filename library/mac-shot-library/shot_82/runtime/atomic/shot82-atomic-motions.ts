export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot82AtomicMotions = [
  {
    id: "editor-toolbar-context-resolve",
    purpose: "Resolve the dark editor context and toolbar so the toggle has product meaning.",
    timingFrames: [0, 16],
    properties: { opacity: [0, 1], blur: [10, 0], translateY: [10, 0] },
    reviewRisk: "Code context must not overpower the toggle.",
  },
  {
    id: "segmented-toggle-arrive",
    purpose: "Bring the Code / Preview segmented control into focus.",
    timingFrames: [8, 24],
    properties: { opacity: [0, 1], scale: [0.94, 1], glow: [0, 0.45] },
    reviewRisk: "Control labels must stay legible at 960x540.",
  },
  {
    id: "cursor-preview-target",
    purpose: "Move the cursor toward the Preview segment with an intentional target path.",
    timingFrames: [18, 36],
    properties: { translateX: [-112, 0], translateY: [54, 0], opacity: [0, 1] },
    reviewRisk: "Cursor should clearly land on Preview, not between segments.",
  },
  {
    id: "preview-toggle-activate",
    purpose: "Activate Preview with a checkmark and blue-violet filled segment.",
    timingFrames: [32, 46],
    properties: { activeSegment: "Preview", glow: [0.3, 1], scale: [1, 1.04] },
    reviewRisk: "Activation must not look like a random color pulse.",
  },
  {
    id: "focus-lens-expand",
    purpose: "Expand a circular focus lens around the active toggle.",
    timingFrames: [38, 58],
    properties: { scale: [0.72, 1], opacity: [0, 1], blur: [16, 0] },
    reviewRisk: "Lens must support the interaction and stay within safe area.",
  },
  {
    id: "preview-state-settle",
    purpose: "Hold the activated Preview state for review.",
    timingFrames: [54, 67],
    properties: { scale: [1.025, 1], glow: [1, 0.76] },
    reviewRisk: "End state must be stable and not imply another transition is starting.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot82AtomicMotionIds = shot82AtomicMotions.map((motion) => motion.id);

export const shot82AtomicMotionPackage = {
  shotId: "shot_82",
  libraryId: "code-preview-toggle-focus",
  choreographyId: "codePreviewToggleFocus",
  sceneType: "featureHighlight",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
