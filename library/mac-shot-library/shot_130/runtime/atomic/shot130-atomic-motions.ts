export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot130AtomicMotions: AtomicMotion[] = [
  { id: "completionHaloBuild", label: "Completion Halo Build", frameRange: [0, 22], purpose: "Build a semantic success focus behind the result state.", reusable: true, reviewRisk: "Halo must not dominate the readable center." },
  { id: "checkCirclePop", label: "Check Circle Pop", frameRange: [8, 30], purpose: "Pop a completion check into the central focus area.", reusable: true, reviewRisk: "Overshoot should stay subtle and not cartoonish." },
  { id: "confettiBurstControlled", label: "Confetti Burst Controlled", frameRange: [16, 42], purpose: "Use restrained accent pieces to signal success.", reusable: true, reviewRisk: "Fragments must stay purposeful and sparse." },
  { id: "doneWordSettle", label: "Done Word Settle", frameRange: [24, 48], purpose: "Reveal the completion label after the check lands.", reusable: true, reviewRisk: "Completion copy should remain short." },
  { id: "resultCardFanIn", label: "Result Card Fan In", frameRange: [34, 72], purpose: "Fan generated outputs into an inspectable result row.", reusable: true, reviewRisk: "Cards should not overlap the completion label." },
  { id: "successHold", label: "Success Hold", frameRange: [70, 84], purpose: "Hold the final AI recommendation state for review.", reusable: true, reviewRisk: "No late decorative fragments." },
];

export const shot130AtomicMotionIds = shot130AtomicMotions.map((motion) => motion.id);

export const shot130MotionPackageStatus = {
  shotId: "shot_130",
  libraryId: "completion-check-confetti-reveal",
  choreographyId: "completionCheckConfettiReveal",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
