export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot154AtomicMotions: AtomicMotion[] = [
  {
    id: "laneGridReveal",
    label: "Lane Grid Reveal",
    frameRange: [0, 26],
    purpose: "Establish the bright workflow stage and lane layout.",
    reusable: true,
    reviewRisk: "The stage must not feel empty before the cards arrive.",
  },
  {
    id: "contentCardCascade",
    label: "Content Card Cascade",
    frameRange: [10, 70],
    purpose: "Populate multiple content cards across the lanes.",
    reusable: true,
    reviewRisk: "Card count must stay readable at preview scale.",
  },
  {
    id: "actionRailFocus",
    label: "Action Rail Focus",
    frameRange: [42, 90],
    purpose: "Elevate the action rail as the main control touchpoint.",
    reusable: true,
    reviewRisk: "The rail cannot fight with the surrounding cards.",
  },
  {
    id: "pointerSweep",
    label: "Pointer Sweep",
    frameRange: [60, 118],
    purpose: "Drive the workflow direction with a clean pointer sweep.",
    reusable: true,
    reviewRisk: "Pointer motion must stay smooth and semantic.",
  },
  {
    id: "contentArcConverge",
    label: "Content Arc Converge",
    frameRange: [104, 148],
    purpose: "Sweep smaller content tiles into the right-side destination arc.",
    reusable: true,
    reviewRisk: "Convergence cannot become a chaotic particle effect.",
  },
  {
    id: "builderHold",
    label: "Builder Hold",
    frameRange: [148, 173],
    purpose: "Hold the final builder state and closing text.",
    reusable: true,
    reviewRisk: "Late motion must not blur the title lockup.",
  },
];

export const shot154AtomicMotionIds = shot154AtomicMotions.map((motion) => motion.id);

export const shot154MotionPackageStatus = {
  shotId: "shot_154",
  libraryId: "content-lane-workflow-sweep",
  choreographyId: "contentLaneWorkflowSweep",
  sceneType: "stepFlow",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
