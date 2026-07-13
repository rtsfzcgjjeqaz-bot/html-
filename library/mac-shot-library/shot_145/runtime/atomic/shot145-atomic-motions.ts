export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot145AtomicMotions: AtomicMotion[] = [
  {
    id: "tileWallCascadeIn",
    label: "Tile Wall Cascade In",
    frameRange: [0, 44],
    purpose: "Bring the product-tile mosaic onto the stage in a staggered cascade.",
    reusable: true,
    reviewRisk: "Too many simultaneous entries can feel noisy.",
  },
  {
    id: "badgeHoverParallax",
    label: "Badge Hover Parallax",
    frameRange: [12, 72],
    purpose: "Add shallow depth differences so the wall feels layered instead of flat.",
    reusable: true,
    reviewRisk: "Depth drift must stay subtle and inside safe area.",
  },
  {
    id: "headlineZoneGlow",
    label: "Headline Zone Glow",
    frameRange: [18, 62],
    purpose: "Resolve a small focal zone that gives the collage a visual center.",
    reusable: true,
    reviewRisk: "Glow should not overpower the surrounding cards.",
  },
  {
    id: "collageSettle",
    label: "Collage Settle",
    frameRange: [40, 86],
    purpose: "Let the full wall settle into a composed cover frame.",
    reusable: true,
    reviewRisk: "Late-stage motion should feel calm, not jittery.",
  },
  {
    id: "hookHold",
    label: "Hook Hold",
    frameRange: [86, 108],
    purpose: "Hold the cover hook briefly for scanability.",
    reusable: true,
    reviewRisk: "No card should drift into a text zone during hold.",
  },
];

export const shot145AtomicMotionIds = shot145AtomicMotions.map((motion) => motion.id);

export const shot145MotionPackageStatus = {
  shotId: "shot_145",
  libraryId: "discovery-tile-wall-hook",
  choreographyId: "discoveryTileWallHook",
  sceneType: "coverHook",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
