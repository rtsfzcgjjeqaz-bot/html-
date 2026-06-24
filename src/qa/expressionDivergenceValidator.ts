import { resultFrom, type QualityStructure } from "./types";

type DynamicStructure = QualityStructure & Record<string, unknown>;

function sequence(structure: DynamicStructure, getter: (scene: NonNullable<QualityStructure["scenes"]>[number]) => string | undefined) {
  return (structure.scenes ?? []).map((scene) => getter(scene) ?? "missing").join("|");
}

export function expressionDivergenceValidator(structures: DynamicStructure[]) {
  const errors: string[] = [];
  const systemIds = structures.map((structure) => structure.expressionSystemId ?? "missing");
  if (systemIds.length !== new Set(systemIds).size) errors.push(`expressionSystemId repeated: ${systemIds.join(", ")}.`);

  const checks = {
    layout: structures.map((s) => sequence(s, (scene) => scene.expression?.layoutId ?? scene.layoutId)),
    camera: structures.map((s) => sequence(s, (scene) => scene.expression?.cameraPathId ?? scene.cameraPathId)),
    motion: structures.map((s) => sequence(s, (scene) => scene.expression?.motionId ?? scene.motionId)),
    transition: structures.map((s) => sequence(s, (scene) => scene.expression?.transitionId ?? scene.transitionId)),
    template: structures.map((s) => sequence(s, (scene) => scene.expression?.visualTemplate ?? scene.visualTemplate)),
  };

  for (const [name, values] of Object.entries(checks)) {
    if (values.length !== new Set(values).size) errors.push(`${name} sequence repeats across videos.`);
  }

  return resultFrom(errors);
}
