import { safeBounds, visualRules } from "../design/designTokens";
import { QualityScene, QualityStructure, SceneRegion, resultFrom } from "./types";

function area(region?: SceneRegion) {
  return region ? region.width * region.height : 0;
}

function componentCount(scene: QualityScene) {
  return [
    scene.primaryVisualRegion,
    ...(scene.cardRegions ?? []),
    ...(scene.chartRegions ?? []),
    ...(scene.screenshotRegions ?? []),
  ].filter(Boolean).length;
}

function occupiedRatio(scene: QualityScene) {
  const regions = [
    scene.primaryVisualRegion,
    ...(scene.textRegions ?? []),
    ...(scene.cardRegions ?? []),
    ...(scene.chartRegions ?? []),
    ...(scene.screenshotRegions ?? []),
  ].filter(Boolean) as SceneRegion[];

  const occupied = regions.reduce((sum, region) => sum + area(region), 0);
  return occupied / (safeBounds.width * safeBounds.height);
}

function hasVisibleCamera(scene: QualityScene) {
  const motion = String(scene.camera?.motion ?? scene.cameraPathId ?? "");
  return /(push|dolly|tilt|slide|arc|pull|orbit|follow|jump|center|camera)/i.test(motion);
}

export function visualRichnessValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let visibleCameraScenes = 0;

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    const template = String(scene.visualTemplate ?? "");
    const primaryArea = area(scene.primaryVisualRegion);

    if (primaryArea < visualRules.minPrimaryVisualArea) {
      errors.push(`scene ${sceneId}: primary visual is too small (${primaryArea}px).`);
    }

    if (componentCount(scene) < visualRules.minSceneComponents && template !== "websiteHero") {
      errors.push(`scene ${sceneId}: scene needs at least ${visualRules.minSceneComponents} structured visual components.`);
    }

    if (occupiedRatio(scene) < visualRules.minOccupiedSafeAreaRatio) {
      errors.push(`scene ${sceneId}: composition leaves too much unused safe-area space.`);
    }

    if (hasVisibleCamera(scene) && [0, 2, 5].includes(index)) visibleCameraScenes += 1;

    if ((scene.animationEvents ?? []).length < 4) {
      warnings.push(`scene ${sceneId}: animation event count should be at least 4 for non-PPT motion.`);
    }
  }

  if (visibleCameraScenes < 3) {
    errors.push("video: at least 3 key scenes must have intentional visible camera language.");
  }

  return resultFrom(errors, warnings);
}
