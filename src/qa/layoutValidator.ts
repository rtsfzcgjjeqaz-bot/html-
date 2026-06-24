import { isRegionInsideSafeArea } from "../design/designTokens";
import { QualityStructure, SceneRegion, resultFrom } from "./types";

function checkRegion(errors: string[], sceneId: number, label: string, region?: SceneRegion) {
  if (!region) return;
  if (!isRegionInsideSafeArea(region)) errors.push(`scene ${sceneId}: ${label} outside safe area (${JSON.stringify(region)}).`);
}

export function layoutValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    for (const [i, region] of (scene.textRegions ?? []).entries()) checkRegion(errors, sceneId, `textRegion ${i}`, region);
    for (const [i, region] of (scene.cardRegions ?? []).entries()) checkRegion(errors, sceneId, `cardRegion ${i}`, region);
    for (const [i, region] of (scene.screenshotRegions ?? []).entries()) checkRegion(errors, sceneId, `screenshotRegion ${i}`, region);
    for (const [i, region] of (scene.chartRegions ?? []).entries()) checkRegion(errors, sceneId, `chartRegion ${i}`, region);
    for (const [i, region] of (scene.shapeRegions ?? []).entries()) checkRegion(errors, sceneId, `shapeRegion ${i}`, region);
    for (const [i, shape] of (scene.semanticShapes ?? []).entries()) checkRegion(errors, sceneId, `semanticShape ${i}`, shape.targetRegion);
    if (!scene.visualTemplate && !scene.primaryVisualRegion) warnings.push(`scene ${sceneId}: no explicit primary visual region or visualTemplate.`);
  }

  return resultFrom(errors, warnings);
}
