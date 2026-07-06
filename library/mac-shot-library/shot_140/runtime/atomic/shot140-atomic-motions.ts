import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot140MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot140Ease = ({ frame, startFrame, endFrame }: Shot140MotionArgs) =>
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

export const shot140AtomicMotions: AtomicMotion[] = [
  { id: "metricCardGridBuild", label: "Metric Card Grid Build", frameRange: [0, 54], purpose: "Reveal the dashboard shell and top-row metric cards.", reusable: true, reviewRisk: "Cards should not overcrowd the top row." },
  { id: "pieChartSweep", label: "Pie Chart Sweep", frameRange: [20, 72], purpose: "Draw the main donut chart as the focal comparison module.", reusable: true, reviewRisk: "Arc motion must stay readable." },
  { id: "miniTrendReveal", label: "Mini Trend Reveal", frameRange: [34, 96], purpose: "Bring lower trend charts and support widgets online.", reusable: true, reviewRisk: "Trend lines should not turn into noise." },
  { id: "dashboardFocusHold", label: "Dashboard Focus Hold", frameRange: [90, 131], purpose: "Settle the whole dashboard into a readable end state.", reusable: true, reviewRisk: "Late motion should remain subtle." },
];

export const shot140AtomicMotionIds = shot140AtomicMotions.map((motion) => motion.id);

export const shot140MotionPackageStatus = {
  shotId: "shot_140",
  libraryId: "evaluation-dashboard-metrics-grid",
  choreographyId: "evaluationDashboardMetricsGrid",
  sceneType: "resultComparison",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

