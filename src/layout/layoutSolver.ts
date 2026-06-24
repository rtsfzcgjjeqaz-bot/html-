import { safeBounds } from "../design/designTokens";
import type { QualityScene, SceneRegion } from "../qa/types";
import { alignmentRules } from "./alignmentRules";

function area(region?: SceneRegion) {
  return region ? region.width * region.height : 0;
}

function intersects(a: SceneRegion, b: SceneRegion) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function clampRegion(region: SceneRegion): SceneRegion {
  const maxX = safeBounds.x + safeBounds.width - region.width;
  const maxY = safeBounds.y + safeBounds.height - region.height;
  return { ...region, x: Math.max(safeBounds.x, Math.min(region.x, maxX)), y: Math.max(safeBounds.y, Math.min(region.y, maxY)) };
}

export function solveSceneLayout(scene: QualityScene): QualityScene {
  const primary = scene.primaryVisualRegion ? clampRegion(scene.primaryVisualRegion) : undefined;
  const textRegions = (scene.textRegions ?? []).map((text) => {
    let fixed = clampRegion(text);
    if (primary && intersects(fixed, primary)) {
      const leftCandidate = clampRegion({ ...fixed, x: safeBounds.x + 80 });
      const rightCandidate = clampRegion({ ...fixed, x: safeBounds.x + safeBounds.width - fixed.width - 80 });
      fixed = intersects(leftCandidate, primary) ? rightCandidate : leftCandidate;
    }
    return fixed;
  });
  return { ...scene, primaryVisualRegion: primary, textRegions };
}

export function occupiedSafeAreaRatio(scene: QualityScene) {
  const regions = [scene.primaryVisualRegion, ...(scene.textRegions ?? []), ...(scene.cardRegions ?? []), ...(scene.chartRegions ?? []), ...(scene.screenshotRegions ?? [])].filter(Boolean) as SceneRegion[];
  return regions.reduce((sum, region) => sum + area(region), 0) / (safeBounds.width * safeBounds.height);
}

export function isLayoutDenseEnough(scene: QualityScene) {
  return occupiedSafeAreaRatio(scene) >= alignmentRules.balance.minOccupiedSafeAreaRatio;
}
