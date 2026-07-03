export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot115AtomicMotions: AtomicMotion[] = [
  {
    id: "ribbonStackOrbit",
    label: "Ribbon Stack Orbit",
    frameRange: [0, 30],
    purpose: "Orbit translucent suggestion ribbons into a compact stack.",
    reusable: true,
    reviewRisk: "Must read as suggestion options, not random color strips.",
  },
  {
    id: "suggestionDepthSpread",
    label: "Suggestion Depth Spread",
    frameRange: [12, 46],
    purpose: "Separate option cards with slight z-depth and timing offsets.",
    reusable: true,
    reviewRisk: "Too much spread can create clutter or text illegibility.",
  },
  {
    id: "cursorPickSweep",
    label: "Cursor Pick Sweep",
    frameRange: [24, 54],
    purpose: "Sweep cursor across stack and choose a single suggestion.",
    reusable: true,
    reviewRisk: "Cursor target must be a visible option card.",
  },
  {
    id: "selectionReturnZoom",
    label: "Selection Return Zoom",
    frameRange: [46, 70],
    purpose: "Bring selected text from option stack back into document context.",
    reusable: true,
    reviewRisk: "The return should feel connected, not like a scene cut.",
  },
  {
    id: "documentHighlightResolve",
    label: "Document Highlight Resolve",
    frameRange: [58, 78],
    purpose: "Resolve the selected phrase with an inline document highlight.",
    reusable: true,
    reviewRisk: "Final phrase capacity is intentionally short.",
  },
  {
    id: "compactLabelSettle",
    label: "Compact Label Settle",
    frameRange: [64, 78],
    purpose: "Settle a compact feature label after the semantic change.",
    reusable: true,
    reviewRisk: "Label should not compete with the final selected text.",
  },
];

export const shot115AtomicMotionIds = shot115AtomicMotions.map((motion) => motion.id);

export const shot115MotionPackageStatus = {
  shotId: "shot_115",
  libraryId: "theme-switch-document-cards",
  choreographyId: "themeSwitchDocumentCards",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
