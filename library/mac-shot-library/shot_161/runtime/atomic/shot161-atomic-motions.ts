export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot161AtomicMotions: AtomicMotion[] = [
  {
    id: "phoneFrameLift",
    label: "Phone Frame Lift",
    frameRange: [0, 24],
    purpose: "Establish the mobile product surface as the centered stage.",
    reusable: true,
    reviewRisk: "The device must not enter from outside the video safe area.",
  },
  {
    id: "photoGridPopulate",
    label: "Photo Grid Populate",
    frameRange: [12, 52],
    purpose: "Resolve meaningful media tiles with a compact row cascade.",
    reusable: true,
    reviewRisk: "Tile motion must remain coherent and avoid a random mosaic feel.",
  },
  {
    id: "bottomRailResolve",
    label: "Bottom Rail Resolve",
    frameRange: [38, 64],
    purpose: "Connect navigation and the Ask action to the content grid.",
    reusable: true,
    reviewRisk: "The rail cannot cover the last media row.",
  },
  {
    id: "askActionFocus",
    label: "Ask Action Focus",
    frameRange: [54, 74],
    purpose: "Give the AI action one restrained semantic emphasis.",
    reusable: true,
    reviewRisk: "Avoid repeated pulsing or decorative glow noise.",
  },
  {
    id: "gridHold",
    label: "Grid Hold",
    frameRange: [70, 90],
    purpose: "Settle the completed app state for quick scanning.",
    reusable: true,
    reviewRisk: "Residual camera motion must remain subtle.",
  },
];

export const shot161AtomicMotionIds = shot161AtomicMotions.map((motion) => motion.id);

export const shot161MotionPackageStatus = {
  shotId: "shot_161",
  libraryId: "mobile-memories-ask-grid",
  choreographyId: "mobileMemoriesAskGrid",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
