export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot125AtomicMotions: AtomicMotion[] = [
  { id: "phoneResultFrame", label: "Phone Result Frame", frameRange: [0, 20], purpose: "Slide a phone result surface into a readable crop.", reusable: true, reviewRisk: "Phone should not hide the proof bubble." },
  { id: "colorBandSweep", label: "Color Band Sweep", frameRange: [10, 38], purpose: "Sweep a soft semantic band behind the result.", reusable: true, reviewRisk: "Band must not feel like random decoration." },
  { id: "messageBubbleResolve", label: "Message Bubble Resolve", frameRange: [18, 46], purpose: "Resolve avatar and message proof bubble.", reusable: true, reviewRisk: "Message copy must remain compact." },
  { id: "capabilityCopyMorph", label: "Capability Copy Morph", frameRange: [24, 52], purpose: "Morph from need language into a capability claim.", reusable: true, reviewRisk: "Avoid long two-line headline overflow." },
  { id: "emphasisWordTint", label: "Emphasis Word Tint", frameRange: [40, 60], purpose: "Tint the final word to anchor the feature benefit.", reusable: true, reviewRisk: "Color emphasis should not reduce contrast." },
  { id: "softResultHold", label: "Soft Result Hold", frameRange: [54, 63], purpose: "Hold the resolved result state.", reusable: true, reviewRisk: "No late motion during read time." },
];

export const shot125AtomicMotionIds = shot125AtomicMotions.map((motion) => motion.id);

export const shot125MotionPackageStatus = {
  shotId: "shot_125",
  libraryId: "need-not-copy-morph",
  choreographyId: "needNotCopyMorph",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
