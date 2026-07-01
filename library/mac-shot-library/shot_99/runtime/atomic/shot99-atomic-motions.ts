export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot99AtomicMotions: AtomicMotion[] = [
  { id: "globeReveal", label: "Globe Reveal", frameRange: [0, 34], purpose: "Reveal cyan global-market context.", reusable: true, reviewRisk: "Globe must remain background context, not cover chart." },
  { id: "volumeBarsRise", label: "Volume Bars Rise", frameRange: [18, 78], purpose: "Build volume bars below the chart.", reusable: true, reviewRisk: "Volume bars should not dominate the chart." },
  { id: "candlestickFlow", label: "Candlestick Flow", frameRange: [28, 116], purpose: "Reveal multicolor candles across the dashboard.", reusable: true, reviewRisk: "Candles must remain legible and not over-dense." },
  { id: "indicatorLineTrace", label: "Indicator Line Trace", frameRange: [46, 128], purpose: "Trace moving-average indicator lines.", reusable: true, reviewRisk: "Too many lines can feel noisy." },
  { id: "priceCalloutHold", label: "Price Callout Hold", frameRange: [90, 150], purpose: "Reveal small labels and insight headline.", reusable: true, reviewRisk: "Labels need clear safe-area behavior." },
  { id: "dashboardSettle", label: "Dashboard Settle", frameRange: [150, 175], purpose: "Hold the complete global market dashboard.", reusable: true, reviewRisk: "No additional motion during final hold." },
];

export const shot99AtomicMotionIds = shot99AtomicMotions.map((motion) => motion.id);

export const shot99MotionPackageStatus = {
  shotId: "shot_99",
  libraryId: "global-market-dashboard-insight",
  choreographyId: "globalMarketDashboardInsight",
  sceneType: "priceInsight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;
