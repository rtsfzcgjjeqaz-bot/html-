import fs from "fs";
import path from "path";
import { layoutValidator } from "../qa/layoutValidator";
import { motionUsageValidator } from "../qa/motionUsageValidator";
import { screenshotUsageValidator } from "../qa/screenshotUsageValidator";
import { semanticValidator } from "../qa/semanticValidator";
import { structureValidator } from "../qa/structureValidator";
import { typographyValidator } from "../qa/typographyValidator";
import { intraVideoMotionValidator } from "../qa/intraVideoMotionValidator";
import { restrictionValidator } from "../qa/restrictionValidator";
import { assetValidator } from "../qa/assetValidator";
import { compositionValidator } from "../qa/compositionValidator";
import { visualRichnessValidator } from "../qa/visualRichnessValidator";
import { visualDensityValidator } from "../qa/visualDensityValidator";
import { cameraIntentValidator } from "../qa/cameraIntentValidator";
import { semanticMotionValidator } from "../qa/semanticMotionValidator";
import { QualityGateReport, QualityStructure, ValidatorResult } from "../qa/types";

function mergeErrors(results: ValidatorResult[]) {
  return results.flatMap((result) => result.errors);
}

function mergeWarnings(results: ValidatorResult[]) {
  return results.flatMap((result) => result.warnings);
}

export function runQualityGate(structure: QualityStructure, qaPath?: string): QualityGateReport {
  const structureResult = structureValidator(structure);
  const typographyResult = typographyValidator(structure);
  const layoutResult = layoutValidator(structure);
  const screenshotUsageResult = screenshotUsageValidator(structure);
  const motionUsageBase = motionUsageValidator(structure);
  const intraMotionResult = intraVideoMotionValidator(structure);
  const motionUsageResult = {
    status: motionUsageBase.status === "failed" || intraMotionResult.status === "failed" ? "failed" : motionUsageBase.status === "warning" || intraMotionResult.status === "warning" ? "warning" : "passed",
    errors: [...motionUsageBase.errors, ...intraMotionResult.errors],
    warnings: [...motionUsageBase.warnings, ...intraMotionResult.warnings],
  } as ValidatorResult;
  const semanticResult = semanticValidator(structure);
  const restrictionResult = restrictionValidator(structure);
  const assetResult = assetValidator(structure);
  const compositionResult = compositionValidator(structure);
  const visualRichnessResult = visualRichnessValidator(structure);
  const visualDensityResult = visualDensityValidator(structure);
  const cameraIntentResult = cameraIntentValidator(structure);
  const semanticMotionResult = semanticMotionValidator(structure);
  const results = [structureResult, typographyResult, layoutResult, screenshotUsageResult, motionUsageResult, semanticResult, restrictionResult, assetResult, compositionResult, visualRichnessResult, visualDensityResult, cameraIntentResult, semanticMotionResult];

  const report: QualityGateReport = {
    passed: results.every((result) => result.status !== "failed"),
    errors: mergeErrors(results),
    warnings: mergeWarnings(results),
    checks: {
      structure: structureResult.status,
      typography: typographyResult.status,
      layout: layoutResult.status,
      screenshotUsage: screenshotUsageResult.status,
      motionUsage: motionUsageResult.status,
      semantic: semanticResult.status,
      restrictions: restrictionResult.status,
      assets: assetResult.status,
      composition: compositionResult.status,
      visualRichness: visualRichnessResult.status,
      visualDensity: visualDensityResult.status,
      cameraIntent: cameraIntentResult.status,
      semanticMotion: semanticMotionResult.status,
    },
  };

  if (qaPath) {
    fs.mkdirSync(path.dirname(qaPath), { recursive: true });
    fs.writeFileSync(qaPath, JSON.stringify(report, null, 2));
  }

  return report;
}

export function assertQualityPassed(structure: QualityStructure, qaPath: string, purpose: "preview" | "final" | "approve") {
  const report = runQualityGate(structure, qaPath);
  if (!report.passed) {
    throw new Error(`qualityGate blocked ${purpose}: ${qaPath}`);
  }
  return report;
}
