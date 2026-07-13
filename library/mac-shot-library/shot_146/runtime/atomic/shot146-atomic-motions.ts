export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot146AtomicMotions: AtomicMotion[] = [
  {
    id: "darkStageGlow",
    label: "Dark Stage Glow",
    frameRange: [0, 36],
    purpose: "Establish the dark premium hero stage with restrained depth light.",
    reusable: true,
    reviewRisk: "Glow cannot wash out the wordmark.",
  },
  {
    id: "heroWordAssemble",
    label: "Hero Word Assemble",
    frameRange: [10, 58],
    purpose: "Resolve the central hero word with a controlled scale and opacity build.",
    reusable: true,
    reviewRisk: "Wordmark must remain short and centered.",
  },
  {
    id: "moduleOrbitParallax",
    label: "Module Orbit Parallax",
    frameRange: [0, 92],
    purpose: "Bring surrounding product modules into layered depth around the hero.",
    reusable: true,
    reviewRisk: "Cards must stay inside safe area and avoid visual clutter.",
  },
  {
    id: "cursorAccentSweep",
    label: "Cursor Accent Sweep",
    frameRange: [46, 96],
    purpose: "Add one interaction cue that guides attention toward the active module.",
    reusable: true,
    reviewRisk: "Cursor motion should feel intentional, not gimmicky.",
  },
  {
    id: "heroHold",
    label: "Hero Hold",
    frameRange: [96, 132],
    purpose: "Hold the final premium hero state for review and readability.",
    reusable: true,
    reviewRisk: "Late drift should be minimal.",
  },
];

export const shot146AtomicMotionIds = shot146AtomicMotions.map((motion) => motion.id);

export const shot146MotionPackageStatus = {
  shotId: "shot_146",
  libraryId: "dark-wordmark-orbit-hero",
  choreographyId: "darkWordmarkOrbitHero",
  sceneType: "websiteHero",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
