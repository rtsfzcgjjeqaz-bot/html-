import { QualityStructure, resultFrom } from "./types";

const forbiddenPatterns = [
  /\bcyberpunk\b/i,
  /\bneon\b/i,
  /\bdark\s+neon\s+city\b/i,
  /\bcartoon\b/i,
  /\bhand[-\s]?drawn\b/i,
  /\bcheap\s+template\b/i,
  /\bppt\b/i,
  /\bflicker\b/i,
  /\bflash\b/i,
  /赛博朋克/,
  /霓虹/,
  /真人口播/,
  /复杂\s*3D\s*角色/,
  /卡通/,
  /手绘/,
  /廉价模板/,
  /过度闪烁/,
  /\.\.\./,
  /…/,
];

const mojibakePatterns = [
  /�/,
  /鍏|瑙|槄|鐞|浠|鏈|涓|绾|骞|鏍|鏂|馃|銆|€|泄|楼/,
];

function collectStrings(value: unknown, path = "$", output: Array<{ path: string; value: string }> = []) {
  if (typeof value === "string") {
    output.push({ path, value });
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, output));
    return output;
  }
  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => collectStrings(item, `${path}.${key}`, output));
  }
  return output;
}

export function restrictionValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const strings = collectStrings(structure);
  const repeatedText = new Map<string, number>();

  for (const item of strings) {
    if (forbiddenPatterns.some((pattern) => pattern.test(item.value))) {
      errors.push(`restriction word found at ${item.path}: ${item.value}`);
    }
    if (mojibakePatterns.some((pattern) => pattern.test(item.value))) {
      errors.push(`garbled text found at ${item.path}: ${item.value}`);
    }
    if (/^\$\.scenes\[\d+\]\.textOverlay\[\d+\]$/.test(item.path)) {
      const key = item.value.trim().toLowerCase();
      if (key) repeatedText.set(key, (repeatedText.get(key) ?? 0) + 1);
    }
  }

  for (const [line, count] of repeatedText.entries()) {
    if (count > 1) errors.push(`repeated text line appears ${count} times: ${line}`);
  }

  return resultFrom(errors);
}
