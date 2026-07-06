export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot134AtomicMotions: AtomicMotion[] = [
  { id: "centralLabelReveal", label: "Central Label Reveal", frameRange: [0, 28], purpose: "Reveal the core multi-language claim.", reusable: true, reviewRisk: "Label must fit in one short line." },
  { id: "localizedCardFanout", label: "Localized Card Fanout", frameRange: [18, 66], purpose: "Fan localized output cards from a central source.", reusable: true, reviewRisk: "Too many cards can clutter the composition." },
  { id: "cardOrbitSettle", label: "Card Orbit Settle", frameRange: [36, 82], purpose: "Settle cards into a readable constellation.", reusable: true, reviewRisk: "Orbit should not look random or decorative." },
  { id: "languagePillBuild", label: "Language Pill Build", frameRange: [54, 92], purpose: "Resolve short language/variant labels.", reusable: true, reviewRisk: "Language labels need strict capacity." },
  { id: "outputMultiplicityHold", label: "Output Multiplicity Hold", frameRange: [90, 105], purpose: "Hold final proof of multiple localized outputs.", reusable: true, reviewRisk: "No late card drift." },
];

export const shot134AtomicMotionIds = shot134AtomicMotions.map((motion) => motion.id);

export const shot134MotionPackageStatus = {
  shotId: "shot_134",
  libraryId: "multi-language-card-fanout",
  choreographyId: "multiLanguageCardFanout",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
