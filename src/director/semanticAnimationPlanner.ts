import type { QualityScene } from "../qa/types";
import { semanticMotionForTemplate } from "../motion/semanticMotionMap";

export type SemanticAnimationPlan = {
  sceneIndex: number;
  bindings: string[];
  events: string[];
  forbidden: string[];
};

export function planSemanticAnimation(scene: QualityScene, sceneIndex: number): SemanticAnimationPlan {
  const mapping = semanticMotionForTemplate(String(scene.visualTemplate ?? ""));
  return {
    sceneIndex,
    bindings: mapping.bindings,
    events: mapping.events,
    forbidden: ["decorativeHud", "floatingLabel", "randomScanLine", "unboundShape", "meaninglessArrow"],
  };
}

export function planSemanticAnimations(scenes: QualityScene[] = []) {
  return scenes.map((scene, index) => planSemanticAnimation(scene, index));
}
