export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot114AtomicMotions: AtomicMotion[] = [
  {
    id: "documentCanvasDrift",
    label: "Document Canvas Drift",
    frameRange: [0, 24],
    purpose: "Set a document surface into a shallow angled reading position.",
    reusable: true,
    reviewRisk: "Document text should support the action without becoming the whole shot.",
  },
  {
    id: "textSelectionSweep",
    label: "Text Selection Sweep",
    frameRange: [12, 38],
    purpose: "Sweep a semantic text highlight across the target phrase.",
    reusable: true,
    reviewRisk: "Highlight must not cover too much text or feel arbitrary.",
  },
  {
    id: "editorPopoverSnap",
    label: "Editor Popover Snap",
    frameRange: [24, 52],
    purpose: "Open a compact action panel tied to the selected phrase.",
    reusable: true,
    reviewRisk: "Popover must stay anchored to the selected text.",
  },
  {
    id: "cursorActionNudge",
    label: "Cursor Action Nudge",
    frameRange: [34, 58],
    purpose: "Nudge a cursor toward the Editor action to confirm intent.",
    reusable: true,
    reviewRisk: "Cursor target must be semantic, not empty space.",
  },
  {
    id: "suggestionRibbonFan",
    label: "Suggestion Ribbon Fan",
    frameRange: [48, 78],
    purpose: "Fan multiple suggestion ribbons from the selected phrase.",
    reusable: true,
    reviewRisk: "Ribbons should remain readable and not become decorative clutter.",
  },
  {
    id: "featureLabelResolve",
    label: "Feature Label Resolve",
    frameRange: [62, 78],
    purpose: "Resolve a short feature phrase after the edit action.",
    reusable: true,
    reviewRisk: "Label capacity is intentionally short.",
  },
];

export const shot114AtomicMotionIds = shot114AtomicMotions.map((motion) => motion.id);

export const shot114MotionPackageStatus = {
  shotId: "shot_114",
  libraryId: "document-action-panel-reveal",
  choreographyId: "documentActionPanelReveal",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
