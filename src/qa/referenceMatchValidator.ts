import { QualityStructure, resultFrom } from "./types";

export type ReferenceProfileLike = {
  targetSceneCount?: number;
  averageShotSeconds?: number;
  motionDensity?: string;
};

export function referenceMatchValidator(structure: QualityStructure, reference: ReferenceProfileLike) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const scenes = structure.scenes ?? [];
  if (reference.targetSceneCount && Math.abs(scenes.length - reference.targetSceneCount) > 2) warnings.push(`scene count differs from reference: ${scenes.length} vs ${reference.targetSceneCount}`);
  const avg = scenes.reduce((sum, scene) => sum + Number(scene.duration ?? 0), 0) / Math.max(1, scenes.length);
  if (reference.averageShotSeconds && Math.abs(avg - reference.averageShotSeconds) > 2) warnings.push(`average shot length differs from reference: ${avg.toFixed(1)} vs ${reference.averageShotSeconds}`);
  if (reference.motionDensity === "high" && scenes.some((scene) => (scene.animationEvents ?? []).length < 3)) errors.push("reference requires high motion density; scene has fewer than 3 animation events.");
  return resultFrom(errors, warnings);
}
