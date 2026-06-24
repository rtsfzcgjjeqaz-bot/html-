import { visualRules } from "../design/designTokens";
import { QualityStructure, resultFrom } from "./types";

const wordCount = (value: string) => value.split(/\s+/).filter(Boolean).length;

export function typographyValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const allRoles = new Set<string>();

  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const sceneId = scene.id ?? index + 1;
    const lines = scene.textOverlay ?? [];
    const roles = scene.textRoles ?? (lines.length ? ["title", lines.length > 1 ? "body" : "caption"].slice(0, lines.length) : []);
    roles.forEach((role) => allRoles.add(role));

    if (lines.length > visualRules.maxTextLinesPerScene) errors.push(`scene ${sceneId}: too many text lines (${lines.length}).`);
    if (roles.length > 3) errors.push(`scene ${sceneId}: more than 3 text roles.`);
    if (roles.includes("title") && roles.includes("body") && roles.indexOf("body") < roles.indexOf("title")) warnings.push(`scene ${sceneId}: body appears before title.`);
    for (const line of lines) {
      if (line.includes("...") || line.includes("…")) errors.push(`scene ${sceneId}: ellipsis is forbidden in text: ${line}`);
      if (wordCount(line) > visualRules.maxWordsPerTextLine || line.length > 58) errors.push(`scene ${sceneId}: text too long and may overflow: ${line}`);
    }
  }

  if (allRoles.size > 4) errors.push(`video: more than 4 text roles (${Array.from(allRoles).join(", ")}).`);
  return resultFrom(errors, warnings);
}
