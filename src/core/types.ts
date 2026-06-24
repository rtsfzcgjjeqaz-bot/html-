import type { EngineConfig } from "./config/types";
import type { EngineStoryboard } from "./storyboard/types";

export type EngineMode =
  | "info"
  | "minimal"
  | "map"
  | "ai"
  | "shock"
  | "dashboard"
  | "parallax"
  | "narrative"
  | "realtime"
  | "walkthrough";

export type VideoEngine = {
  mode: EngineMode;
  name: string;
  storyboard: EngineStoryboard;
  config: EngineConfig;
};
