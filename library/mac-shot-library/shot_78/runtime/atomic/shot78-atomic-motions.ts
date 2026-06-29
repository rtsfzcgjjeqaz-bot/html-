export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot78AtomicMotions = [
  {
    id: "document-surface-tilt-in",
    purpose: "Introduce the dark document editor as a readable work surface.",
    timingFrames: [0, 20],
    properties: { opacity: [0, 1], translateX: [-36, 0], rotateZ: [-3, -1], scale: [0.96, 1] },
    reviewRisk: "Tilt must not make the content unreadable.",
  },
  {
    id: "paragraph-rows-resolve",
    purpose: "Resolve document paragraphs with line hierarchy.",
    timingFrames: [8, 28],
    properties: { opacity: [0, 1], staggerFrames: 3 },
    reviewRisk: "Rows should read as document structure, not random stripes.",
  },
  {
    id: "selection-highlight-sweep",
    purpose: "Highlight the text range being edited by AI.",
    timingFrames: [18, 36],
    properties: { width: [0, 1], opacity: [0, 1] },
    reviewRisk: "Highlight must align with text rows.",
  },
  {
    id: "ai-toolbar-dock-reveal",
    purpose: "Reveal the vertical AI action toolbar next to the selection.",
    timingFrames: [26, 44],
    properties: { opacity: [0, 1], translateX: [18, 0], scale: [0.94, 1] },
    reviewRisk: "Toolbar cannot float disconnected from selected content.",
  },
  {
    id: "command-tooltip-pop",
    purpose: "Show a short AI edit command beside the toolbar.",
    timingFrames: [34, 50],
    properties: { opacity: [0, 1], translateY: [8, 0] },
    reviewRisk: "Tooltip label must stay compact.",
  },
  {
    id: "selection-focus-settle",
    purpose: "Hold the final selected-text recommendation state.",
    timingFrames: [44, 53],
    properties: { glow: [1, 0.72], scale: [1.01, 1] },
    reviewRisk: "End frame should be stable and reviewable.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot78AtomicMotionIds = shot78AtomicMotions.map((motion) => motion.id);

export const shot78AtomicMotionPackage = {
  shotId: "shot_78",
  libraryId: "document-selection-ai-toolbar",
  choreographyId: "documentSelectionAiToolbar",
  sceneType: "aiRecommendation",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
