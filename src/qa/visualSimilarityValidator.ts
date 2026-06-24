import { QualityStructure, resultFrom } from "./types";

export function visualSimilarityValidator(structures: QualityStructure[]) {
  const errors: string[] = [];
  const signatures = structures.map((structure) => (structure.scenes ?? []).map((scene) => scene.visualTemplate ?? scene.layoutId ?? "unknown").join("|"));
  const seen = new Map<string, number>();
  signatures.forEach((signature, index) => {
    const previous = seen.get(signature);
    if (previous !== undefined) errors.push(`video_${index + 1} visually repeats video_${previous + 1}: ${signature}`);
    seen.set(signature, index);
  });
  return resultFrom(errors);
}
