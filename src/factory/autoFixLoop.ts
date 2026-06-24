import { runQualityGate } from "./qualityGate";
import { applyPreviewRepairPolicy } from "./previewRepairPolicy";
import type { QualityStructure } from "../qa/types";

export function autoFixLoop(structure: QualityStructure, maxPasses = 2) {
  let current = structure;
  const attempts = [] as Array<{ pass: number; passed: boolean; errors: string[] }>;
  for (let pass = 1; pass <= maxPasses; pass++) {
    const report = runQualityGate(current);
    attempts.push({ pass, passed: report.passed, errors: report.errors });
    if (report.passed) return { structure: current, report, attempts };
    current = applyPreviewRepairPolicy(current);
  }
  const report = runQualityGate(current);
  attempts.push({ pass: maxPasses + 1, passed: report.passed, errors: report.errors });
  return { structure: current, report, attempts };
}
