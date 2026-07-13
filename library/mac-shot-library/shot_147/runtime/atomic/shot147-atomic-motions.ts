export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot147AtomicMotions: AtomicMotion[] = [
  {
    id: "quadGridBuild",
    label: "Quad Grid Build",
    frameRange: [0, 32],
    purpose: "Resolve the four main quadrants in a clean staggered entrance.",
    reusable: true,
    reviewRisk: "Uneven timing can make the grid feel unstable.",
  },
  {
    id: "panelImageLift",
    label: "Panel Image Lift",
    frameRange: [10, 56],
    purpose: "Give each panel its own slight independent vertical life.",
    reusable: true,
    reviewRisk: "Motion should not break the panel framing.",
  },
  {
    id: "gridDepthTilt",
    label: "Grid Depth Tilt",
    frameRange: [0, 64],
    purpose: "Add a restrained camera-like tilt so the gallery feels dimensional.",
    reusable: true,
    reviewRisk: "Over-tilt quickly becomes gimmicky.",
  },
  {
    id: "panelCrossFadeSwap",
    label: "Panel Cross Fade Swap",
    frameRange: [34, 78],
    purpose: "Shift attention across quadrants without changing the overall layout grammar.",
    reusable: true,
    reviewRisk: "Too much opacity play can feel like slideshow behavior.",
  },
  {
    id: "quadrantHold",
    label: "Quadrant Hold",
    frameRange: [78, 96],
    purpose: "Hold the completed gallery for quick scanability.",
    reusable: true,
    reviewRisk: "Final frame must remain clean and aligned.",
  },
];

export const shot147AtomicMotionIds = shot147AtomicMotions.map((motion) => motion.id);

export const shot147MotionPackageStatus = {
  shotId: "shot_147",
  libraryId: "quadrant-gallery-grid-reveal",
  choreographyId: "quadrantGalleryGridReveal",
  sceneType: "appGrid",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
