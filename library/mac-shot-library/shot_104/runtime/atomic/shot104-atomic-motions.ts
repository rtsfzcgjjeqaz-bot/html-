export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot104AtomicMotions: AtomicMotion[] = [
  {
    id: "darkStageWake",
    label: "Dark Stage Wake",
    frameRange: [0, 18],
    purpose: "Introduce a premium black stage with a controlled blue glow seed.",
    reusable: true,
    reviewRisk: "The frame should not stay visually empty for too long.",
  },
  {
    id: "lightStemGrow",
    label: "Light Stem Grow",
    frameRange: [8, 46],
    purpose: "Grow a vertical luminous line as the main hook gesture.",
    reusable: true,
    reviewRisk: "The stroke must remain visible on compressed previews.",
  },
  {
    id: "anchorDotPop",
    label: "Anchor Dot Pop",
    frameRange: [28, 58],
    purpose: "Place white anchor dots on the growing line.",
    reusable: true,
    reviewRisk: "Dots should align to the stem and not look random.",
  },
  {
    id: "curvedOrbitTrace",
    label: "Curved Orbit Trace",
    frameRange: [34, 76],
    purpose: "Draw a thin orbit curve around the central line.",
    reusable: true,
    reviewRisk: "Orbit line should support the hook, not clutter it.",
  },
  {
    id: "hookTextFade",
    label: "Hook Text Fade",
    frameRange: [52, 96],
    purpose: "Resolve a short cover phrase above the luminous gesture.",
    reusable: true,
    reviewRisk: "Text capacity is intentionally low.",
  },
];

export const shot104AtomicMotionIds = shot104AtomicMotions.map((motion) => motion.id);

export const shot104MotionPackageStatus = {
  shotId: "shot_104",
  libraryId: "luminous-line-begin-hook",
  choreographyId: "luminousLineBeginHook",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
