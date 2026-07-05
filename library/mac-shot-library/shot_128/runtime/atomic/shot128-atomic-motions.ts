export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot128AtomicMotions: AtomicMotion[] = [
  { id: "promiseWordsReveal", label: "Promise Words Reveal", frameRange: [0, 34], purpose: "Reveal compact promise phrases around the product object.", reusable: true, reviewRisk: "Phrases must stay short." },
  { id: "fileCardPop", label: "File Card Pop", frameRange: [18, 48], purpose: "Pop a blue file or audio card into focus.", reusable: true, reviewRisk: "Card should imply input, not random tile." },
  { id: "modeIconStack", label: "Mode Icon Stack", frameRange: [28, 58], purpose: "Create depth with stacked document/audio icons.", reusable: true, reviewRisk: "Too many icons clutter the minimal stage." },
  { id: "cursorNudge", label: "Cursor Nudge", frameRange: [44, 70], purpose: "Suggest drag/drop interaction with a small pointer hint.", reusable: true, reviewRisk: "Do not over-animate cursor." },
  { id: "dropSurfaceRise", label: "Drop Surface Rise", frameRange: [56, 86], purpose: "Raise the upload surface beneath the card.", reusable: true, reviewRisk: "Surface must not wash out on white." },
  { id: "softTransformHold", label: "Soft Transform Hold", frameRange: [78, 87], purpose: "Hold the transformed input state.", reusable: true, reviewRisk: "No late jitter." },
];

export const shot128AtomicMotionIds = shot128AtomicMotions.map((motion) => motion.id);

export const shot128MotionPackageStatus = {
  shotId: "shot_128",
  libraryId: "book-audio-drop-transform",
  choreographyId: "bookAudioDropTransform",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
