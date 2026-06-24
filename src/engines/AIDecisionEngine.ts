import type { VideoEngine } from "../core/types";

export const AIDecisionEngine: VideoEngine = {
  mode: "ai",
  name: "04 AI Decision",
  storyboard: {
    scene: [
      { id: 1, purpose: "input" },
      { id: 2, purpose: "analysis" },
      { id: 3, purpose: "comparison" },
      { id: 4, purpose: "decision" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "decision_flow",
    cameraMode: "analysis_push",
    motionStyle: "analysis_scan",
    transitionStyle: "scan",
    density: "medium",
    depthEnabled: true,
  },
};
