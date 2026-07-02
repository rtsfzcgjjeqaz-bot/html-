export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot113AtomicMotions: AtomicMotion[] = [
  {
    id: "inboxSurfaceSettle",
    label: "Inbox Surface Settle",
    frameRange: [0, 30],
    purpose: "Bring a structured intake workspace into view with a mild push and settle.",
    reusable: true,
    reviewRisk: "Perspective must not crop the attachment card.",
  },
  {
    id: "attachmentCardFocus",
    label: "Attachment Card Focus",
    frameRange: [18, 54],
    purpose: "Lift the selected file card above surrounding rows.",
    reusable: true,
    reviewRisk: "The file card must remain semantically readable.",
  },
  {
    id: "cursorSelectionTap",
    label: "Cursor Selection Tap",
    frameRange: [34, 66],
    purpose: "Use cursor movement and a tap pulse to confirm the selected object.",
    reusable: true,
    reviewRisk: "Cursor should target a button or attachment, not empty space.",
  },
  {
    id: "filenameUnderlineGlow",
    label: "Filename Underline Glow",
    frameRange: [48, 78],
    purpose: "Animate a left-to-right underline under the file name to show parsing.",
    reusable: true,
    reviewRisk: "Glow should not obscure the filename.",
  },
  {
    id: "aiExtractionPanelReveal",
    label: "AI Extraction Panel Reveal",
    frameRange: [62, 93],
    purpose: "Reveal compact extracted fields after selection.",
    reusable: true,
    reviewRisk: "Panel copy capacity is limited to concise labels.",
  },
];

export const shot113AtomicMotionIds = shot113AtomicMotions.map((motion) => motion.id);

export const shot113MotionPackageStatus = {
  shotId: "shot_113",
  libraryId: "attachment-capture-focus",
  choreographyId: "attachmentCaptureFocus",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
