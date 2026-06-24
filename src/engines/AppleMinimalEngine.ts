import type { VideoEngine } from "../core/types";

export const AppleMinimalEngine: VideoEngine = {
  mode: "minimal",
  name: "02 Apple Minimal",
  storyboard: {
    scene: [
      { id: 1, purpose: "hook" },
      { id: 2, purpose: "comparison" },
      { id: 3, purpose: "insight" },
      { id: 4, purpose: "AI decision" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "single_center",
    cameraMode: "slow_push",
    motionStyle: "smooth",
    transitionStyle: "fade",
    density: "low",
    depthEnabled: false,
  },
};
