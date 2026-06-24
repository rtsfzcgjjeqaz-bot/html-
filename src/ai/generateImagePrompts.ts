import type { AdPackage } from "./generateAdPackage";

export function generateImagePrompts(ad: AdPackage): string[] {
  const baseRules = "Premium clean product advertising, abstract data layers, realistic UI evidence, low saturation.";
  const scenePrompts = ad.storyboard.scenes
    .filter((scene) => scene.assets.fallback === "ai_generated")
    .map((scene) => `${scene.visualIntent}. ${scene.textOverlay.join(" ")}. ${baseRules}`);

  return scenePrompts.length
    ? scenePrompts.slice(0, 4)
    : [`Premium cinematic website advertisement cover for ${ad.cover.title}. ${baseRules}`];
}
