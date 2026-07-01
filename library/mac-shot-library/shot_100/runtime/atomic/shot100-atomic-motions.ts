export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot100AtomicMotions: AtomicMotion[] = [
  { id: "pastelFieldWake", label: "Pastel Field Wake", frameRange: [0, 18], purpose: "Reveal bright SaaS background and soft shapes.", reusable: true, reviewRisk: "Avoid flat PPT-like white space." },
  { id: "floatingAppTiles", label: "Floating App Tiles", frameRange: [8, 48], purpose: "Introduce app integration tiles with depth.", reusable: true, reviewRisk: "Tiles must not become random decoration." },
  { id: "brandTitleResolve", label: "Brand Title Resolve", frameRange: [38, 68], purpose: "Resolve brand and short descriptor.", reusable: true, reviewRisk: "Long brand names can collide with product screen." },
  { id: "laptopScreenReveal", label: "Laptop Screen Reveal", frameRange: [48, 86], purpose: "Bring product dashboard into hero composition.", reusable: true, reviewRisk: "Laptop should remain inside safe area." },
  { id: "dashboardDetailSettle", label: "Dashboard Detail Settle", frameRange: [74, 99], purpose: "Hold dashboard details for recognition.", reusable: true, reviewRisk: "Tiny UI details can shimmer if over-dense." },
];

export const shot100AtomicMotionIds = shot100AtomicMotions.map((motion) => motion.id);

export const shot100MotionPackageStatus = {
  shotId: "shot_100",
  libraryId: "teamflect-hero-laptop-reveal",
  choreographyId: "teamflectHeroLaptopReveal",
  sceneType: "websiteHero",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
