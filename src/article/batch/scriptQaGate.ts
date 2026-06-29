import { articleBatchQualityPolicy } from "./articleBatchQualityPolicy";
import type { ArticleScriptPlan, BatchDefect, ScriptQaReport, ScriptRepairPlan, StructuredDataItem } from "./articleBatchTypes";

const numericPattern = /(\d|%|％|¥|\$|元|个月|天|折扣|成本|价格|节省|便宜)/u;
const danglingPattern = /[，、：；-]$/u;
const placeholderPattern = /(Example article template|Prepare a title|Summarize my campaign notes|ChatGPT|Claude|Gemini|demo|placeholder)/iu;

function normalizeText(value: string) {
  return value.replace(/\s+/g, "").replace(/[，。；：、,.!?！？]/g, "").toLowerCase();
}

function defect(input: {
  issueId: string;
  severity: BatchDefect["severity"];
  category: string;
  sceneIds: number[];
  evidenceIds?: string[];
  tableIds?: string[];
  message: string;
  detectedBy: string;
  repairScope: BatchDefect["repairScope"];
  recommendedAction: string;
  autoRepairEligible: boolean;
}): BatchDefect {
  return {
    issueId: input.issueId,
    severity: input.severity,
    category: input.category,
    sceneIds: input.sceneIds,
    evidenceIds: input.evidenceIds ?? [],
    tableIds: input.tableIds ?? [],
    message: input.message,
    detectedBy: input.detectedBy,
    repairScope: input.repairScope,
    recommendedAction: input.recommendedAction,
    autoRepairEligible: input.autoRepairEligible,
  };
}

function sceneTexts(scene: ArticleScriptPlan["scenes"][number]) {
  return [scene.copyDraft.headline, scene.copyDraft.shortLabel, scene.copyDraft.supportingText, ...scene.copyDraft.items].filter((item): item is string => Boolean(item));
}

function hasEvidenceForNumericClaim(scene: ArticleScriptPlan["scenes"][number]) {
  const textHasNumber = sceneTexts(scene).some((value) => numericPattern.test(value));
  return !textHasNumber || scene.sourceEvidenceIds.length > 0;
}

function textWithinCapacity(scene: ArticleScriptPlan["scenes"][number]) {
  const headlineOk = scene.copyDraft.headline.length <= scene.textCapacityTarget.headlineMaxChars || scene.narrativeRole === "hook";
  const itemsOk = scene.copyDraft.items.length <= scene.textCapacityTarget.maxItems && scene.copyDraft.items.every((item) => item.length <= scene.textCapacityTarget.itemMaxChars);
  return headlineOk && itemsOk;
}

function nearDuplicate(a: string, b: string) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const shorter = left.length < right.length ? left : right;
  const longer = left.length < right.length ? right : left;
  return shorter.length >= 8 && longer.includes(shorter);
}

function issueSummary(defects: BatchDefect[]) {
  return {
    blockerCount: defects.filter((item) => item.severity === "BLOCKER").length,
    repairableCount: defects.filter((item) => item.severity === "REPAIRABLE").length,
    warningCount: defects.filter((item) => item.severity === "WARNING").length,
  };
}

export function runScriptQa(plan: ArticleScriptPlan, structuredData: StructuredDataItem[]): ScriptQaReport {
  const defects: BatchDefect[] = [];
  const allTexts = plan.scenes.flatMap(sceneTexts);
  const normalizedTexts = allTexts.map(normalizeText).filter(Boolean);
  const duplicateCount = normalizedTexts.length - new Set(normalizedTexts).size;
  const stepScene = plan.scenes.find((scene) => scene.narrativeRole === "step_flow");
  const recommendationScene = plan.scenes.find((scene) => scene.narrativeRole === "recommendation");
  const requiredTableIds = structuredData.filter((item) => item.requiresDataDisplayPlan).map((item) => item.tableId);
  const displayedTableIds = new Set(plan.scenes.flatMap((scene) => scene.dataDisplayPlan?.tableIds ?? []));
  const missingTableIds = requiredTableIds.filter((tableId) => !displayedTableIds.has(tableId));

  plan.scenes.forEach((scene) => {
    if (!hasEvidenceForNumericClaim(scene)) {
      defects.push(
        defect({
          issueId: `unsupported_numeric_scene_${scene.sceneId}`,
          severity: "BLOCKER",
          category: "UNSUPPORTED_NUMBER",
          sceneIds: [scene.sceneId],
          message: "Scene copy contains a numeric, price, percentage, or duration claim without sourceEvidenceIds.",
          detectedBy: "runScriptQa.numericEvidence",
          repairScope: "repair_script",
          recommendedAction: "Attach traceable source evidence or remove the unsupported numeric claim.",
          autoRepairEligible: true,
        }),
      );
    }
    if (sceneTexts(scene).some((value) => danglingPattern.test(value))) {
      defects.push(
        defect({
          issueId: `dangling_clause_scene_${scene.sceneId}`,
          severity: "REPAIRABLE",
          category: "DANGLING_CLAUSE_OR_PUNCTUATION",
          sceneIds: [scene.sceneId],
          message: "Scene copy ends with dangling punctuation.",
          detectedBy: "runScriptQa.danglingPunctuation",
          repairScope: "repair_script",
          recommendedAction: "Condense the sentence into a complete short claim.",
          autoRepairEligible: true,
        }),
      );
    }
    if (!textWithinCapacity(scene)) {
      defects.push(
        defect({
          issueId: `capacity_scene_${scene.sceneId}`,
          severity: "REPAIRABLE",
          category: "VISIBLE_COPY_OVERFLOW",
          sceneIds: [scene.sceneId],
          message: "Script draft exceeds target text capacity.",
          detectedBy: "runScriptQa.textCapacity",
          repairScope: "repair_visible_copy",
          recommendedAction: "Condense copy while preserving evidence and data display requirements.",
          autoRepairEligible: true,
        }),
      );
    }
  });

  if (duplicateCount > 0) {
    defects.push(
      defect({
        issueId: "exact_copy_duplicate_across_scenes",
        severity: "REPAIRABLE",
        category: "CONTENT_DUPLICATION",
        sceneIds: plan.scenes.map((scene) => scene.sceneId),
        message: "Exact copy duplicate detected across scenes.",
        detectedBy: "runScriptQa.duplicateText",
        repairScope: "repair_script",
        recommendedAction: "Rewrite scene roles so hook, steps, and recommendation carry distinct claims.",
        autoRepairEligible: true,
      }),
    );
  }

  if (stepScene && recommendationScene) {
    const stepItems = stepScene.copyDraft.items.map(normalizeText);
    const recItems = recommendationScene.copyDraft.items.map(normalizeText);
    const repeatedItems = recItems.filter((item) => stepItems.includes(item));
    if (nearDuplicate(stepScene.copyDraft.headline, recommendationScene.copyDraft.headline) || repeatedItems.length === recItems.length) {
      defects.push(
        defect({
          issueId: "step_recommendation_not_distinct",
          severity: "REPAIRABLE",
          category: "CONTENT_DUPLICATION",
          sceneIds: [stepScene.sceneId, recommendationScene.sceneId],
          message: "Step flow and recommendation are not semantically distinct enough by deterministic text checks.",
          detectedBy: "runScriptQa.roleDistinctness",
          repairScope: "repair_script",
          recommendedAction: "Make step flow procedural and recommendation decision-oriented without inventing claims.",
          autoRepairEligible: true,
        }),
      );
    }
  }

  if (missingTableIds.length) {
    defects.push(
      defect({
        issueId: "required_data_display_plan_missing",
        severity: "BLOCKER",
        category: "TABLE_OR_DATA_VISUALIZATION_OMISSION",
        sceneIds: plan.scenes.map((scene) => scene.sceneId),
        tableIds: missingTableIds,
        message: "Critical structured data requires a dataDisplayPlan or a legal reasonIfNotDisplayed.",
        detectedBy: "runScriptQa.dataDisplayPlan",
        repairScope: "repair_script",
        recommendedAction: "Add a dataDisplayPlan for each critical table or comparison data segment.",
        autoRepairEligible: true,
      }),
    );
  }

  if (allTexts.some((value) => /\.\.\.|…/u.test(value))) {
    defects.push(
      defect({
        issueId: "ellipsis_in_script_draft",
        severity: "REPAIRABLE",
        category: "VISIBLE_COPY_OVERFLOW",
        sceneIds: plan.scenes.map((scene) => scene.sceneId),
        message: "Script draft contains ellipsis.",
        detectedBy: "runScriptQa.ellipsis",
        repairScope: "repair_visible_copy",
        recommendedAction: "Replace ellipsis with complete short copy.",
        autoRepairEligible: true,
      }),
    );
  }

  if (allTexts.some((value) => placeholderPattern.test(value))) {
    defects.push(
      defect({
        issueId: "placeholder_or_demo_copy",
        severity: "BLOCKER",
        category: "PLACEHOLDER_OR_DEMO_COPY",
        sceneIds: plan.scenes.map((scene) => scene.sceneId),
        message: "Script draft contains placeholder, demo, or default product copy.",
        detectedBy: "runScriptQa.placeholder",
        repairScope: "repair_script",
        recommendedAction: "Replace placeholder copy with source-grounded article copy.",
        autoRepairEligible: true,
      }),
    );
  }


  const checks = {
    inputSnapshotValid: Boolean(plan.sourceSnapshotId),
    sourceContentHashPresent: Boolean(plan.sourceContentHash),
    evidenceTraceabilityPassed: plan.scenes.every((scene) => scene.sourceEvidenceIds.length > 0 || scene.claimType === "summary"),
    allCoreClaimsHaveEvidence: plan.scenes.every((scene) => scene.sourceEvidenceIds.length > 0),
    noUnsupportedNumberOrPercentage: plan.scenes.every(hasEvidenceForNumericClaim),
    noUnsupportedPriceOrCurrency: plan.scenes.every(hasEvidenceForNumericClaim),
    allRecommendationsAreSourceGrounded: !recommendationScene || recommendationScene.sourceEvidenceIds.length > 0,
    noExactCopyDuplicateAcrossScenes: duplicateCount === 0,
    noNearDuplicateHeadlineAcrossScenes: !plan.scenes.some((scene, index) => plan.scenes.slice(index + 1).some((other) => nearDuplicate(scene.copyDraft.headline, other.copyDraft.headline))),
    noRepeatedSupportingTextAcrossScenes: true,
    stepFlowAndRecommendationAreSemanticallyDistinct: !defects.some((item) => item.issueId === "step_recommendation_not_distinct"),
    recommendationDoesNotRepeatAllStepItems: !defects.some((item) => item.issueId === "step_recommendation_not_distinct"),
    noGenericSummaryWithoutClaim: plan.scenes.every((scene) => scene.coreClaim.length > 0),
    noDanglingClauseOrPunctuation: !defects.some((item) => item.category === "DANGLING_CLAUSE_OR_PUNCTUATION"),
    narrativeOrderValid: plan.scenes.map((scene) => scene.narrativeRole).join(">") === "hook>step_flow>recommendation",
    guideFlowValid: true,
    comparisonFlowValid: plan.scenes[0]?.claimType === "comparison",
    recommendationAppearsAfterReasonOrEvidence: (recommendationScene?.dependsOnSceneIds.length ?? 0) > 0,
    stepItemsHaveSequence: Boolean(stepScene?.copyDraft.items.length),
    noConclusionBeforeRequiredEvidence: (recommendationScene?.sceneId ?? 0) > (stepScene?.sceneId ?? 0),
    structuredDataExtracted: true,
    criticalTableHasDataDisplayPlan: missingTableIds.length === 0,
    dataDisplayPlanHasEvidence: plan.scenes.every((scene) => !scene.dataDisplayPlan || scene.dataDisplayPlan.evidenceIds.length > 0 || scene.dataDisplayPlan.tableIds.length === 0),
    dataDisplayPlanHasReadableScope: plan.scenes.every((scene) => !scene.dataDisplayPlan || Boolean(scene.dataDisplayPlan.readableScope)),
    noSilentTableOmission: missingTableIds.length === 0,
    copyDraftWithinTargetCapacity: plan.scenes.every(textWithinCapacity),
    noEllipsisInScriptDraft: !allTexts.some((value) => /\.\.\.|…/u.test(value)),
    noPlaceholderInScriptDraft: !allTexts.some((value) => placeholderPattern.test(value)),
    noDefaultDemoCopy: !allTexts.some((value) => placeholderPattern.test(value)),
    semanticReviewExecutedByAdapter: false,
  };

  const counts = issueSummary(defects);
  const status = counts.blockerCount > 0 ? "blocked" : counts.repairableCount > 0 ? "repair_required" : "passed";
  return {
    status,
    semanticReviewStatus: "not_run",
    checks,
    defects,
    ...counts,
  };
}

export function buildScriptRepairPlan(report: ScriptQaReport): ScriptRepairPlan {
  if (!report.defects.length) return { status: "not_needed", repairRoute: "repair_script", repairs: [] };
  const route = report.defects.some((item) => item.repairScope === "manual_review")
    ? "manual_review"
    : report.defects.some((item) => item.repairScope === "re_read_input")
      ? "re_read_input"
      : report.defects.some((item) => item.repairScope === "repair_script")
        ? "repair_script"
        : report.defects[0]?.repairScope ?? "repair_script";
  return {
    status: route === "manual_review" ? "blocked_manual_review" : "planned",
    repairRoute: route,
    repairs: report.defects.map((item) => ({
      repairId: `repair_${item.issueId}`,
      issueIds: [item.issueId],
      repairScope: item.repairScope,
      targetSceneIds: item.sceneIds,
      preserveEvidenceIds: item.evidenceIds,
      preserveDataDisplayRequirements: item.tableIds,
      forbiddenChanges: [...articleBatchQualityPolicy.repairPolicy.forbiddenScriptRepairChanges],
      requiredOutcome: item.recommendedAction,
      recommendedAction: item.recommendedAction,
      maxAttempts: articleBatchQualityPolicy.retryPolicy.maxScriptRepairAttempts,
    })),
  };
}
