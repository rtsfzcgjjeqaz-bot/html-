export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot135AtomicMotions: AtomicMotion[] = [
  { id: "actionWordSequence", label: "Action Word Sequence", frameRange: [0, 58], purpose: "Reveal short final CTA words in sequence.", reusable: true, reviewRisk: "Each word must remain short." },
  { id: "finalMarkBloom", label: "Final Mark Bloom", frameRange: [38, 78], purpose: "Bloom a small final mark after the action words.", reusable: true, reviewRisk: "Mark must not overpower the CTA copy." },
  { id: "softSparkAccent", label: "Soft Spark Accent", frameRange: [52, 88], purpose: "Add restrained finish accents near the mark.", reusable: true, reviewRisk: "Accents must not become decorative clutter." },
  { id: "ctaHold", label: "CTA Hold", frameRange: [82, 106], purpose: "Hold the final CTA state.", reusable: true, reviewRisk: "No black fade or late word drift." },
];

export const shot135AtomicMotionIds = shot135AtomicMotions.map((motion) => motion.id);

export const shot135MotionPackageStatus = {
  shotId: "shot_135",
  libraryId: "translate-dub-distribute-final-cta",
  choreographyId: "translateDubDistributeFinalCta",
  sceneType: "finalCTA",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
