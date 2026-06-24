import type { VideoEngine } from "../core/types";

export const RealtimeEngine: VideoEngine = {
  mode: "realtime",
  name: "09 Realtime Feed",
  storyboard: {
    scene: [
      { id: 1, purpose: "continuous stream" },
      { id: 2, purpose: "comparison" },
      { id: 3, purpose: "anomaly" },
      { id: 4, purpose: "highlight" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "feed_stream",
    cameraMode: "feed_follow",
    motionStyle: "stream",
    transitionStyle: "ticker_cut",
    density: "high",
    depthEnabled: false,
  },
};
