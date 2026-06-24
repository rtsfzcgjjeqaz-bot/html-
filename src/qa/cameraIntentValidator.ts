import { isCameraMotionAllowed } from "../motion/cameraIntentMap";
import { QualityStructure, resultFrom } from "./types";

export function cameraIntentValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let activeCount = 0;
  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const result = isCameraMotionAllowed(scene, index);
    if (!result.allowed) errors.push(result.reason);
    if ([0, 2, 5].includes(index)) activeCount += 1;
  }
  if (activeCount < 3) warnings.push("fewer than 3 key camera scenes planned.");
  return resultFrom(errors, warnings);
}
