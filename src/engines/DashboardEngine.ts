import type { VideoEngine } from "../core/types";

export const DashboardEngine: VideoEngine = {
  mode: "dashboard",
  name: "06 Dashboard",
  storyboard: {
    scene: [
      { id: 1, purpose: "system loading" },
      { id: 2, purpose: "panel build" },
      { id: 3, purpose: "comparison" },
      { id: 4, purpose: "full overview" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "dashboard_panels",
    cameraMode: "fixed_dashboard",
    motionStyle: "panel_build",
    transitionStyle: "panel_swap",
    density: "high",
    depthEnabled: false,
  },
};
