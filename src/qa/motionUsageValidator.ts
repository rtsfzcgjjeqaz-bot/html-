import { QualityStructure, resultFrom } from "./types";

function hasDuplicate(values: string[]) {
  return values.length !== new Set(values).size;
}

export function motionUsageValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const scenes = structure.scenes ?? [];
  const motionIds = scenes.map((scene) => scene.motionId ?? scene.camera?.motion ?? "").filter(Boolean);
  const cameraPathIds = scenes.map((scene) => scene.cameraPathId ?? `${scene.camera?.shot ?? ""}:${scene.camera?.motion ?? ""}`).filter((value) => value !== ":");
  const layoutIds = scenes.map((scene) => scene.layoutId ?? scene.visualTemplate ?? "").filter(Boolean);
  const transitions = scenes.map((scene) => scene.transitionId ?? "").filter(Boolean);

  if (hasDuplicate(motionIds)) errors.push(`motionId/camera motion repeated: ${motionIds.join(", ")}.`);
  if (hasDuplicate(cameraPathIds)) errors.push(`cameraPathId repeated: ${cameraPathIds.join(", ")}.`);
  if (hasDuplicate(layoutIds)) errors.push(`layoutId/visualTemplate repeated: ${layoutIds.join(", ")}.`);

  for (let i = 1; i < transitions.length; i++) {
    if (transitions[i] && transitions[i] === transitions[i - 1]) errors.push(`transition repeated consecutively at scene ${i} and ${i + 1}.`);
  }

  for (const [index, scene] of scenes.entries()) {
    const sceneId = scene.id ?? index + 1;
    const events = scene.animationEvents ?? [scene.camera?.motion, scene.visualTemplate, ...(scene.semanticShapes ?? []).map((shape) => shape.semanticRole)].filter(Boolean) as string[];
    if (events.length < 3) errors.push(`scene ${sceneId}: fewer than 3 animation events.`);
    const lowerEvents = events.map((event) => event.toLowerCase());
    if (lowerEvents.every((event) => event === "fade" || event === "scale")) errors.push(`scene ${sceneId}: fade/scale-only animation.`);
  }

  return resultFrom(errors, warnings);
}
