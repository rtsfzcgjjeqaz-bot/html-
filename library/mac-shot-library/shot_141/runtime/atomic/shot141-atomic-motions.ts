import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot141MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot141Ease = ({ frame, startFrame, endFrame }: Shot141MotionArgs) =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot141AtomicMotions: AtomicMotion[] = [
  { id: "numberMetricCountUp", label: "Number Metric Count Up", frameRange: [0, 48], purpose: "Reveal the dashboard shell and KPI cards with numeric emphasis.", reusable: true, reviewRisk: "Cards should not feel overpacked." },
  { id: "trendCardSweep", label: "Trend Card Sweep", frameRange: [22, 82], purpose: "Bring supporting trend modules online with a horizontal sweep.", reusable: true, reviewRisk: "Trend lines must stay legible." },
  { id: "dashboardRowSettle", label: "Dashboard Row Settle", frameRange: [40, 102], purpose: "Settle lower summary rows and comparison chips.", reusable: true, reviewRisk: "Rows should not look like disconnected strips." },
  { id: "metricComparisonHold", label: "Metric Comparison Hold", frameRange: [96, 120], purpose: "Hold the completed price-insight dashboard for reading.", reusable: true, reviewRisk: "Late motion should remain minimal." },
];

export const shot141AtomicMotionIds = shot141AtomicMotions.map((motion) => motion.id);

export const shot141MotionPackageStatus = {
  shotId: "shot_141",
  libraryId: "guard-metric-trend-cards",
  choreographyId: "guardMetricTrendCards",
  sceneType: "priceInsight",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

