import path from "path";
import { QualityStructure, resultFrom } from "./types";

const normalize = (value: string) => path.basename(value.replace(/\\/g, "/")).toLowerCase();

export function screenshotUsageValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const usage = new Map<string, Array<{ sceneId: number; path: string; kind: "main" | "background" }>>();

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    for (const image of scene.assets?.image ?? []) {
      if (!image) continue;
      const key = normalize(image);
      if (!usage.has(key)) usage.set(key, []);
      usage.get(key)?.push({ sceneId, path: image, kind: "main" });
      if (key === "home.png" && scene.visualTemplate !== "websiteHero") errors.push(`scene ${sceneId}: home.png may only be used by websiteHero (${image}).`);
    }
    for (const image of scene.assets?.backgroundImage ?? []) {
      if (!image) continue;
      const key = normalize(image);
      if (!usage.has(key)) usage.set(key, []);
      usage.get(key)?.push({ sceneId, path: image, kind: "background" });
      errors.push(`scene ${sceneId}: screenshot used as background (${image}).`);
    }
  }

  for (const [key, records] of usage.entries()) {
    if (records.length > 1) errors.push(`screenshot duplicated: ${key} used in ${records.map((record) => `scene ${record.sceneId}:${record.path}`).join("; ")}.`);
    const kinds = new Set(records.map((record) => record.kind));
    if (kinds.size > 1) errors.push(`screenshot used as both background and main visual: ${key}.`);
  }

  return resultFrom(errors);
}
