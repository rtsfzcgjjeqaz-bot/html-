export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot122AtomicMotions: AtomicMotion[] = [
  { id: "brightStageWash", label: "Bright Stage Wash", frameRange: [0, 16], purpose: "Open a clean bright product stage.", reusable: true, reviewRisk: "Avoid blank white washout." },
  { id: "phoneHeroTilt", label: "Phone Hero Tilt", frameRange: [6, 28], purpose: "Tilt the phone into a hero angle.", reusable: true, reviewRisk: "Phone must remain fully visible." },
  { id: "colorTileFanout", label: "Color Tile Fanout", frameRange: [12, 36], purpose: "Fan colorful capability tiles around the device.", reusable: true, reviewRisk: "Tiles should imply capabilities, not random confetti." },
  { id: "screenUiResolve", label: "Screen UI Resolve", frameRange: [20, 42], purpose: "Resolve compact app controls on the phone screen.", reusable: true, reviewRisk: "UI chips must not overcrowd the phone." },
  { id: "headlineSettle", label: "Headline Settle", frameRange: [28, 43], purpose: "Settle a short value headline above the phone.", reusable: true, reviewRisk: "Headline must stay inside safe area." },
];

export const shot122AtomicMotionIds = shot122AtomicMotions.map((motion) => motion.id);

export const shot122MotionPackageStatus = {
  shotId: "shot_122",
  libraryId: "phone-carousel-performance-fan",
  choreographyId: "phoneCarouselPerformanceFan",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
