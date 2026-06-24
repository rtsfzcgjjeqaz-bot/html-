import type { QualityScene } from "../qa/types";

export type SceneDensityPlan = {
  sceneIndex: number;
  targetOccupiedRatio: number;
  maxTextLines: number;
  primaryVisualPriority: "screenshot" | "icons" | "flow" | "chart" | "decision" | "signals";
};

export function planSceneDensity(scene: QualityScene, sceneIndex: number): SceneDensityPlan {
  const template = String(scene.visualTemplate ?? "");
  const primaryVisualPriority = template === "websiteHero" ? "screenshot"
    : template === "appGrid" || template === "iconRail" ? "icons"
    : template === "searchFlow" ? "flow"
    : template === "recommendationPanel" ? "decision"
    : template === "signalBoard" ? "signals"
    : "chart";
  return { sceneIndex, targetOccupiedRatio: template === "websiteHero" ? 0.42 : 0.38, maxTextLines: 2, primaryVisualPriority };
}

export function planSceneDensities(scenes: QualityScene[] = []) {
  return scenes.map((scene, index) => planSceneDensity(scene, index));
}
