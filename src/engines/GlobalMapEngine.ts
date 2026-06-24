import type { VideoEngine } from "../core/types";

export const GlobalMapEngine: VideoEngine = {
  mode: "map",
  name: "03 Global Map",
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
    layoutMode: "geo_regions",
    cameraMode: "map_pan",
    motionStyle: "geo_trace",
    transitionStyle: "map_wipe",
    density: "medium",
    depthEnabled: true,
  },
};
