export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot156AtomicMotions: AtomicMotion[] = [
  {
    id: "darkStageReveal",
    label: "Dark Stage Reveal",
    frameRange: [0, 20],
    purpose: "Establish the dark multimodal product stage.",
    reusable: true,
    reviewRisk: "Background texture cannot overpower the UI hierarchy.",
  },
  {
    id: "commandBarLift",
    label: "Command Bar Lift",
    frameRange: [8, 34],
    purpose: "Bring the main prompt bar into readable focus.",
    reusable: true,
    reviewRisk: "Prompt bar proportions must stay elegant and centered.",
  },
  {
    id: "modalityChipResolve",
    label: "Modality Chip Resolve",
    frameRange: [14, 46],
    purpose: "Resolve the multimodal chips and controls around the bar.",
    reusable: true,
    reviewRisk: "Chip count cannot create clutter in narrow layouts.",
  },
  {
    id: "brandStarBridge",
    label: "Brand Star Bridge",
    frameRange: [40, 62],
    purpose: "Use a compact brand accent to bridge prompt into result.",
    reusable: true,
    reviewRisk: "Bridge must stay semantic, not decorative filler.",
  },
  {
    id: "resultOverviewSwap",
    label: "Result Overview Swap",
    frameRange: [56, 96],
    purpose: "Transition into a light answer overview and result layout.",
    reusable: true,
    reviewRisk: "Swap must feel continuous rather than like a hard cut.",
  },
  {
    id: "overviewHold",
    label: "Overview Hold",
    frameRange: [96, 117],
    purpose: "Hold the result state with subtle residual motion.",
    reusable: true,
    reviewRisk: "Late drift cannot blur the answer structure.",
  },
];

export const shot156AtomicMotionIds = shot156AtomicMotions.map((motion) => motion.id);

export const shot156MotionPackageStatus = {
  shotId: "shot_156",
  libraryId: "multimodal-prompt-explore-bar",
  choreographyId: "multimodalPromptExploreBar",
  sceneType: "searchDemo",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
