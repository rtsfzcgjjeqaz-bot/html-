import type { VideoEngine } from "../core/types";

export const NarrativeEngine: VideoEngine = {
  mode: "narrative",
  name: "08 Narrative Case",
  storyboard: {
    scene: [
      { id: 1, purpose: "problem" },
      { id: 2, purpose: "discovery" },
      { id: 3, purpose: "comparison" },
      { id: 4, purpose: "resolution" },
      { id: 5, purpose: "summary" },
    ],
  },
  config: {
    layoutMode: "case_cards",
    cameraMode: "case_dolly",
    motionStyle: "case_reveal",
    transitionStyle: "page_turn",
    density: "medium",
    depthEnabled: true,
  },
};
