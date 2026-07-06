export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot133AtomicMotions: AtomicMotion[] = [
  { id: "selectedChipDock", label: "Selected Chip Dock", frameRange: [0, 34], purpose: "Compress selected content into an action-ready chip.", reusable: true, reviewRisk: "Chip must preserve selection meaning." },
  { id: "actionBarSlideUp", label: "Action Bar Slide Up", frameRange: [18, 48], purpose: "Reveal a bottom action bar as the next workflow step.", reusable: true, reviewRisk: "Bar should not cover key context." },
  { id: "ctaButtonPulse", label: "CTA Button Pulse", frameRange: [38, 70], purpose: "Emphasize the primary action button.", reusable: true, reviewRisk: "Pulse must not feel like a banner ad." },
  { id: "distributionStatusSweep", label: "Distribution Status Sweep", frameRange: [52, 88], purpose: "Show status progression across an action rail.", reusable: true, reviewRisk: "Sweep must represent progress, not decoration." },
  { id: "platformPillResolve", label: "Platform Pill Resolve", frameRange: [62, 96], purpose: "Resolve configurable target/action pills.", reusable: true, reviewRisk: "Target labels need short capacity." },
  { id: "actionHold", label: "Action Hold", frameRange: [92, 102], purpose: "Hold the final action-ready state.", reusable: true, reviewRisk: "Avoid late pulse loops." },
];

export const shot133AtomicMotionIds = shot133AtomicMotions.map((motion) => motion.id);

export const shot133MotionPackageStatus = {
  shotId: "shot_133",
  libraryId: "distribution-action-bar-flow",
  choreographyId: "distributionActionBarFlow",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
