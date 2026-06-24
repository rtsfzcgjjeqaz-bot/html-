import type { VideoEngine } from "../core/types";

export const PriceShockEngine: VideoEngine = {
  mode: "shock",
  name: "05 Price Shock",
  storyboard: {
    scene: [
      { id: 1, purpose: "baseline" },
      { id: 2, purpose: "disruption" },
      { id: 3, purpose: "contrast reveal" },
      { id: 4, purpose: "AI decision" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "contrast_split",
    cameraMode: "impact_snap",
    motionStyle: "impact_contrast",
    transitionStyle: "smash_cut",
    density: "high",
    depthEnabled: true,
  },
};
