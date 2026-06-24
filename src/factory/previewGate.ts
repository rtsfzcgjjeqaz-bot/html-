import { runQualityGate } from "./qualityGate";

export type PreviewQaReport = {
  status: "passed" | "failed" | "warning";
  issues: string[];
  warnings: string[];
  validators: {
    typographyValidator: boolean;
    layoutValidator: boolean;
    screenshotUsageValidator: boolean;
    motionUsageValidator: boolean;
    semanticValidator: boolean;
    structureValidator: boolean;
  };
  qualityGate: ReturnType<typeof runQualityGate>;
  passed: boolean;
  errors: string[];
  checks: ReturnType<typeof runQualityGate>["checks"];
};

export function runPreviewGate(structure: Parameters<typeof runQualityGate>[0], qaPath: string): PreviewQaReport {
  const qualityGate = runQualityGate(structure, qaPath);
  const status: PreviewQaReport["status"] = !qualityGate.passed ? "failed" : qualityGate.warnings.length ? "warning" : "passed";

  const report: PreviewQaReport = {
    status,
    issues: qualityGate.errors,
    warnings: qualityGate.warnings,
    validators: {
      typographyValidator: qualityGate.checks.typography !== "failed",
      layoutValidator: qualityGate.checks.layout !== "failed",
      screenshotUsageValidator: qualityGate.checks.screenshotUsage !== "failed",
      motionUsageValidator: qualityGate.checks.motionUsage !== "failed",
      semanticValidator: qualityGate.checks.semantic !== "failed",
      structureValidator: qualityGate.checks.structure !== "failed",
    },
    qualityGate,
    passed: qualityGate.passed,
    errors: qualityGate.errors,
    checks: qualityGate.checks,
  };

  // Preserve the richer qualityGate schema as the authoritative QA file.
  return report;
}
