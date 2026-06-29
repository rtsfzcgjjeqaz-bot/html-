import type { ArticleScriptPlan, ScriptIssueSeverity, ScriptRepairScope, StructuredDataItem } from "./articleBatchTypes";
import type { EvidenceItem } from "../types";

export const semanticReviewCategories = [
  "COPY_DUPLICATION",
  "ROLE_REDUNDANCY",
  "NARRATIVE_LOGIC",
  "GENERIC_SUMMARY",
  "DATA_DISPLAY_OMISSION",
  "INCOMPLETE_COPY",
  "TEXT_CAPACITY",
  "UNSUPPORTED_CLAIM",
  "EVIDENCE_TRACEABILITY",
  "CONTRADICTORY_SOURCE",
  "INPUT_INTEGRITY",
] as const;

export type SemanticReviewCategory = (typeof semanticReviewCategories)[number];
export type SemanticReviewStatus = "passed" | "issues_found" | "provider_unavailable" | "response_invalid";

export type SemanticReviewIssue = {
  issueId: string;
  severity: ScriptIssueSeverity;
  category: SemanticReviewCategory;
  sceneIds: string[];
  evidenceIds: string[];
  tableIds: string[];
  message: string;
  rationale: string;
  repairScope: ScriptRepairScope;
  recommendedAction: string;
  autoRepairEligible: boolean;
};

export type SemanticReviewResult = {
  reviewStatus: SemanticReviewStatus;
  reviewer: {
    providerId?: string;
    modelId?: string;
    reviewVersion: string;
  };
  issues: SemanticReviewIssue[];
};

const severities = ["BLOCKER", "REPAIRABLE", "WARNING"];
const repairScopes = ["re_read_input", "repair_script", "repair_visible_copy", "replan_visual", "manual_review", "rerender_output"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateSemanticReviewResult(input: {
  value: unknown;
  scriptPlan: ArticleScriptPlan;
  evidenceMap: EvidenceItem[];
  structuredDataInventory: StructuredDataItem[];
}): { valid: true; result: SemanticReviewResult } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  const value = input.value;
  if (!isRecord(value)) return { valid: false, errors: ["semantic review response is not an object"] };
  const reviewStatus = value.reviewStatus;
  if (!["passed", "issues_found", "provider_unavailable", "response_invalid"].includes(String(reviewStatus))) errors.push("reviewStatus is invalid");
  if (!isRecord(value.reviewer)) errors.push("reviewer is missing");
  if (!Array.isArray(value.issues)) errors.push("issues must be an array");

  const sceneIds = new Set(input.scriptPlan.scenes.map((scene) => String(scene.sceneId)));
  const evidenceIds = new Set(input.evidenceMap.map((item) => item.evidenceId));
  const tableIds = new Set(input.structuredDataInventory.map((item) => item.tableId));

  const issues = Array.isArray(value.issues) ? value.issues : [];
  issues.forEach((issue, index) => {
    if (!isRecord(issue)) {
      errors.push(`issue ${index} is not an object`);
      return;
    }
    if (!issue.issueId || typeof issue.issueId !== "string") errors.push(`issue ${index} has invalid issueId`);
    if (!severities.includes(String(issue.severity))) errors.push(`issue ${index} has invalid severity`);
    if (!semanticReviewCategories.includes(issue.category as SemanticReviewCategory)) errors.push(`issue ${index} has invalid category`);
    if (!stringArray(issue.sceneIds)) errors.push(`issue ${index} sceneIds must be string[]`);
    if (!stringArray(issue.evidenceIds)) errors.push(`issue ${index} evidenceIds must be string[]`);
    if (!stringArray(issue.tableIds)) errors.push(`issue ${index} tableIds must be string[]`);
    if (stringArray(issue.sceneIds) && issue.sceneIds.some((sceneId) => !sceneIds.has(sceneId))) errors.push(`issue ${index} references unknown sceneId`);
    if (stringArray(issue.evidenceIds) && issue.evidenceIds.some((evidenceId) => !evidenceIds.has(evidenceId))) errors.push(`issue ${index} references unknown evidenceId`);
    if (stringArray(issue.tableIds) && issue.tableIds.some((tableId) => !tableIds.has(tableId))) errors.push(`issue ${index} references unknown tableId`);
    if (!issue.message || typeof issue.message !== "string") errors.push(`issue ${index} has invalid message`);
    if (!issue.rationale || typeof issue.rationale !== "string") errors.push(`issue ${index} has invalid rationale`);
    if (!repairScopes.includes(String(issue.repairScope))) errors.push(`issue ${index} has invalid repairScope`);
    if (!issue.recommendedAction || typeof issue.recommendedAction !== "string") errors.push(`issue ${index} has invalid recommendedAction`);
    if (typeof issue.autoRepairEligible !== "boolean") errors.push(`issue ${index} has invalid autoRepairEligible`);
  });

  if (errors.length) return { valid: false, errors };
  return { valid: true, result: value as SemanticReviewResult };
}
