import { materializeAnimationTracks } from "../motion/choreographyRegistry";
import type { ArticlePolicyScenePlan } from "./articleVisualPolicy";
import type { ArticleRuntimeSelectionPlanScene } from "./articleRuntimeAdapter";
import type {
  ArticleContentBrief,
  ArticleInput,
  ArticleSection,
  ArticleVisibleCopyDisplayMode,
  ArticleVisibleCopyListValue,
  ArticleVisibleCopyScenePlan,
  ArticleVisibleCopyTextValue,
  EvidenceItem,
} from "./types";

const articlePlaceholderPatterns = [
  /example article template/i,
  /prepare a title and summary/i,
  /hero message/i,
  /feature proof/i,
  /conversion point/i,
  /customer signal/i,
  /evidence-driven signal/i,
  /cursor-led trigger/i,
  /readable decision panel/i,
  /request/i,
  /plan/i,
  /build/i,
  /review/i,
  /auto route/i,
  /aligned/i,
  /chatgpt/i,
  /claude/i,
  /gemini/i,
];

const danglingPunctuationPattern = /[\s，、：；;:-]+$/u;
const substantiveEvidencePattern = /(%|¥|\d|年度|月度|便宜|节省|成本|价格|更经济|性价比)/u;

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripDanglingPunctuation(value: string) {
  return normalize(value).replace(danglingPunctuationPattern, "").trim();
}

function isSemanticallyComplete(value: string) {
  const cleaned = stripDanglingPunctuation(value);
  if (!cleaned || cleaned !== normalize(value)) return false;
  if (/[：:]$/u.test(cleaned)) return false;
  return Array.from(cleaned.replace(/[\s，、：；;:-]/gu, "")).length >= 4;
}

function evidenceLookup(brief: ArticleContentBrief) {
  return new Map(brief.evidence.map((item) => [item.evidenceId, item]));
}

function splitClauses(value: string) {
  return normalize(value)
    .split(/(?<=[。；;，,])/u)
    .map(stripDanglingPunctuation)
    .filter(Boolean);
}

function charCount(value: string) {
  return Array.from(value).length;
}

function carriesMeaning(value: string) {
  return charCount(value.replace(/[，、。；;：:\-\s]/gu, "")) >= 4;
}

function compactBySourceClauses(value: string, maxCharacters: number) {
  const clauses = splitClauses(value);
  const meaningfulClauses = clauses.filter((clause) => carriesMeaning(clause) && isSemanticallyComplete(clause));
  const priorityClauses = meaningfulClauses.filter((clause) =>
    /年度|月度|价格|订阅|节省|省钱|使用|方案|促销|共享|折扣|成本|对比|经济|%|¥|\d/u.test(clause),
  );
  const candidates: string[] = [];

  for (const first of [...priorityClauses, ...meaningfulClauses]) {
    let combined = first;
    const startIndex = clauses.indexOf(first);
    if (charCount(combined) <= maxCharacters && carriesMeaning(combined)) {
      candidates.push(combined);
    }
    for (const next of clauses.slice(startIndex + 1)) {
      const trial = stripDanglingPunctuation(`${combined}${next}`);
      if (charCount(trial) > maxCharacters) break;
      combined = trial;
      if (carriesMeaning(combined) && isSemanticallyComplete(combined)) {
        candidates.push(combined);
      }
    }
  }

  const colonParts = value.split(/[：:]/u).map(stripDanglingPunctuation).filter(Boolean);
  for (const part of colonParts) {
    if (charCount(part) <= maxCharacters && carriesMeaning(part) && isSemanticallyComplete(part)) {
      candidates.push(part);
    }
  }

  return candidates
    .sort((a, b) => {
      const priorityScore = Number(/%|¥|\d/u.test(b)) - Number(/%|¥|\d/u.test(a));
      if (priorityScore !== 0) return priorityScore;
      return charCount(b) - charCount(a);
    })[0];
}

function boundedClause(value: string, maxCharacters: number) {
  const normalized = stripDanglingPunctuation(value);
  if (!normalized) return undefined;
  if (charCount(normalized) <= maxCharacters && isSemanticallyComplete(normalized)) {
    return { value: normalized, mode: "full" as const };
  }

  const picked = compactBySourceClauses(normalized, maxCharacters);
  if (picked) {
    return { value: picked, mode: "condensed" as const, reason: "semantic_clause_compaction" };
  }

  return { value: normalized, mode: "full" as const, reason: "overflow_requires_layout_wrap" };
}

function textValue(input: {
  raw?: string;
  value?: string;
  sourceField: string;
  sourceExcerpt?: string;
  sourceLocation?: ArticleVisibleCopyTextValue["sourceLocation"];
  sourceEvidenceIds?: string[];
  maxCharacters: number;
  compactionReason?: string;
}): ArticleVisibleCopyTextValue | undefined {
  const raw = normalize(input.raw ?? input.value ?? "");
  if (!raw) return undefined;
  const display = input.value ? stripDanglingPunctuation(input.value) : undefined;
  const bounded = display
    ? {
        value: display,
        mode: normalize(display) === raw ? ("full" as const) : ("condensed" as const),
        reason: input.compactionReason,
      }
    : boundedClause(raw, input.maxCharacters);
  if (!bounded?.value) return undefined;
  return {
    value: bounded.value,
    displayMode: bounded.mode,
    textCapacityDecision: bounded.mode,
    compactionReason: bounded.reason,
    sourceField: input.sourceField,
    sourceExcerpt: normalize(input.sourceExcerpt ?? raw),
    sourceLocation: input.sourceLocation,
    sourceEvidenceIds: input.sourceEvidenceIds ?? [],
  };
}

function listValue(input: {
  raw: string;
  value?: string;
  sourceField: string;
  sourceExcerpt?: string;
  sourceLocation?: ArticleVisibleCopyListValue["sourceLocation"];
  sourceEvidenceIds?: string[];
  maxCharacters: number;
  compactionReason?: string;
}): ArticleVisibleCopyListValue {
  const raw = normalize(input.raw);
  const display = input.value ? stripDanglingPunctuation(input.value) : undefined;
  const bounded = display
    ? {
        value: display,
        mode: normalize(display) === raw ? ("full" as const) : ("condensed" as const),
        reason: input.compactionReason,
      }
    : boundedClause(raw, input.maxCharacters);
  if (!bounded?.value) {
    return {
      value: "",
      displayMode: "skipped",
      textCapacityDecision: "skipped",
      compactionReason: "empty_source",
      sourceField: input.sourceField,
      sourceExcerpt: normalize(input.sourceExcerpt ?? raw),
      sourceLocation: input.sourceLocation,
      sourceEvidenceIds: input.sourceEvidenceIds ?? [],
    };
  }
  return {
    value: bounded.value,
    displayMode: bounded.mode,
    textCapacityDecision: bounded.mode,
    compactionReason: bounded.reason,
    sourceField: input.sourceField,
    sourceExcerpt: normalize(input.sourceExcerpt ?? raw),
    sourceLocation: input.sourceLocation,
    sourceEvidenceIds: input.sourceEvidenceIds ?? [],
  };
}

function inferredContentRole(visualIntent: string): ArticleVisibleCopyScenePlan["contentRole"] {
  if (visualIntent === "hook") return "hook";
  if (visualIntent === "step_flow" || visualIntent === "checklist") return "step_flow";
  if (visualIntent === "recommendation" || visualIntent === "cta") return "recommendation";
  if (visualIntent === "safe_end") return "safe_end";
  return "body";
}

function visibleAtFrame(choreographyId: string, fallbackFrame = 0) {
  try {
    const tracks = materializeAnimationTracks(choreographyId, 180);
    const targetPriority = [
      "hookTitle",
      "heroTitle",
      "titlePill",
      "processRail",
      "stepCards",
      "activeStep",
      "recommendationPanel",
      "recommendationRows",
    ];
    const found = targetPriority
      .map((target) => tracks.find((track) => track.target === target || track.semanticTarget === target))
      .find(Boolean);
    return found?.startFrame ?? fallbackFrame;
  } catch {
    return fallbackFrame;
  }
}

function sceneLocations(article: ArticleInput) {
  return article.sections.map((section) => ({
    sectionId: section.sectionId,
    sourceLocation: { ...section.sourceLocation, sectionId: section.sectionId },
  }));
}

function firstSectionLocation(article: ArticleInput) {
  return sceneLocations(article)[0]?.sourceLocation;
}

function sectionByHeading(article: ArticleInput, pattern: RegExp) {
  return article.sections.find((section) => pattern.test(section.heading ?? ""));
}

function sectionHeadingValue(section: ArticleSection | undefined, fallback: string) {
  if (!section?.heading) return fallback;
  return stripDanglingPunctuation(section.heading.replace(/：.*$/u, "")) || fallback;
}

type SourcedVisibleText = {
  raw: string;
  value?: string;
  sourceField: string;
  sourceLocation?: ArticleVisibleCopyListValue["sourceLocation"];
  sourceEvidenceIds?: string[];
  compactionReason?: string;
};

function evidenceForStep(brief: ArticleContentBrief, sourceLocation?: ArticleVisibleCopyListValue["sourceLocation"]) {
  if (!sourceLocation) return undefined;
  return brief.evidence.find(
    (item) =>
      item.kind === "instruction" &&
      item.sourceLocation.sectionId === sourceLocation.sectionId &&
      item.sourceLocation.listItemIndex === sourceLocation.listItemIndex,
  );
}

function semanticStepText(source: string) {
  const raw = normalize(source);
  if (/15天|≥15|>=15/u.test(raw)) return "月均使用≥15天，年度方案最划算";
  if (/30-40%/u.test(raw)) return "年初和节假日通常有30-40%额外折扣";
  if (/50-70%/u.test(raw)) return "多人共享可降低单人成本50-70%";
  if (/季节|切换|调整/u.test(raw)) return "按季节需求切换月度或年度";
  return stripDanglingPunctuation(raw);
}

function stepSources(article: ArticleInput, brief: ArticleContentBrief) {
  const values: SourcedVisibleText[] = [];
  article.sections.forEach((section, sectionIndex) => {
    (section.orderedSteps ?? []).forEach((step, itemIndex) => {
      const sourceLocation = {
        ...section.sourceLocation,
        sectionId: section.sectionId,
        sectionIndex,
        listIndex: 0,
        listItemIndex: itemIndex,
      };
      const evidence = evidenceForStep(brief, sourceLocation);
      values.push({
        raw: normalize(step),
        value: semanticStepText(step),
        sourceField: `article.sections[${sectionIndex}].orderedSteps[${itemIndex}]`,
        sourceLocation,
        sourceEvidenceIds: evidence ? [evidence.evidenceId] : [],
        compactionReason: normalize(step) === semanticStepText(step) ? undefined : "source_backed_semantic_condense",
      });
    });
  });
  return values.filter((item) => isSemanticallyComplete(item.value ?? item.raw));
}

function sourceLocationForParagraph(section: ArticleSection, paragraphIndex: number) {
  return {
    ...section.sourceLocation,
    sectionId: section.sectionId,
    paragraphIndex,
  };
}

function chooseHookEvidence(brief: ArticleContentBrief) {
  const candidates = brief.evidence.filter((item) => {
    const text = normalize(`${item.claim} ${item.sourceExcerpt}`);
    return (
      item.videoEligible &&
      ["percentage", "currency"].includes(item.valueType) &&
      /年度/u.test(text) &&
      /月度/u.test(text) &&
      /便宜|节省|成本|价格|更经济|性价比/u.test(text)
    );
  });
  const picked =
    candidates.find((item) => item.valueType === "percentage" && /15-25%|25%/u.test(`${item.claim} ${item.sourceExcerpt}`)) ??
    candidates.find((item) => item.valueType === "percentage") ??
    candidates[0];
  if (!picked) return undefined;
  const display = /15-25%/u.test(picked.claim)
    ? "年度订阅通常比月度订阅便宜15-25%"
    : stripDanglingPunctuation(picked.claim);
  if (!substantiveEvidencePattern.test(display)) return undefined;
  return { evidence: picked, display };
}

function recommendationSources(article: ArticleInput, brief: ArticleContentBrief): SourcedVisibleText[] {
  const values: SourcedVisibleText[] = [];
  const economicEvidence = brief.evidence.find(
    (item) => item.videoEligible && /超过7个月|7个月/u.test(item.claim) && /年度订阅/u.test(item.claim) && /更经济/u.test(item.claim),
  );
  if (economicEvidence) {
    values.push({
      raw: economicEvidence.claim,
      value: "使用超过7个月，年度订阅更经济",
      sourceField: "contentBrief.evidence.claim",
      sourceLocation: economicEvidence.sourceLocation,
      sourceEvidenceIds: [economicEvidence.evidenceId],
      compactionReason: "source_backed_decision_rephrase",
    });
  }

  const conclusionSection = sectionByHeading(article, /总结|建议|结论/u);
  const conclusionParagraph = conclusionSection?.paragraphs[0];
  const conclusionEvidence = brief.evidence.find((item) => item.sourceLocation.sectionId === conclusionSection?.sectionId && item.kind === "comparison");
  if (conclusionSection && conclusionParagraph) {
    const location = sourceLocationForParagraph(conclusionSection, 0);
    values.push({
      raw: conclusionParagraph,
      value: "多数用户优先考虑年度方案",
      sourceField: `article.sections[${conclusionSection.sourceLocation.sectionIndex ?? 0}].paragraphs[0]`,
      sourceLocation: location,
      sourceEvidenceIds: conclusionEvidence ? [conclusionEvidence.evidenceId] : [],
      compactionReason: "source_backed_decision_rephrase",
    });
    values.push({
      raw: conclusionParagraph,
      value: "避免冲动订阅和季节性浪费",
      sourceField: `article.sections[${conclusionSection.sourceLocation.sectionIndex ?? 0}].paragraphs[0]`,
      sourceLocation: location,
      sourceEvidenceIds: conclusionEvidence ? [conclusionEvidence.evidenceId] : [],
      compactionReason: "source_backed_decision_rephrase",
    });
  }

  if (values.length) return values.slice(0, 3).filter((item) => isSemanticallyComplete(item.value ?? item.raw));

  return brief.keyPoints.map((value, index) => ({
    raw: normalize(value),
    value: undefined,
    sourceField: `contentBrief.keyPoints[${index}]`,
    sourceLocation: firstSectionLocation(article),
    sourceEvidenceIds: [],
    compactionReason: undefined,
  }));
}

export function containsArticlePlaceholder(value?: string) {
  if (!value) return false;
  const normalized = normalize(value);
  return articlePlaceholderPatterns.some((pattern) => pattern.test(normalized));
}

export function buildArticleVisibleCopyPlan(input: {
  article: ArticleInput;
  brief: ArticleContentBrief;
  policyScenes: ArticlePolicyScenePlan[];
  runtimeScenes: ArticleRuntimeSelectionPlanScene[];
}): ArticleVisibleCopyScenePlan[] {
  const { article, brief, policyScenes, runtimeScenes } = input;
  const selectedSteps = stepSources(article, brief);
  const selectedRecommendations = recommendationSources(article, brief);
  const evidenceRefs = evidenceLookup(brief);
  const strategySection = sectionByHeading(article, /省钱|策略/u);
  const conclusionSection = sectionByHeading(article, /总结|建议|结论/u);
  const hookEvidence = chooseHookEvidence(brief);

  return policyScenes
    .map((policyScene) => {
      const runtimeScene = runtimeScenes.find((item) => item.sceneId === policyScene.sceneId);
      if (!runtimeScene?.selectedRuntimeShotId || !runtimeScene.selectedChoreographyId) {
        return undefined;
      }

      const selectedEvidence = policyScene.selectedEvidenceIds
        .map((evidenceId) => evidenceRefs.get(evidenceId))
        .filter((item): item is EvidenceItem => Boolean(item));
      const role = inferredContentRole(policyScene.visualIntent);

      const headline = textValue({
        raw:
          role === "hook"
            ? article.title
            : role === "recommendation"
              ? conclusionSection?.heading ?? "总结建议"
              : role === "step_flow"
                ? strategySection?.heading ?? "订阅怎么省钱"
                : policyScene.headline?.sourceExcerpt ?? policyScene.headline?.value ?? brief.coreMessage,
        value:
          role === "recommendation"
            ? sectionHeadingValue(conclusionSection, "总结建议")
            : role === "step_flow"
              ? sectionHeadingValue(strategySection, "订阅怎么省钱")
              : undefined,
        sourceField:
          role === "hook"
            ? "article.title"
            : role === "recommendation"
              ? "article.sections.heading"
              : role === "step_flow"
                ? "article.sections.heading"
                : policyScene.headline?.sourceField ?? "contentBrief.coreMessage",
        sourceExcerpt:
          role === "hook"
            ? article.title
            : role === "recommendation"
              ? conclusionSection?.heading ?? "总结建议"
              : role === "step_flow"
                ? strategySection?.heading ?? "订阅怎么省钱"
                : policyScene.headline?.sourceExcerpt ?? brief.coreMessage,
        sourceLocation:
          role === "recommendation"
            ? conclusionSection
              ? { ...conclusionSection.sourceLocation, sectionId: conclusionSection.sectionId }
              : firstSectionLocation(article)
            : role === "step_flow"
              ? strategySection
                ? { ...strategySection.sourceLocation, sectionId: strategySection.sectionId }
                : firstSectionLocation(article)
              : role === "hook"
                ? firstSectionLocation(article)
                : selectedEvidence[0]?.sourceLocation ?? firstSectionLocation(article),
        sourceEvidenceIds: role === "hook" ? [] : selectedEvidence.map((item) => item.evidenceId),
        maxCharacters: role === "hook" ? 36 : 40,
        compactionReason: role === "step_flow" || role === "recommendation" ? "section_heading_role_label" : undefined,
      });

      const shortLabel = textValue({
        raw:
          role === "hook"
            ? "年度/月度对比"
            : role === "recommendation"
              ? conclusionSection?.heading ?? "总结建议"
              : role === "step_flow"
                ? strategySection?.heading ?? "省钱策略"
                : article.sections.find((section) => section.heading)?.heading ?? brief.coreMessage,
        value:
          role === "hook"
            ? "对比结论"
            : role === "recommendation"
              ? "选择建议"
              : role === "step_flow"
                ? "省钱策略"
                : undefined,
        sourceField:
          role === "hook"
            ? "article.title"
            : role === "recommendation" || role === "step_flow"
              ? "article.sections.heading"
              : "article.sections[0].heading",
        sourceExcerpt:
          role === "hook"
            ? article.title
            : role === "recommendation"
              ? conclusionSection?.heading ?? "总结建议"
              : role === "step_flow"
                ? strategySection?.heading ?? "省钱策略"
                : article.sections.find((section) => section.heading)?.heading ?? brief.coreMessage,
        sourceLocation:
          role === "recommendation"
            ? conclusionSection
              ? { ...conclusionSection.sourceLocation, sectionId: conclusionSection.sectionId }
              : firstSectionLocation(article)
            : role === "step_flow"
              ? strategySection
                ? { ...strategySection.sourceLocation, sectionId: strategySection.sectionId }
                : firstSectionLocation(article)
              : firstSectionLocation(article),
        sourceEvidenceIds: [],
        maxCharacters: 16,
        compactionReason: role === "hook" || role === "step_flow" || role === "recommendation" ? "role_label" : undefined,
      });

      const evidenceCaption =
        role === "hook" && hookEvidence
          ? textValue({
              raw: hookEvidence.evidence.claim,
              value: hookEvidence.display,
              sourceField: "contentBrief.evidence.claim",
              sourceExcerpt: hookEvidence.evidence.claim,
              sourceLocation: hookEvidence.evidence.sourceLocation,
              sourceEvidenceIds: [hookEvidence.evidence.evidenceId],
              maxCharacters: 44,
              compactionReason: "substantive_hook_evidence",
            })
          : undefined;

      const stepItems =
        role === "step_flow"
          ? selectedSteps.slice(0, 3).map((step) =>
              listValue({
                raw: step.raw,
                value: step.value,
                sourceField: step.sourceField,
                sourceExcerpt: step.raw,
                sourceLocation: step.sourceLocation,
                sourceEvidenceIds: step.sourceEvidenceIds,
                maxCharacters: 30,
                compactionReason: step.compactionReason,
              }),
            )
          : undefined;

      const recommendationItems =
        role === "recommendation"
          ? selectedRecommendations.slice(0, 3).map((item) =>
              listValue({
                raw: item.raw,
                value: item.value,
                sourceField: item.sourceField,
                sourceExcerpt: item.raw,
                sourceLocation: item.sourceLocation,
                sourceEvidenceIds: item.sourceEvidenceIds,
                maxCharacters: 32,
                compactionReason: item.compactionReason,
              }),
            )
          : undefined;

      const recommendationTitle =
        role === "recommendation"
          ? textValue({
              raw: conclusionSection?.heading ?? "总结建议",
              value: "最终选择建议",
              sourceField: "article.sections.heading",
              sourceExcerpt: conclusionSection?.heading ?? "总结建议",
              sourceLocation: conclusionSection ? { ...conclusionSection.sourceLocation, sectionId: conclusionSection.sectionId } : firstSectionLocation(article),
              sourceEvidenceIds: [],
              maxCharacters: 28,
              compactionReason: "recommendation_panel_role_label",
            })
          : undefined;

      const scenePlan: ArticleVisibleCopyScenePlan = {
        sceneId: policyScene.sceneId,
        runtimeShotId: runtimeScene.selectedRuntimeShotId,
        choreographyId: runtimeScene.selectedChoreographyId,
        visualIntent: policyScene.visualIntent,
        contentRole: role,
        articleBindingRequired: true,
        articleBindingMode: "strict",
        noPlaceholderFallback: true,
        visibleAtFrame: visibleAtFrame(runtimeScene.selectedChoreographyId, 0),
        headline,
        supportingText: undefined,
        shortLabel,
        recommendationTitle,
        recommendationItems,
        stepItems,
        cards: undefined,
        evidenceCaption,
        selectedEvidenceIds: [
          ...new Set([
            ...selectedEvidence.map((item) => item.evidenceId),
            ...(evidenceCaption?.sourceEvidenceIds ?? []),
            ...((stepItems ?? []).flatMap((item) => item.sourceEvidenceIds) ?? []),
            ...((recommendationItems ?? []).flatMap((item) => item.sourceEvidenceIds) ?? []),
          ]),
        ],
      };
      return scenePlan;
    })
    .filter((scene): scene is ArticleVisibleCopyScenePlan => Boolean(scene));
}

export function visibleCopyHasEllipsis(value?: string) {
  if (!value) return false;
  return value.includes("...") || value.includes("…") || value.includes("⋯");
}

export function visibleCopyHasDanglingPunctuation(value?: string) {
  if (!value) return false;
  return danglingPunctuationPattern.test(normalize(value));
}

export function visibleCopyIsSemanticallyComplete(value?: string) {
  if (!value) return false;
  return isSemanticallyComplete(value);
}

export function visibleEvidenceHasSubstantiveClaim(value?: string) {
  if (!value) return false;
  return substantiveEvidencePattern.test(value) && !containsArticlePlaceholder(value);
}

export function listVisibleValues(scene: ArticleVisibleCopyScenePlan) {
  return [
    scene.headline?.value,
    scene.supportingText?.value,
    scene.shortLabel?.value,
    scene.recommendationTitle?.value,
    scene.evidenceCaption?.value,
    ...(scene.recommendationItems ?? []).map((item) => item.value),
    ...(scene.stepItems ?? []).map((item) => item.value),
    ...(scene.cards ?? []).map((item) => item.value),
  ].filter((value): value is string => Boolean(value));
}

export function sceneDisplayModeSummary(scene: ArticleVisibleCopyScenePlan) {
  const modes: ArticleVisibleCopyDisplayMode[] = [
    scene.headline?.displayMode,
    scene.supportingText?.displayMode,
    scene.shortLabel?.displayMode,
    scene.recommendationTitle?.displayMode,
    scene.evidenceCaption?.displayMode,
    ...(scene.recommendationItems ?? []).map((item) => item.displayMode),
    ...(scene.stepItems ?? []).map((item) => item.displayMode),
  ].filter((mode): mode is ArticleVisibleCopyDisplayMode => Boolean(mode));
  return {
    fullCount: modes.filter((mode) => mode === "full").length,
    condensedCount: modes.filter((mode) => mode === "condensed").length,
    skippedCount: modes.filter((mode) => mode === "skipped").length,
  };
}
