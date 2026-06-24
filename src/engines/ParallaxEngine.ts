import type { VideoEngine } from "../core/types";

export const ParallaxEngine: VideoEngine = {
  mode: "parallax",
  name: "07 Parallax Space",
  storyboard: {
    scene: [
      { id: 1, purpose: "entry" },
      { id: 2, purpose: "depth immersion" },
      { id: 3, purpose: "orbit reveal" },
      { id: 4, purpose: "AI decision" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "spatial_layers",
    cameraMode: "orbit",
    motionStyle: "smooth_depth",
    transitionStyle: "zoom",
    density: "medium",
    depthEnabled: true,
  },
};
