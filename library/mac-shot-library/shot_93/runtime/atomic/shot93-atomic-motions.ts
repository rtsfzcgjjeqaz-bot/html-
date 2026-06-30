export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot93AtomicMotions: AtomicMotion[] = [
  { id: "painHeadlineResolve", label: "Pain Headline Resolve", frameRange: [0, 18], purpose: "Reveal the benefit/pain removal headline.", reusable: true, reviewRisk: "Headline must remain short and readable." },
  { id: "documentStackRise", label: "Document Stack Rise", frameRange: [8, 32], purpose: "Show the old form burden as a document stack.", reusable: true, reviewRisk: "Document shape should remain semantic." },
  { id: "subcopyReveal", label: "Subcopy Reveal", frameRange: [18, 38], purpose: "Add supporting explanation under the stack.", reusable: true, reviewRisk: "Small copy should be optional." },
  { id: "documentBurdenRecede", label: "Document Burden Recede", frameRange: [38, 64], purpose: "Let the old forms recede so the benefit takes over.", reusable: true, reviewRisk: "Recede should not look like a broken fade." },
  { id: "benefitHold", label: "Benefit Hold", frameRange: [60, 75], purpose: "Hold the benefit headline for readability.", reusable: true, reviewRisk: "No extra motion should distract." },
];

export const shot93AtomicMotionIds = shot93AtomicMotions.map((motion) => motion.id);

export const shot93MotionPackageStatus = {
  shotId: "shot_93",
  libraryId: "no-more-forms-document-stack",
  choreographyId: "noMoreFormsDocumentStack",
  sceneType: "resultComparison",
  visualApproved: false,
  implementationVerified: false,
  approved: false,
  allowedInFactory: false,
} as const;
