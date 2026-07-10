import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot144MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot144Ease = ({ frame, startFrame, endFrame }: Shot144MotionArgs) =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot144AtomicMotions: AtomicMotion[] = [
  { id: "brandMarkResolve", label: "Brand Mark Resolve", frameRange: [0, 30], purpose: "Reveal the brand symbol cleanly at center stage.", reusable: true, reviewRisk: "Symbol reveal should remain crisp." },
  { id: "taglineFadeIn", label: "Tagline Fade In", frameRange: [18, 54], purpose: "Introduce brand name and supporting line with calm sequencing.", reusable: true, reviewRisk: "Copy must remain short." },
  { id: "ctaButtonSettle", label: "CTA Button Settle", frameRange: [34, 74], purpose: "Land the primary CTA button with a soft scale and opacity settle.", reusable: true, reviewRisk: "Button should not feel like a banner ad." },
  { id: "finalHold", label: "Final Hold", frameRange: [72, 99], purpose: "Hold the end card in a clean readable state.", reusable: true, reviewRisk: "Late motion should remain almost still." },
];

export const shot144AtomicMotionIds = shot144AtomicMotions.map((motion) => motion.id);

export const shot144MotionPackageStatus = {
  shotId: "shot_144",
  libraryId: "synoptix-brand-final-cta",
  choreographyId: "synoptixBrandFinalCta",
  sceneType: "finalCTA",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

