export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot96AtomicMotions: AtomicMotion[] = [
  { id: "marketFieldWake", label: "Market Field Wake", frameRange: [0, 24], purpose: "Reveal a dark finance grid and map surface.", reusable: true, reviewRisk: "Opening must avoid a blank first second." },
  { id: "mapTraceDrift", label: "Map Trace Drift", frameRange: [10, 54], purpose: "Create a slow data-map parallax drift.", reusable: true, reviewRisk: "Lines should remain background context." },
  { id: "barClusterBuild", label: "Bar Cluster Build", frameRange: [28, 76], purpose: "Build cyan/red vertical market bars as the main visual.", reusable: true, reviewRisk: "Bars need consistent spacing and safe bounds." },
  { id: "headlineResolve", label: "Headline Resolve", frameRange: [42, 82], purpose: "Add semantic cover-hook copy.", reusable: true, reviewRisk: "Text can collide with chart cluster if too long." },
  { id: "metricChipReveal", label: "Metric Chip Reveal", frameRange: [62, 98], purpose: "Reveal one small metric or data label.", reusable: true, reviewRisk: "Fake precision should be avoided." },
  { id: "hookSettle", label: "Hook Settle", frameRange: [98, 126], purpose: "Hold final opener composition.", reusable: true, reviewRisk: "Do not add extra decorative motion during hold." },
];

export const shot96AtomicMotionIds = shot96AtomicMotions.map((motion) => motion.id);

export const shot96MotionPackageStatus = {
  shotId: "shot_96",
  libraryId: "finance-market-bar-glow-hook",
  choreographyId: "financeMarketBarGlowHook",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
