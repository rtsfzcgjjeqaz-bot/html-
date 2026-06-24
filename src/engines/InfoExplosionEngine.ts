import type { VideoEngine } from "../core/types";

export const InfoExplosionEngine: VideoEngine = {
  mode: "info",
  name: "01 Info Explosion",
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
    layoutMode: "dense_grid",
    cameraMode: "shake_zoom",
    motionStyle: "fast_snappy",
    transitionStyle: "flash",
    density: "high",
    depthEnabled: true,
  },
};
