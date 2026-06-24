import type { VideoEngine } from "../core/types";

export const WalkthroughEngine: VideoEngine = {
  mode: "walkthrough",
  name: "10 Walkthrough",
  storyboard: {
    scene: [
      { id: 1, purpose: "hook" },
      { id: 2, purpose: "step 1" },
      { id: 3, purpose: "step 2" },
      { id: 4, purpose: "step 3" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "guided_ui",
    cameraMode: "ui_step",
    motionStyle: "guided_steps",
    transitionStyle: "step_slide",
    density: "medium",
    depthEnabled: false,
  },
};
