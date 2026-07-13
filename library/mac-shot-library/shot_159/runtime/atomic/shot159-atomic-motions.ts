export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot159AtomicMotions: AtomicMotion[] = [
  {
    id: "contextSurfaceReveal",
    label: "Context Surface Reveal",
    frameRange: [0, 28],
    purpose: "Establish the source communication surface before the AI output appears.",
    reusable: true,
    reviewRisk: "Context panel must stay calm and readable.",
  },
  {
    id: "sourceContextDock",
    label: "Source Context Dock",
    frameRange: [12, 48],
    purpose: "Dock the source content into a stable, reviewable state.",
    reusable: true,
    reviewRisk: "Source copy cannot become noisy background texture.",
  },
  {
    id: "assistChipResolve",
    label: "Assist Chip Resolve",
    frameRange: [40, 76],
    purpose: "Introduce the assistant action choices with clear intent cues.",
    reusable: true,
    reviewRisk: "Chip cluster must stay compact and semantic.",
  },
  {
    id: "summaryCardLift",
    label: "Summary Card Lift",
    frameRange: [58, 108],
    purpose: "Lift the main AI recommendation panel into visual priority.",
    reusable: true,
    reviewRisk: "Panel transition must feel connected to the source context.",
  },
  {
    id: "insightRowsCascade",
    label: "Insight Rows Cascade",
    frameRange: [92, 154],
    purpose: "Reveal recommendation details and action rows in sequence.",
    reusable: true,
    reviewRisk: "Too many rows can make the output feel dense.",
  },
  {
    id: "explanationHold",
    label: "Explanation Hold",
    frameRange: [154, 180],
    purpose: "Hold the final assist state for scanability.",
    reusable: true,
    reviewRisk: "Residual motion must remain subtle during hold.",
  },
];

export const shot159AtomicMotionIds = shot159AtomicMotions.map((motion) => motion.id);

export const shot159MotionPackageStatus = {
  shotId: "shot_159",
  libraryId: "email-context-assist-panel",
  choreographyId: "emailContextAssistPanel",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
