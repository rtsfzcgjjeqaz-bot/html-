export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot150AtomicMotions: AtomicMotion[] = [
  {
    id: "commandBarReveal",
    label: "Command Bar Reveal",
    frameRange: [0, 42],
    purpose: "Bring the main prompt bar onto the stage as the primary interaction surface.",
    reusable: true,
    reviewRisk: "Field proportions must stay elegant and centered.",
  },
  {
    id: "caretPulse",
    label: "Caret Pulse",
    frameRange: [24, 78],
    purpose: "Suggest active typing with a restrained caret-driven pulse.",
    reusable: true,
    reviewRisk: "Pulse cannot become distracting flicker.",
  },
  {
    id: "iconSnapSequence",
    label: "Icon Snap Sequence",
    frameRange: [28, 86],
    purpose: "Resolve inline tools and controls in a readable left-to-right sequence.",
    reusable: true,
    reviewRisk: "Too many tools will overcrowd the field.",
  },
  {
    id: "macroSurfaceDrift",
    label: "Macro Surface Drift",
    frameRange: [0, 108],
    purpose: "Give the whole surface a slow macro drift for dimensional polish.",
    reusable: true,
    reviewRisk: "Drift must stay subtle or it stops feeling like UI.",
  },
  {
    id: "inputHold",
    label: "Input Hold",
    frameRange: [108, 150],
    purpose: "Hold the completed prompt state so the interaction reads clearly.",
    reusable: true,
    reviewRisk: "No late movement should blur the copy hierarchy.",
  },
];

export const shot150AtomicMotionIds = shot150AtomicMotions.map((motion) => motion.id);

export const shot150MotionPackageStatus = {
  shotId: "shot_150",
  libraryId: "prompt-command-bar-macro",
  choreographyId: "promptCommandBarMacro",
  sceneType: "searchDemo",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
