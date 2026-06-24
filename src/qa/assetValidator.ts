import fs from "fs";
import path from "path";
import { QualityStructure, resultFrom } from "./types";

function publicAssetExists(publicPath: string) {
  if (/^(https?:|file:|data:)/.test(publicPath)) return true;
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

export function assetValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const scenes = structure.scenes ?? [];
  const iconScenes = scenes.filter((scene) => ["appGrid", "iconRail"].includes(String(scene.visualTemplate)));

  for (const scene of iconScenes) {
    const sceneId = scene.id ?? "?";
    const icons = scene.assets?.appIcons ?? [];
    if (icons.length < 4) {
      errors.push(`scene ${sceneId}: app icon scene requires at least 4 real app icon assets.`);
    }
    for (const icon of icons.slice(0, 6)) {
      if (!icon.appName || !icon.src) errors.push(`scene ${sceneId}: app icon missing appName or src.`);
      if (icon.src && !publicAssetExists(icon.src)) errors.push(`scene ${sceneId}: app icon asset does not exist: ${icon.src}`);
    }
  }

  return resultFrom(errors);
}
