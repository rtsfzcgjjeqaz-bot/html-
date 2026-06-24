import { safeArea } from "../design/designTokens";
import { QualityScene, QualityStructure, SceneRegion, resultFrom } from "./types";

function right(region: SceneRegion) {
  return region.x + region.width;
}

function bottom(region: SceneRegion) {
  return region.y + region.height;
}

function intersects(a: SceneRegion, b: SceneRegion) {
  return a.x < right(b) && right(a) > b.x && a.y < bottom(b) && bottom(a) > b.y;
}

function center(region: SceneRegion) {
  return { x: region.x + region.width / 2, y: region.y + region.height / 2 };
}

function distanceFromCanvasCenter(region: SceneRegion) {
  const c = center(region);
  return Math.hypot(c.x - 960, c.y - 540);
}

function textOverlapsPrimary(scene: QualityScene) {
  if (!scene.primaryVisualRegion) return false;
  return (scene.textRegions ?? []).some((textRegion) => intersects(textRegion, scene.primaryVisualRegion as SceneRegion));
}

function assertBalancedRegions(errors: string[], scene: QualityScene, sceneId: number) {
  if (!scene.primaryVisualRegion) {
    errors.push(`scene ${sceneId}: missing primary visual region for balance check.`);
    return;
  }

  if (distanceFromCanvasCenter(scene.primaryVisualRegion) > 520) {
    errors.push(`scene ${sceneId}: primary visual is too far from frame center.`);
  }

  if (bottom(scene.primaryVisualRegion) < 720 && !["websiteHero", "searchFlow"].includes(String(scene.visualTemplate))) {
    errors.push(`scene ${sceneId}: primary visual leaves excessive lower blank space.`);
  }

  if (textOverlapsPrimary(scene)) {
    errors.push(`scene ${sceneId}: text region overlaps primary visual region.`);
  }
}

function assertTemplateSpecific(errors: string[], scene: QualityScene, sceneId: number) {
  const template = String(scene.visualTemplate ?? "");

  if (template === "websiteHero" && (scene.semanticShapes ?? []).length > 0) {
    errors.push(`scene ${sceneId}: websiteHero must not render focus boxes over the screenshot.`);
  }

  if (template === "signalBoard") {
    const region = scene.primaryVisualRegion;
    if (!region || region.width < 1280 || region.height < 400) {
      errors.push(`scene ${sceneId}: signalBoard region must be large enough for four equal cards.`);
    }
  }

  if (template === "searchFlow") {
    const region = scene.primaryVisualRegion;
    if (!region || region.width < 1100 || region.height < 220) {
      errors.push(`scene ${sceneId}: searchFlow region must fit three equal step cards.`);
    }
  }

  for (const shape of scene.semanticShapes ?? []) {
    if (shape.semanticRole === "connector" || shape.semanticRole === "priceDeltaArrow") {
      errors.push(`scene ${sceneId}: ${shape.semanticRole} is blocked until it has an explicit target binding.`);
    }
  }
}

function assertTextComposition(errors: string[], scene: QualityScene, sceneId: number) {
  for (const region of scene.textRegions ?? []) {
    if (region.y < 190) {
      errors.push(`scene ${sceneId}: title block is too close to the top edge.`);
    }
  }
}

export function compositionValidator(structure: QualityStructure) {
  const errors: string[] = [];

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    assertBalancedRegions(errors, scene, sceneId);
    assertTemplateSpecific(errors, scene, sceneId);
    assertTextComposition(errors, scene, sceneId);

    for (const region of [...(scene.textRegions ?? []), ...(scene.cardRegions ?? []), ...(scene.chartRegions ?? [])]) {
      if (region.x < safeArea.left || region.y < safeArea.top) {
        errors.push(`scene ${sceneId}: region is too close to top/left safe edge.`);
      }
    }
  }

  return resultFrom(errors);
}
