export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot129AtomicMotions: AtomicMotion[] = [
  { id: "dropZoneSettle", label: "Drop Zone Settle", frameRange: [0, 24], purpose: "Settle an uploaded input into a drop surface.", reusable: true, reviewRisk: "Card must remain visually connected to the surface." },
  { id: "instructionCopyReveal", label: "Instruction Copy Reveal", frameRange: [18, 46], purpose: "Reveal concise workflow instruction copy.", reusable: true, reviewRisk: "Copy must remain short." },
  { id: "diagonalSurfaceSweep", label: "Diagonal Surface Sweep", frameRange: [32, 78], purpose: "Sweep tilted device/document surfaces through frame.", reusable: true, reviewRisk: "Surfaces can become visually noisy." },
  { id: "inputModeLabelBuild", label: "Input Mode Label Build", frameRange: [48, 88], purpose: "Build supported input mode labels.", reusable: true, reviewRisk: "Avoid more than three labels." },
  { id: "progressRailGlow", label: "Progress Rail Glow", frameRange: [58, 102], purpose: "Show processing through a blue progress rail.", reusable: true, reviewRisk: "Rail must not become decorative-only." },
  { id: "flowHold", label: "Flow Hold", frameRange: [92, 102], purpose: "Hold the processed input state.", reusable: true, reviewRisk: "No late clutter." },
];

export const shot129AtomicMotionIds = shot129AtomicMotions.map((motion) => motion.id);

export const shot129MotionPackageStatus = {
  shotId: "shot_129",
  libraryId: "language-processing-progress-rail",
  choreographyId: "languageProcessingProgressRail",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
