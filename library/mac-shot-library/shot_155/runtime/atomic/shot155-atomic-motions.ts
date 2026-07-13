export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot155AtomicMotions: AtomicMotion[] = [
  {
    id: "ambientFieldBloom",
    label: "Ambient Field Bloom",
    frameRange: [0, 18],
    purpose: "Wake the dark stage with premium depth and controlled color energy.",
    reusable: true,
    reviewRisk: "Ambient light must support hierarchy instead of washing the frame.",
  },
  {
    id: "geminiNodeOrbitIn",
    label: "Gemini Node Orbit In",
    frameRange: [4, 34],
    purpose: "Bring four colored nodes inward on purposeful arcs.",
    reusable: true,
    reviewRisk: "Node motion must feel intentional and synchronized, not floaty.",
  },
  {
    id: "logoMorphResolve",
    label: "Logo Morph Resolve",
    frameRange: [20, 48],
    purpose: "Resolve the moving nodes into a centered launch mark.",
    reusable: true,
    reviewRisk: "Morph timing cannot smear the mark silhouette.",
  },
  {
    id: "hookCopyReveal",
    label: "Hook Copy Reveal",
    frameRange: [30, 60],
    purpose: "Introduce compact copy after the mark is readable.",
    reusable: true,
    reviewRisk: "Copy cannot compete with the primary mark.",
  },
  {
    id: "surfaceSettle",
    label: "Surface Settle",
    frameRange: [48, 70],
    purpose: "Ease the hero surface into a calm final composition.",
    reusable: true,
    reviewRisk: "Settle should feel premium, not sluggish.",
  },
  {
    id: "hookHold",
    label: "Hook Hold",
    frameRange: [70, 82],
    purpose: "Hold the launch hook for quick recognition and scanability.",
    reusable: true,
    reviewRisk: "Residual motion must stay subtle during hold.",
  },
];

export const shot155AtomicMotionIds = shot155AtomicMotions.map((motion) => motion.id);

export const shot155MotionPackageStatus = {
  shotId: "shot_155",
  libraryId: "google-gemini-morph-hook",
  choreographyId: "googleGeminiMorphHook",
  sceneType: "coverHook",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
