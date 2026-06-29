export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot79AtomicMotions = [
  {
    id: "selected-document-context",
    purpose: "Establish the selected document text as the semantic anchor.",
    timingFrames: [0, 22],
    properties: { opacity: [0, 1], blur: [8, 0], highlightOpacity: [0, 1] },
    reviewRisk: "Selection must be readable enough to justify the AI card.",
  },
  {
    id: "toolbar-action-dock",
    purpose: "Dock the AI toolbar beside the selected text.",
    timingFrames: [12, 34],
    properties: { opacity: [0, 1], translateX: [18, 0], scale: [0.94, 1] },
    reviewRisk: "Toolbar must not float without attachment.",
  },
  {
    id: "edit-command-tooltip-cycle",
    purpose: "Reveal compact edit command labels.",
    timingFrames: [24, 48],
    properties: { opacity: [0, 1], labels: ["Change length", "Longer", "Suggest Edits"] },
    reviewRisk: "Labels must stay short and unobtrusive.",
  },
  {
    id: "suggestion-card-expand",
    purpose: "Expand the AI suggestion result card from the toolbar action point.",
    timingFrames: [42, 68],
    properties: { opacity: [0, 1], scale: [0.72, 1], translateY: [18, 0] },
    reviewRisk: "Card expansion must feel connected to the selection.",
  },
  {
    id: "suggestion-copy-resolve",
    purpose: "Resolve suggested copy lines inside the card.",
    timingFrames: [58, 82],
    properties: { opacity: [0, 1], staggerFrames: 4 },
    reviewRisk: "Text lines should have hierarchy, not be generic stripes.",
  },
  {
    id: "suggestion-focus-settle",
    purpose: "Hold the completed suggestion card state.",
    timingFrames: [78, 89],
    properties: { glow: [1, 0.72], scale: [1.012, 1] },
    reviewRisk: "End state must be stable and reviewable.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot79AtomicMotionIds = shot79AtomicMotions.map((motion) => motion.id);

export const shot79AtomicMotionPackage = {
  shotId: "shot_79",
  libraryId: "ai-suggestion-card-from-selection",
  choreographyId: "aiSuggestionCardFromSelection",
  sceneType: "aiRecommendation",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
