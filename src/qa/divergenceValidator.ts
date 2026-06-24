import { visualSimilarityValidator } from "./visualSimilarityValidator";
import type { QualityStructure } from "./types";

export function divergenceValidator(structures: QualityStructure[]) {
  return visualSimilarityValidator(structures);
}
