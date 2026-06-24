import { isSemanticRole, visualRules } from "../design/designTokens";
import { QualityStructure, resultFrom } from "./types";

const fabricatedPatterns = [
  /fake price/i,
  /\b\d+%\s*(off|discount|save|cheaper)/i,
  /save\s*\d+%/i,
  /高达\s*\d+%/,
  /折扣\s*\d+%/,
];

export function semanticValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const serialized = JSON.stringify(structure);

  for (const pattern of fabricatedPatterns) {
    if (pattern.test(serialized)) errors.push(`fabricated pricing/discount risk: ${pattern.toString()}.`);
  }

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    if (!scene.visualIntent && !(scene.textOverlay ?? []).length) errors.push(`scene ${sceneId}: missing semantic intent or text.`);
    if ((scene.semanticShapes ?? []).length > visualRules.maxSemanticShapesPerScene) errors.push(`scene ${sceneId}: more than 2 semantic shapes.`);
    for (const [shapeIndex, shape] of (scene.semanticShapes ?? []).entries()) {
      if (!shape.semanticRole || !isSemanticRole(shape.semanticRole)) errors.push(`scene ${sceneId}: invalid shape semanticRole at index ${shapeIndex}.`);
      if (!shape.targetRegion) errors.push(`scene ${sceneId}: shape missing targetRegion at index ${shapeIndex}.`);
    }
  }

  return resultFrom(errors);
}
