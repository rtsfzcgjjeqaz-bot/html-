import type { QualityScene } from "../qa/types";

export type CameraIntent = "hero_proof" | "data_reveal" | "decision_pullback" | "stable_component";

export type PlannedShot = {
  sceneIndex: number;
  intent: CameraIntent;
  activeCamera: boolean;
  cameraPath: "push_in" | "dolly_left" | "tilt_up" | "slide_right" | "arc" | "pull_back" | "slow_center";
  reason: string;
};

export function planShot(scene: QualityScene, sceneIndex: number): PlannedShot {
  const template = String(scene.visualTemplate ?? "");
  if (sceneIndex === 0 || template === "websiteHero") return { sceneIndex, intent: "hero_proof", activeCamera: true, cameraPath: "push_in", reason: "prove the website product first" };
  if (sceneIndex === 2 || template === "searchFlow" || template === "comparisonPanel") return { sceneIndex, intent: "data_reveal", activeCamera: true, cameraPath: "dolly_left", reason: "follow the comparison/search flow" };
  if (sceneIndex === 5 || template === "dynamicChart") return { sceneIndex, intent: "decision_pullback", activeCamera: true, cameraPath: "pull_back", reason: "reveal the whole system view" };
  return { sceneIndex, intent: "stable_component", activeCamera: false, cameraPath: "slow_center", reason: "keep stable framing and let semantic components move" };
}

export function planShots(scenes: QualityScene[] = []) {
  return scenes.map((scene, index) => planShot(scene, index));
}
