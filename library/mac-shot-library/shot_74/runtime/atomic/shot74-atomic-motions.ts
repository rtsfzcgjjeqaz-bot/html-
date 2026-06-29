export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot74AtomicMotions = [
  {
    id: "white-stage-resolve",
    purpose: "Establish a clean white final-card stage.",
    timingFrames: [0, 10],
    properties: { opacity: [0, 1] },
    reviewRisk: "Opening must not flash or feel like a blank missing frame.",
  },
  {
    id: "brand-mark-center-rise",
    purpose: "Bring the brand mark to center with a small scale settle.",
    timingFrames: [4, 30],
    properties: { opacity: [0, 1], translateY: [10, 0], scale: [0.9, 1] },
    reviewRisk: "Logo must remain crisp and centered.",
  },
  {
    id: "brand-color-crisp-settle",
    purpose: "Let the brand mark finish with a subtle clarity shift.",
    timingFrames: [18, 42],
    properties: { filter: ["saturate(0.94)", "saturate(1)"], scale: [1.015, 1] },
    reviewRisk: "Settle should be nearly invisible, not a bounce.",
  },
  {
    id: "cta-text-fade-up",
    purpose: "Reveal the final CTA text below the logo.",
    timingFrames: [22, 46],
    properties: { opacity: [0, 1], translateY: [8, 0] },
    reviewRisk: "CTA must be readable and not too far from the logo.",
  },
  {
    id: "final-card-hold",
    purpose: "Hold the completed end card for recognition.",
    timingFrames: [46, 64],
    properties: { scale: [1.002, 1] },
    reviewRisk: "End frame must be stable, not drifting.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot74AtomicMotionIds = shot74AtomicMotions.map((motion) => motion.id);

export const shot74AtomicMotionPackage = {
  shotId: "shot_74",
  libraryId: "clean-brand-final-cta",
  choreographyId: "cleanBrandFinalCta",
  sceneType: "finalCTA",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;
