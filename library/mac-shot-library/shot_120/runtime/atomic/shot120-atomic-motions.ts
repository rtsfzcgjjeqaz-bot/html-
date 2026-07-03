export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot120AtomicMotions: AtomicMotion[] = [
  { id: "darkBackdropBloom", label: "Dark Backdrop Bloom", frameRange: [0, 28], purpose: "Open a deep AI-product background with subtle color bloom.", reusable: true, reviewRisk: "Keep the bloom restrained and non-decorative." },
  { id: "productPanelParallax", label: "Product Panel Parallax", frameRange: [8, 58], purpose: "Bring product UI panels into different depth layers.", reusable: true, reviewRisk: "Panels must remain within safe area." },
  { id: "appMarkPulse", label: "App Mark Pulse", frameRange: [20, 48], purpose: "Resolve a compact generic app mark as visual anchor.", reusable: true, reviewRisk: "Do not imply a real brand unless provided." },
  { id: "headlineReveal", label: "Headline Reveal", frameRange: [32, 74], purpose: "Reveal the short cover headline.", reusable: true, reviewRisk: "Headline capacity is short." },
  { id: "assistChipSweep", label: "Assist Chip Sweep", frameRange: [46, 86], purpose: "Sweep compact action chips through the hero surface.", reusable: true, reviewRisk: "Chips should imply actions, not random labels." },
  { id: "hookSettle", label: "Hook Settle", frameRange: [82, 98], purpose: "Settle all layers into a reusable cover hook state.", reusable: true, reviewRisk: "Final frame must be readable." },
];

export const shot120AtomicMotionIds = shot120AtomicMotions.map((motion) => motion.id);

export const shot120MotionPackageStatus = {
  shotId: "shot_120",
  libraryId: "dark-google-ai-business-hook",
  choreographyId: "darkGoogleAiBusinessHook",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
