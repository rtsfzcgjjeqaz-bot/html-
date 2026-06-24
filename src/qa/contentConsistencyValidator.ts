import { resultFrom, type QualityStructure } from "./types";

type DynamicStructure = QualityStructure & Record<string, unknown>;

function readHash(structure: DynamicStructure) {
  return structure.contentHash ?? structure.lockedContent?.contentHash;
}

export function contentConsistencyValidator(structures: DynamicStructure[]) {
  const errors: string[] = [];
  if (structures.length < 2) return resultFrom(errors);
  const base = structures[0];
  const baseHash = readHash(base);
  const baseScenes = base.scenes ?? [];
  const baseLock = base.lockedContent;

  structures.forEach((structure, index) => {
    const label = `video_${String(index + 1).padStart(2, "0")}`;
    if (readHash(structure) !== baseHash) errors.push(`${label}: contentHash differs.`);
    if ((structure.scenes ?? []).length !== baseScenes.length) errors.push(`${label}: scene count differs.`);
    const lock = structure.lockedContent;
    for (const key of ["productName", "coreValue", "usp", "appList", "countryData", "pricingData", "aiDecisionLogic"] as const) {
      if (JSON.stringify(lock?.[key]) !== JSON.stringify(baseLock?.[key])) errors.push(`${label}: lockedContent.${key} differs.`);
    }
    (structure.scenes ?? []).forEach((scene, sceneIndex: number) => {
      const baseScene = baseScenes[sceneIndex];
      if (scene.content?.message !== baseScene?.content?.message) errors.push(`${label} scene ${sceneIndex + 1}: message differs.`);
      if (JSON.stringify(scene.content?.dataRefs) !== JSON.stringify(baseScene?.content?.dataRefs)) errors.push(`${label} scene ${sceneIndex + 1}: dataRefs differ.`);
    });
  });

  return resultFrom(errors);
}
