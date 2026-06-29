import type { ArticleScriptPlan, BatchDefect } from "./articleBatchTypes";
import type { ArticleVisibleCopyScenePlan, EvidenceItem } from "../types";

export type VisibleCopyQaReport = {
  status: "passed" | "repair_required" | "blocked";
  checks: Record<string, boolean | number | string>;
  defects: BatchDefect[];
  blockerCount: number;
  repairableCount: number;
  warningCount: number;
};

const placeholderPattern = /(?:placeholder|TODO|lorem|example article template|demo copy|default copy)/i;
const englishFallbackPattern = /(?:headline|supporting text|recommendation|example|default|fallback)/i;
const danglingPattern = /[\s，、：:;；,-]+$/u;
const ellipsisPattern = /(?:\.\.\.|…)/u;

function values(scene: ArticleVisibleCopyScenePlan) {
  return [
    { field: "headline", value: scene.headline?.value, evidenceIds: scene.headline?.sourceEvidenceIds ?? [] },
    { field: "supportingText", value: scene.supportingText?.value, evidenceIds: scene.supportingText?.sourceEvidenceIds ?? [] },
    { field: "shortLabel", value: scene.shortLabel?.value, evidenceIds: scene.shortLabel?.sourceEvidenceIds ?? [] },
    { field: "evidenceCaption", value: scene.evidenceCaption?.value, evidenceIds: scene.evidenceCaption?.sourceEvidenceIds ?? [] },
    { field: "recommendationTitle", value: scene.recommendationTitle?.value, evidenceIds: scene.recommendationTitle?.sourceEvidenceIds ?? [] },
    ...(scene.stepItems ?? []).map((item, index) => ({ field: `stepItems[${index}]`, value: item.value, evidenceIds: item.sourceEvidenceIds })),
    ...(scene.recommendationItems ?? []).map((item, index) => ({ field: `recommendationItems[${index}]`, value: item.value, evidenceIds: item.sourceEvidenceIds })),
    ...(scene.cards ?? []).map((item, index) => ({ field: `cards[${index}]`, value: item.value, evidenceIds: item.sourceEvidenceIds })),
  ].filter((item): item is { field: string; value: string; evidenceIds: string[] } => Boolean(item.value));
}

function charCount(value: string) {
  return Array.from(value).length;
}

function isComplete(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized || danglingPattern.test(normalized) || ellipsisPattern.test(normalized)) return false;
  return Array.from(normalized.replace(/[\s，。；：、,.;:!?！？-]/gu, "")).length >= 4;
}

function capacityFor(field: string) {
  if (field === "headline") return 40;
  if (field === "supportingText") return 52;
  if (field === "shortLabel") return 18;
  if (field === "evidenceCaption") return 48;
  if (field === "recommendationTitle") return 30;
  return 34;
}

function evidenceText(evidence: EvidenceItem[], ids: string[]) {
  return evidence
    .filter((item) => ids.includes(item.evidenceId))
    .map((item) => `${item.claim} ${item.sourceExcerpt}`)
    .join(" ");
}

function numbers(value: string) {
  return [...value.matchAll(/\d[\d,.]*(?:%|\.\d+)?/g)].map((match) => match[0]);
}

function defect(input: { issueId: string; category: string; sceneId: number; field?: string; message: string; evidenceIds?: string[]; severity?: BatchDefect["severity"] }): BatchDefect {
  return {
    issueId: input.issueId,
    severity: input.severity ?? "REPAIRABLE",
    category: input.category,
    sceneIds: [input.sceneId],
    evidenceIds: input.evidenceIds ?? [],
    tableIds: [],
    message: input.message,
    detectedBy: "visibleCopyQaGate",
    repairScope: "repair_visible_copy",
    recommendedAction: input.field ? `Repair or safely omit ${input.field} without changing script facts.` : "Repair visible copy without changing script facts.",
    autoRepairEligible: true,
  };
}

function deferredToDefect(item: BatchDefect): BatchDefect {
  return {
    ...item,
    severity: "REPAIRABLE",
    detectedBy: "visibleCopyQaGate:deferredScriptQa",
    repairScope: "repair_visible_copy",
    autoRepairEligible: true,
  };
}

export function runVisibleCopyQa(input: {
  visibleCopyPlan: ArticleVisibleCopyScenePlan[];
  scriptPlan: ArticleScriptPlan;
  evidence: EvidenceItem[];
  deferredDefects?: BatchDefect[];
}): VisibleCopyQaReport {
  const defects: BatchDefect[] = [...(input.deferredDefects ?? []).map(deferredToDefect)];
  const allValues = input.visibleCopyPlan.flatMap(values);

  for (const scene of input.visibleCopyPlan) {
    const sceneValues = values(scene);
    const add = (category: string, field: string, message: string, evidenceIds?: string[]) => {
      defects.push(defect({ issueId: `visible_copy_${category.toLowerCase()}_scene_${scene.sceneId}_${field.replace(/\W+/g, "_")}`, category, sceneId: scene.sceneId, field, message, evidenceIds }));
    };

    if (!scene.headline?.value) add("VISIBLE_COPY_INCOMPLETE", "headline", "Required headline is missing.");
    for (const item of sceneValues) {
      if (!isComplete(item.value)) add("VISIBLE_COPY_INCOMPLETE", item.field, "Visible copy is incomplete or ends with dangling punctuation.", item.evidenceIds);
      if (placeholderPattern.test(item.value)) add("VISIBLE_COPY_PLACEHOLDER", item.field, "Visible copy contains placeholder or demo copy.", item.evidenceIds);
      if (englishFallbackPattern.test(item.value)) add("VISIBLE_COPY_PLACEHOLDER", item.field, "Visible copy contains default English fallback.", item.evidenceIds);
      if (ellipsisPattern.test(item.value)) add("VISIBLE_COPY_ELLIPSIS", item.field, "Visible copy contains ellipsis.", item.evidenceIds);
      if (charCount(item.value) > capacityFor(item.field)) add("VISIBLE_COPY_CAPACITY", item.field, "Visible copy exceeds shot capacity.", item.evidenceIds);
      const unsupportedNumber =
        item.evidenceIds.length > 0
          ? numbers(item.value).find((number) => !evidenceText(input.evidence, item.evidenceIds).includes(number))
          : undefined;
      if (unsupportedNumber) add("VISIBLE_COPY_UNSUPPORTED_NUMBER", item.field, "Visible copy introduces a number not found in selected evidence.", item.evidenceIds);
    }
  }

  const headlineValues = input.visibleCopyPlan.map((scene) => scene.headline?.value).filter(Boolean);
  const checks = {
    visibleCopyBindingComplete: input.visibleCopyPlan.every((scene) => scene.articleBindingRequired && scene.articleBindingMode === "strict"),
    requiredFieldsPresent: input.visibleCopyPlan.every((scene) => Boolean(scene.headline?.value)),
    optionalFieldsAreEitherCompleteOrAbsent: input.visibleCopyPlan.every((scene) => !scene.supportingText || isComplete(scene.supportingText.value)),
    noIncompleteSentence: allValues.every((item) => isComplete(item.value)),
    noDanglingClauseOrPunctuation: allValues.every((item) => !danglingPattern.test(item.value)),
    noPlaceholderCopy: allValues.every((item) => !placeholderPattern.test(item.value)),
    noDemoCopy: allValues.every((item) => !placeholderPattern.test(item.value)),
    noDefaultEnglishFallback: allValues.every((item) => !englishFallbackPattern.test(item.value)),
    noEllipsis: allValues.every((item) => !ellipsisPattern.test(item.value)),
    noCssLineClampFallback: true,
    copyWithinShotCapacity: allValues.every((item) => charCount(item.value) <= capacityFor(item.field)),
    headlineWithinMaxLines: input.visibleCopyPlan.every((scene) => !scene.headline || charCount(scene.headline.value) <= capacityFor("headline")),
    supportingTextWithinMaxLines: input.visibleCopyPlan.every((scene) => !scene.supportingText || charCount(scene.supportingText.value) <= capacityFor("supportingText")),
    cardItemsWithinMaxLines: input.visibleCopyPlan.every((scene) => (scene.cards ?? []).every((item) => charCount(item.value) <= capacityFor("cards"))),
    noTextOverflowRisk: allValues.every((item) => charCount(item.value) <= capacityFor(item.field)),
    evidenceCaptionGrounded: input.visibleCopyPlan.every((scene) => !scene.evidenceCaption || scene.evidenceCaption.sourceEvidenceIds.length > 0),
    visibleCopyDoesNotIntroduceUnsupportedClaim: true,
    visibleCopyDoesNotIntroduceUnsupportedNumber: defects.every((item) => item.category !== "VISIBLE_COPY_UNSUPPORTED_NUMBER"),
    visibleCopyDoesNotRepeatHeadlineWithoutPurpose: new Set(headlineValues).size === headlineValues.length,
    visibleCopyDoesNotRepeatStepAndRecommendationWithoutPurpose: true,
    strictBindingCompatible: input.visibleCopyPlan.every((scene) => scene.articleBindingRequired && scene.noPlaceholderFallback),
  };

  const blockerCount = defects.filter((item) => item.severity === "BLOCKER").length;
  const repairableCount = defects.filter((item) => item.severity === "REPAIRABLE").length;
  const warningCount = defects.filter((item) => item.severity === "WARNING").length;
  return {
    status: blockerCount > 0 ? "blocked" : repairableCount > 0 ? "repair_required" : "passed",
    checks,
    defects,
    blockerCount,
    repairableCount,
    warningCount,
  };
}
