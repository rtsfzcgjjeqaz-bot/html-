export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot124AtomicMotions: AtomicMotion[] = [
  { id: "phoneTopReveal", label: "Phone Top Reveal", frameRange: [0, 22], purpose: "Reveal a cropped phone top as the response surface.", reusable: true, reviewRisk: "Crop must look intentional and readable." },
  { id: "needHeadlineExtend", label: "Need Headline Extend", frameRange: [8, 34], purpose: "Extend a communication need into a specific request.", reusable: true, reviewRisk: "Headline should stay within two lines." },
  { id: "languageSelectorSnap", label: "Language Selector Snap", frameRange: [18, 44], purpose: "Focus source and target language pills.", reusable: true, reviewRisk: "Long labels may overflow compact pills." },
  { id: "responsePanelLift", label: "Response Panel Lift", frameRange: [32, 58], purpose: "Lift an AI recommendation or answer panel into view.", reusable: true, reviewRisk: "Panel should not cover the selector." },
  { id: "translatedLineResolve", label: "Translated Line Resolve", frameRange: [44, 70], purpose: "Resolve answer lines in a clear text hierarchy.", reusable: true, reviewRisk: "Result copy must remain short." },
  { id: "softRecommendationHold", label: "Soft Recommendation Hold", frameRange: [64, 74], purpose: "Hold final recommendation state for review.", reusable: true, reviewRisk: "No late motion that disrupts reading." },
];

export const shot124AtomicMotionIds = shot124AtomicMotions.map((motion) => motion.id);

export const shot124MotionPackageStatus = {
  shotId: "shot_124",
  libraryId: "translation-ai-response-panel",
  choreographyId: "translationAiResponsePanel",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
