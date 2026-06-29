import type { EvidenceItem } from "../types";
import type { ArticleScriptPlan, BatchDefect, ScriptIssueSeverity, ScriptRepairScope, StructuredDataItem } from "./articleBatchTypes";
import type { InputIntegrityReport } from "./inputIntegrityGate";
import type { SemanticReviewIssue, SemanticReviewResult } from "./semanticReviewSchema";

export type SemanticIssueRoutingDecision = {
  issueId: string;
  originalCategory: string;
  originalSeverity: ScriptIssueSeverity;
  originalRepairScope: ScriptRepairScope;
  effectiveCategory: string;
  effectiveSeverity: ScriptIssueSeverity;
  effectiveRepairScope: ScriptRepairScope;
  routingDecision: "kept_original_route" | "enforced_input_integrity_route" | "reclassified_after_deterministic_evidence_check" | "reclassified_data_display_layer";
  routingEvidence: Record<string, boolean | string | number>;
};

export type SemanticIssueRoutingGuardResult = {
  result: SemanticReviewResult;
  decisions: SemanticIssueRoutingDecision[];
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function hasDuplicateRequiredFacts(scene: ArticleScriptPlan["scenes"][number] | undefined) {
  if (!scene) return false;
  const facts = scene.requiredFacts.map(normalizeText).filter(Boolean);
  return facts.length !== new Set(facts).size;
}

function sceneTexts(scene: ArticleScriptPlan["scenes"][number] | undefined) {
  if (!scene) return [];
  return [scene.coreClaim, scene.copyDraft.headline, scene.copyDraft.shortLabel, scene.copyDraft.supportingText, ...scene.copyDraft.items].filter((item): item is string => Boolean(item));
}

function evidenceResolvable(evidence: EvidenceItem | undefined) {
  return Boolean(evidence?.sourceExcerpt && evidence.sourceLocation?.sectionId && (typeof evidence.sourceLocation.paragraphIndex === "number" || typeof evidence.sourceLocation.listItemIndex === "number"));
}

function issueMentionsScriptAlignment(issue: SemanticReviewIssue) {
  const text = `${issue.message} ${issue.rationale} ${issue.recommendedAction}`.toLowerCase();
  return ["requiredfacts", "sourceevidenceids", "copydraft", "datadisplayplan", "duplicate", "mismatch", "align"].some((term) => text.includes(term));
}

function hasCopyFactMismatch(scene: ArticleScriptPlan["scenes"][number] | undefined, evidences: EvidenceItem[]) {
  if (!scene || !evidences.length) return false;
  const factText = scene.requiredFacts.map(normalizeText).join("|");
  const copyText = sceneTexts(scene).map(normalizeText).join("|");
  const missingFromFacts = evidences.some((evidence) => !factText.includes(normalizeText(evidence.claim)));
  const missingFromCopy = evidences.some((evidence) => !copyText.includes(normalizeText(evidence.claim)));
  return missingFromFacts || missingFromCopy || hasDuplicateRequiredFacts(scene);
}

function dataDisplayAlreadyPlanned(scene: ArticleScriptPlan["scenes"][number] | undefined, issue: SemanticReviewIssue) {
  if (!scene?.dataDisplayPlan) return false;
  const plannedEvidence = new Set(scene.dataDisplayPlan.evidenceIds);
  const plannedTables = new Set(scene.dataDisplayPlan.tableIds);
  const evidenceCovered = issue.evidenceIds.length === 0 || issue.evidenceIds.every((id) => plannedEvidence.has(id) || scene.sourceEvidenceIds.includes(id));
  const tablesCovered = issue.tableIds.length === 0 || issue.tableIds.every((id) => plannedTables.has(id));
  return evidenceCovered && tablesCovered;
}

export function runSemanticIssueRoutingGuard(input: {
  semanticReview: SemanticReviewResult;
  scriptPlan: ArticleScriptPlan;
  evidenceMap: EvidenceItem[];
  structuredDataInventory: StructuredDataItem[];
  inputIntegrityReport: InputIntegrityReport;
}): SemanticIssueRoutingGuardResult {
  const evidenceById = new Map(input.evidenceMap.map((item) => [item.evidenceId, item]));
  const integrityByEvidenceId = new Map(input.inputIntegrityReport.evidenceResults.map((item) => [item.evidenceId, item]));
  const tableIds = new Set(input.structuredDataInventory.map((item) => item.tableId));
  const decisions: SemanticIssueRoutingDecision[] = [];

  const issues = input.semanticReview.issues.map((issue) => {
    const scenes = issue.sceneIds.map((sceneId) => input.scriptPlan.scenes.find((scene) => String(scene.sceneId) === sceneId)).filter(Boolean);
    const issueEvidence = issue.evidenceIds.map((id) => evidenceById.get(id));
    const evidenceIdsExist = issueEvidence.every(Boolean);
    const sourceLocationsResolvable = issueEvidence.every(evidenceResolvable);
    const evidenceIntegrityPassed = issue.evidenceIds.every((id) => integrityByEvidenceId.get(id)?.status !== "failed");
    const tableIdsExist = issue.tableIds.every((id) => tableIds.has(id));
    const canonicalSourceReproducible = input.inputIntegrityReport.status === "passed" && issue.evidenceIds.every((id) => integrityByEvidenceId.get(id)?.checks.evidenceExcerptReproducibleFromCanonicalSource !== false);
    const mismatchDetectedBetweenRequiredFactsAndCopyDraft = scenes.some((scene) => hasCopyFactMismatch(scene, issueEvidence.filter((item): item is EvidenceItem => Boolean(item))));
    const dataDisplayPlanContainsRequiredMetric = scenes.some((scene) => dataDisplayAlreadyPlanned(scene, issue));

    const baseEvidence = {
      inputIntegrityStatus: input.inputIntegrityReport.status,
      evidenceIdsExist,
      sourceLocationsResolvable,
      evidenceIntegrityPassed,
      canonicalSourceReproducible,
      tableIdsExist,
      mismatchDetectedBetweenRequiredFactsAndCopyDraft,
      dataDisplayPlanContainsRequiredMetric,
    };

    let effective = issue;
    let routingDecision: SemanticIssueRoutingDecision["routingDecision"] = "kept_original_route";

    if (
      issue.category === "INPUT_INTEGRITY" &&
      input.inputIntegrityReport.status === "passed" &&
      evidenceIdsExist &&
      sourceLocationsResolvable &&
      evidenceIntegrityPassed &&
      canonicalSourceReproducible &&
      (mismatchDetectedBetweenRequiredFactsAndCopyDraft || issueMentionsScriptAlignment(issue))
    ) {
      routingDecision = "reclassified_after_deterministic_evidence_check";
      effective = {
        ...issue,
        severity: "REPAIRABLE",
        category: "SCRIPT_EVIDENCE_ALIGNMENT" as SemanticReviewIssue["category"],
        repairScope: "repair_script",
        recommendedAction: "Repair script-level requiredFacts, sourceEvidenceIds, copyDraft fact binding, and dataDisplayPlan alignment using existing evidence only.",
        autoRepairEligible: true,
      };
    } else if (issue.category === "INPUT_INTEGRITY") {
      routingDecision = issue.repairScope === "re_read_input" && issue.severity === "BLOCKER" ? "kept_original_route" : "enforced_input_integrity_route";
      effective = {
        ...issue,
        severity: "BLOCKER",
        repairScope: "re_read_input",
        autoRepairEligible: true,
      };
    } else if (issue.category === "DATA_DISPLAY_OMISSION" && !dataDisplayPlanContainsRequiredMetric) {
      routingDecision = "reclassified_data_display_layer";
      effective = {
        ...issue,
        severity: "REPAIRABLE",
        category: "SCRIPT_DATA_DISPLAY_OMISSION" as SemanticReviewIssue["category"],
        repairScope: "repair_script",
        autoRepairEligible: true,
      };
    }

    decisions.push({
      issueId: issue.issueId,
      originalCategory: issue.category,
      originalSeverity: issue.severity,
      originalRepairScope: issue.repairScope,
      effectiveCategory: effective.category,
      effectiveSeverity: effective.severity,
      effectiveRepairScope: effective.repairScope,
      routingDecision,
      routingEvidence: baseEvidence,
    });
    return effective;
  });

  return {
    result: {
      ...input.semanticReview,
      issues,
    },
    decisions,
  };
}

export function routingDecisionForDefect(decision?: SemanticIssueRoutingDecision): BatchDefect["routingGuard"] {
  if (!decision || (decision.routingDecision === "kept_original_route" && decision.originalCategory === decision.effectiveCategory && decision.originalRepairScope === decision.effectiveRepairScope && decision.originalSeverity === decision.effectiveSeverity)) return undefined;
  return {
    originalCategory: decision.originalCategory,
    originalSeverity: decision.originalSeverity,
    originalRepairScope: decision.originalRepairScope,
    effectiveCategory: decision.effectiveCategory,
    effectiveSeverity: decision.effectiveSeverity,
    effectiveRepairScope: decision.effectiveRepairScope,
    routingDecision: decision.routingDecision,
    routingEvidence: decision.routingEvidence,
  };
}
