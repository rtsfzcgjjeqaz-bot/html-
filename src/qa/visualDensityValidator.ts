import { safeBounds } from "../design/designTokens";
import { QualityStructure, SceneRegion, resultFrom } from "./types";

function area(region?: SceneRegion) { return region ? region.width * region.height : 0; }

export function visualDensityValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const id = scene.id ?? index + 1;
    const regions = [scene.primaryVisualRegion, ...(scene.textRegions ?? []), ...(scene.cardRegions ?? []), ...(scene.chartRegions ?? []), ...(scene.screenshotRegions ?? [])].filter(Boolean) as SceneRegion[];
    const ratio = regions.reduce((sum, region) => sum + area(region), 0) / (safeBounds.width * safeBounds.height);
    const textRatio = (scene.textRegions ?? []).reduce((sum, region) => sum + area(region), 0) / (safeBounds.width * safeBounds.height);
    if (ratio < 0.34) errors.push(`scene ${id}: visual density too low (${ratio.toFixed(2)}).`);
    if (textRatio > 0.26) errors.push(`scene ${id}: text occupies too much area (${textRatio.toFixed(2)}).`);
    if (!scene.primaryVisualRegion) errors.push(`scene ${id}: missing primary visual for density check.`);
    if (ratio > 0.78) warnings.push(`scene ${id}: visual density may be crowded (${ratio.toFixed(2)}).`);
  }
  return resultFrom(errors, warnings);
}
