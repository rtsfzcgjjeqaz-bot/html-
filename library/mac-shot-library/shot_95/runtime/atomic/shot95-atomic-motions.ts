export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot95AtomicMotions: AtomicMotion[] = [
  { id: "brandFieldWake", label: "Brand Field Wake", frameRange: [0, 16], purpose: "Bring up the dark blue brand background without a flash.", reusable: true, reviewRisk: "Background should not overpower the logo." },
  { id: "logoLockupRise", label: "Logo Lockup Rise", frameRange: [4, 24], purpose: "Reveal the brand mark and wordmark as the primary CTA anchor.", reusable: true, reviewRisk: "Logo must remain crisp and not overshoot." },
  { id: "taglinePillReveal", label: "Tagline Pill Reveal", frameRange: [14, 36], purpose: "Open the value proposition capsule under the brand.", reusable: true, reviewRisk: "Long text can exceed capsule width." },
  { id: "signalGlintSweep", label: "Signal Glint Sweep", frameRange: [22, 44], purpose: "Create a controlled highlight pass that points to the tagline.", reusable: true, reviewRisk: "Glint must be brief and semantic." },
  { id: "websiteMicroReveal", label: "Website Micro Reveal", frameRange: [30, 48], purpose: "Reveal the destination URL as secondary information.", reusable: true, reviewRisk: "Small text can become illegible." },
  { id: "bottomCopyFade", label: "Bottom Copy Fade", frameRange: [36, 56], purpose: "Add explanatory supporting copy below the CTA.", reusable: true, reviewRisk: "Bottom copy should not compete with the logo." },
  { id: "finalBrandHold", label: "Final Brand Hold", frameRange: [56, 70], purpose: "Hold the complete CTA for recognition.", reusable: true, reviewRisk: "No extra movement should distract in the hold." },
];

export const shot95AtomicMotionIds = shot95AtomicMotions.map((motion) => motion.id);

export const shot95MotionPackageStatus = {
  shotId: "shot_95",
  libraryId: "kitaabh-brand-final-cta",
  choreographyId: "kitaabhBrandFinalCta",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
