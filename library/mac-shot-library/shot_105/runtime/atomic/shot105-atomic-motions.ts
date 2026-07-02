export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot105AtomicMotions: AtomicMotion[] = [
  { id: "glowFragmentGather", label: "Glow Fragment Gather", frameRange: [0, 34], purpose: "Gather small luminous fragments into the center stage.", reusable: true, reviewRisk: "Fragments must not look like random particles." },
  { id: "orbitalRingBuild", label: "Orbital Ring Build", frameRange: [18, 72], purpose: "Build a glowing system ring around the main phrase.", reusable: true, reviewRisk: "High glow can reduce text contrast." },
  { id: "nodeAnchorReveal", label: "Node Anchor Reveal", frameRange: [46, 88], purpose: "Reveal four white anchor nodes on the system frame.", reusable: true, reviewRisk: "Nodes must align to the ring/diamond path." },
  { id: "centerTextLock", label: "Center Text Lock", frameRange: [56, 108], purpose: "Fade in and stabilize a short center phrase.", reusable: true, reviewRisk: "Text capacity is low." },
  { id: "ringToDiamondMorph", label: "Ring To Diamond Morph", frameRange: [92, 156], purpose: "Morph circular ring into a diamond frame.", reusable: true, reviewRisk: "Morph should feel intentional, not ornamental." },
];

export const shot105AtomicMotionIds = shot105AtomicMotions.map((motion) => motion.id);

export const shot105MotionPackageStatus = {
  shotId: "shot_105",
  libraryId: "system-ring-morph-highlight",
  choreographyId: "systemRingMorphHighlight",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
