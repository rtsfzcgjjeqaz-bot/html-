export type ScenePurpose =
  | "hook"
  | "comparison"
  | "insight"
  | "AI decision"
  | "summary"
  | "input"
  | "analysis"
  | "decision"
  | "baseline"
  | "disruption"
  | "contrast reveal"
  | "system loading"
  | "panel build"
  | "full overview"
  | "entry"
  | "depth immersion"
  | "orbit reveal"
  | "problem"
  | "discovery"
  | "resolution"
  | "continuous stream"
  | "anomaly"
  | "highlight"
  | "step 1"
  | "step 2"
  | "step 3";

export type StoryScene = {
  id: number;
  purpose: ScenePurpose;
};

export type EngineStoryboard = {
  scene: StoryScene[];
};
