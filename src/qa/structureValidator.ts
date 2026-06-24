import { visualRules } from "../design/designTokens";
import { QualityStructure, resultFrom } from "./types";

export function structureValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const scenes = structure.scenes ?? [];
  if (scenes.length < visualRules.minScenesPerVideo) errors.push(`expected at least ${visualRules.minScenesPerVideo} scenes, got ${scenes.length}.`);
  for (const [index, scene] of scenes.entries()) {
    const sceneId = scene.id ?? index + 1;
    if (!scene.duration || scene.duration <= 0) errors.push(`scene ${sceneId}: missing positive duration.`);
    if (!scene.camera?.shot || !scene.camera?.motion) errors.push(`scene ${sceneId}: missing camera shot or motion.`);
    if (!scene.visualTemplate && !scene.layoutId) errors.push(`scene ${sceneId}: missing visualTemplate/layoutId.`);
  }
  return resultFrom(errors);
}
