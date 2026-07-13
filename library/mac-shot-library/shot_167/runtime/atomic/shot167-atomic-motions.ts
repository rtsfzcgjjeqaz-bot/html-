export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot167AtomicMotions: AtomicMotion[] = [
  {id: "ambientStageReveal", label: "Ambient Stage Reveal", frameRange: [0, 36], purpose: "Establish a visible dark stage without a blank first frame.", reusable: true, reviewRisk: "Background contrast must stay below the hook copy."},
  {id: "kineticQuestionType", label: "Kinetic Question Type", frameRange: [4, 76], purpose: "Build the question in natural reading order.", reusable: true, reviewRisk: "Long questions need controlled wrapping and timing."},
  {id: "questionSettle", label: "Question Settle", frameRange: [76, 112], purpose: "Hold the complete question for comprehension.", reusable: true, reviewRisk: "Residual motion must not disturb reading."},
  {id: "brandMarkResolve", label: "Brand Mark Resolve", frameRange: [106, 154], purpose: "Transform the hook state into a compact product signal.", reusable: true, reviewRisk: "The mark must inherit the hook focal point."},
  {id: "brandNameLockup", label: "Brand Name Lockup", frameRange: [136, 210], purpose: "Resolve and hold the product identity.", reusable: true, reviewRisk: "Brand text must remain inside the central safe area."},
];

export const shot167AtomicMotionIds = shot167AtomicMotions.map((motion) => motion.id);

export const shot167MotionPackageStatus = {
  shotId: "shot_167",
  libraryId: "kinetic-question-brand-resolve",
  choreographyId: "kineticQuestionBrandResolve",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
