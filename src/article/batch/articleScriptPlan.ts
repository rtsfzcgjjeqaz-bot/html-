import type { ArticleContentBrief, ArticleInput, EvidenceItem } from "../types";
import type { ArticleScriptPlan, ArticleScriptScenePlan, DataDisplayPlan, StructuredDataItem } from "./articleBatchTypes";

function articleSlug(article: ArticleInput) {
  return article.metadata.slug ?? article.articleId;
}

function compact(value: string, max: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const complete = (item: string) => item.replace(/[，。；：、,;:-]+$/u, "").trim();
  if (normalized.length <= max) return complete(normalized);
  const punctuationIndex = normalized.slice(0, max).search(/[，。；：、,.!?][^，。；：、,.!?]*$/u);
  if (punctuationIndex > 12) return complete(normalized.slice(0, punctuationIndex));
  return complete(normalized.slice(0, max));
}

function evidenceBySection(evidence: EvidenceItem[], sectionId?: string) {
  return evidence.filter((item) => !sectionId || item.sourceLocation.sectionId === sectionId);
}

function preferredEvidence(brief: ArticleContentBrief, valueTypes: string[]) {
  const typed = brief.evidence.filter((item) => valueTypes.includes(item.valueType) || item.kind === "comparison");
  return (typed.length ? typed : brief.evidence).slice(0, 3);
}

function requiredFacts(evidence: EvidenceItem[]) {
  return evidence.map((item) => item.claim).slice(0, 3);
}

function dataDisplayPlan(displayType: DataDisplayPlan["displayType"], evidence: EvidenceItem[], structuredData: StructuredDataItem[], readableScope: string): DataDisplayPlan {
  return {
    displayType,
    evidenceIds: evidence.map((item) => item.evidenceId),
    tableIds: structuredData.filter((item) => item.requiresDataDisplayPlan).map((item) => item.tableId),
    readableScope,
  };
}

function orderedStepEvidence(article: ArticleInput, brief: ArticleContentBrief) {
  const stepSection = article.sections.find((section) => section.orderedSteps?.length);
  const sectionEvidence = evidenceBySection(brief.evidence, stepSection?.sectionId);
  return { stepSection, sectionEvidence };
}

function sentenceFragments(values: string[]) {
  return values
    .flatMap((value) => value.split(/[。！？!?]/u))
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function buildArticleScriptPlan(input: {
  article: ArticleInput;
  brief: ArticleContentBrief;
  structuredData: StructuredDataItem[];
  sourceSnapshotId: string;
  sourceContentHash: string;
}): ArticleScriptPlan {
  const comparisonEvidence = preferredEvidence(input.brief, ["currency", "percentage", "count", "duration"]);
  const { stepSection, sectionEvidence } = orderedStepEvidence(input.article, input.brief);
  const stepItems = (stepSection?.orderedSteps ?? input.brief.keyPoints).slice(0, 3).map((item) => compact(item, 32));
  const recommendationSection =
    input.article.sections.find((section) => /建议|总结|选择|结论/u.test(section.heading ?? "")) ??
    input.article.sections.find((section) => /建议|总结|选择|结论/u.test(section.paragraphs.join(" ")));
  const recommendationEvidence = evidenceBySection(input.brief.evidence, recommendationSection?.sectionId).slice(0, 3);
  const recommendationItems = (recommendationSection?.paragraphs.length ? sentenceFragments(recommendationSection.paragraphs) : input.brief.keyPoints)
    .slice(0, 3)
    .map((item) => compact(item, 34));

  const scenes: ArticleScriptScenePlan[] = [
    {
      sceneId: 1,
      narrativeRole: "hook",
      visualIntent: "hook",
      narrativeGoal: "Introduce the article's comparison and show the strongest traceable claim.",
      coreClaim: comparisonEvidence[0]?.claim ?? input.brief.coreMessage,
      claimType: "comparison",
      sourceEvidenceIds: comparisonEvidence.map((item) => item.evidenceId),
      requiredFacts: requiredFacts(comparisonEvidence),
      copyDraft: {
        headline: input.article.title,
        shortLabel: "对比结论",
        supportingText: compact(comparisonEvidence[0]?.claim ?? input.brief.coreMessage, 42),
        items: [],
      },
      dataDisplayPlan: dataDisplayPlan("evidence_card", comparisonEvidence, input.structuredData, "single comparison evidence caption"),
      textCapacityTarget: { headlineMaxChars: 34, itemMaxChars: 0, maxItems: 0 },
      dependsOnSceneIds: [],
    },
    {
      sceneId: 2,
      narrativeRole: "step_flow",
      visualIntent: "step_flow",
      narrativeGoal: "Present the guide steps as a readable sequence before the recommendation.",
      coreClaim: stepItems[0] ?? input.brief.coreMessage,
      claimType: "instruction",
      sourceEvidenceIds: sectionEvidence.map((item) => item.evidenceId),
      requiredFacts: requiredFacts(sectionEvidence),
      copyDraft: {
        headline: "订阅怎么省钱",
        shortLabel: "省钱策略",
        items: stepItems,
      },
      dataDisplayPlan: dataDisplayPlan("step_list", sectionEvidence, input.structuredData, "up to three ordered guide steps"),
      textCapacityTarget: { headlineMaxChars: 18, itemMaxChars: 34, maxItems: 3 },
      dependsOnSceneIds: [1],
    },
    {
      sceneId: 3,
      narrativeRole: "recommendation",
      visualIntent: "recommendation",
      narrativeGoal: "Close with source-grounded decision guidance after the evidence and steps.",
      coreClaim: recommendationItems[0] ?? input.brief.coreMessage,
      claimType: "recommendation",
      sourceEvidenceIds: recommendationEvidence.map((item) => item.evidenceId),
      requiredFacts: requiredFacts(recommendationEvidence),
      recommendationType: "decision",
      copyDraft: {
        headline: "总结建议",
        shortLabel: "选择建议",
        items: recommendationItems,
      },
      dataDisplayPlan: dataDisplayPlan("comparison_panel", recommendationEvidence, input.structuredData, "decision panel with two to three sourced recommendations"),
      textCapacityTarget: { headlineMaxChars: 18, itemMaxChars: 34, maxItems: 3 },
      dependsOnSceneIds: [1, 2],
    },
  ];

  return {
    articleSlug: articleSlug(input.article),
    articleType: input.article.metadata.pageType ?? input.brief.sourceMetadata.pageType ?? "article",
    sourceSnapshotId: input.sourceSnapshotId,
    sourceContentHash: input.sourceContentHash,
    narrativeTemplate: input.article.metadata.pageType === "guide" ? "guide_comparison_three_scene" : "article_three_scene",
    scriptStatus: "draft",
    scenes,
  };
}
