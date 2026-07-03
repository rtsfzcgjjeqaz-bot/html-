export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot127AtomicMotions: AtomicMotion[] = [
  { id: "paleStageWake", label: "Pale Stage Wake", frameRange: [0, 14], purpose: "Resolve a bright cover stage without a blank flash.", reusable: true, reviewRisk: "Keep enough contrast for text." },
  { id: "brandGhostMark", label: "Brand Ghost Mark", frameRange: [0, 24], purpose: "Show a tiny low-contrast brand or product mark.", reusable: true, reviewRisk: "Do not make brand text the only context." },
  { id: "kineticVerbFlash", label: "Kinetic Verb Flash", frameRange: [8, 32], purpose: "Flash the action verb into the center.", reusable: true, reviewRisk: "Short verb only." },
  { id: "inputModeWordSwap", label: "Input Mode Word Swap", frameRange: [18, 56], purpose: "Swap compact input-mode words.", reusable: true, reviewRisk: "Long nouns will overflow the minimal layout." },
  { id: "blueEmphasisPulse", label: "Blue Emphasis Pulse", frameRange: [28, 58], purpose: "Tint the active word with soft blue emphasis.", reusable: true, reviewRisk: "Avoid low contrast on pale background." },
  { id: "softHookHold", label: "Soft Hook Hold", frameRange: [54, 66], purpose: "Hold the final word for reading.", reusable: true, reviewRisk: "No late jitter on final text." },
];

export const shot127AtomicMotionIds = shot127AtomicMotions.map((motion) => motion.id);

export const shot127MotionPackageStatus = {
  shotId: "shot_127",
  libraryId: "langease-kinetic-text-hook",
  choreographyId: "langeaseKineticTextHook",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
