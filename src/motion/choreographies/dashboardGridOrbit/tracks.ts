import { dashboardGridOrbitAtomicMotions } from "../../atomic/dashboardGridOrbit";

export type DashboardGridOrbitTrack = {
  trackId: string;
  motionId: (typeof dashboardGridOrbitAtomicMotions)[number];
  target: string;
  layer: "background" | "dashboard" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const dashboardGridOrbitTracks: DashboardGridOrbitTrack[] = [
  {
    trackId: "track-gridBackdropParallax",
    motionId: "gridBackdropParallax",
    target: "gridBackdrop",
    layer: "background",
    startPercent: 0,
    endPercent: 100,
    role: "depth-establish",
    purpose: "Create a restrained dashboard-stage parallax background.",
  },
  {
    trackId: "track-dashboardFrameOrbit",
    motionId: "dashboardFrameOrbit",
    target: "dashboardFrame",
    layer: "dashboard",
    startPercent: 6,
    endPercent: 38,
    role: "primary-dashboard-entry",
    purpose: "Bring the main dashboard frame into a stable angled view.",
    semanticTarget: "dashboard.primaryFrame",
  },
  {
    trackId: "track-gridCellsCascade",
    motionId: "gridCellsCascade",
    target: "gridCells",
    layer: "dashboard",
    startPercent: 26,
    endPercent: 64,
    role: "data-density-build",
    purpose: "Cascade reusable grid cells without copying source dashboard content.",
    semanticTarget: "dashboard.cells",
  },
  {
    trackId: "track-calloutPinsPop",
    motionId: "calloutPinsPop",
    target: "calloutPins",
    layer: "semantic",
    startPercent: 46,
    endPercent: 78,
    role: "semantic-callouts",
    purpose: "Pop 2-3 semantic callout pins tied to dashboard regions.",
    semanticTarget: "dashboard.callouts",
  },
  {
    trackId: "track-columnHighlightSweep",
    motionId: "columnHighlightSweep",
    target: "columnHighlight",
    layer: "semantic",
    startPercent: 58,
    endPercent: 82,
    role: "data-focus",
    purpose: "Sweep a column highlight to indicate the active data region.",
    semanticTarget: "dashboard.focusColumn",
  },
  {
    trackId: "track-dashboardSettle",
    motionId: "dashboardSettle",
    target: "fullComposition",
    layer: "camera",
    startPercent: 82,
    endPercent: 100,
    role: "readability-hold",
    purpose: "Settle the dashboard grid for review and handoff.",
  },
];
