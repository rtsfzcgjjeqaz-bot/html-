import { extractEvidence } from "./extractEvidence";
import type { ArticleContentBrief, ArticleInput, EvidenceItem } from "./types";

function sentenceFragments(value: string) {
  return value
    .split(/[\u3002\uFF01\uFF1F?.]\s+/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function compact(value: string, max = 140) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 3).trim()}...` : normalized;
}

function sourceMeta(article: ArticleInput) {
  const metadata = article.metadata;
  return {
    sourceType: article.sourceType,
    slug: metadata.slug,
    locale: metadata.locale,
    pageType: metadata.pageType,
    sourceUrl: article.sourceUrl,
    publishedAt: article.publishedAt,
    titleSource:
      article.sourceType === "api_html"
        ? ("api_record" as const)
        : metadata.title
          ? ("frontmatter" as const)
          : article.sections.find((section) => section.heading)
            ? ("heading" as const)
            : ("fallback" as const),
    summarySource: metadata.summary ? "frontmatter" as const : article.sections.flatMap((section) => section.paragraphs).length ? "paragraph" as const : "fallback" as const,
  };
}

function keyPointsFromArticle(article: ArticleInput, evidence: EvidenceItem[]) {
  const headingPoints = article.sections.map((section) => section.heading).filter(Boolean) as string[];
  const paragraphPoints = article.sections.flatMap((section) => sentenceFragments(section.paragraphs[0] ?? "")).slice(0, 4);
  const evidencePoints = evidence
    .filter((item) => item.videoEligible)
    .map((item) => item.claim)
    .slice(0, 4);
  return [...new Set([...headingPoints, ...paragraphPoints, ...evidencePoints].map((value) => compact(value, 100)))].filter(Boolean).slice(0, 5);
}

function recommendedVisualIntents(article: ArticleInput, evidence: EvidenceItem[]) {
  const intents = ["hook"];
  if (article.sections.some((section) => section.orderedSteps?.length)) intents.push("steps");
  if (evidence.some((item) => item.valueType === "currency" || item.valueType === "percentage" || item.valueType === "date" || item.valueType === "count")) {
    intents.push("structured-info");
  }
  intents.push("recommendation");
  return [...new Set(intents)];
}

function factConstraints(evidence: EvidenceItem[]) {
  const constraints = [
    "Do not invent numbers, rankings, pricing, user ratios, or quotes.",
    "Only promote claims that map to an evidenceId and source excerpt.",
    "If a number is present but ambiguous, keep it as text only and avoid chart-style exaggeration.",
  ];
  if (!evidence.some((item) => item.valueType === "currency" || item.valueType === "percentage" || item.valueType === "count")) {
    constraints.push("No certified numeric evidence is available for chart-first visuals.");
  }
  return constraints;
}

export function normalizeArticleToContentBrief(article: ArticleInput): ArticleContentBrief {
  const evidence = extractEvidence(article);
  const keyPoints = keyPointsFromArticle(article, evidence);
  const coreMessage = compact(keyPoints[0] ?? article.summary ?? article.title, 120);

  return {
    articleId: article.articleId,
    title: article.title,
    coreMessage,
    summary: compact(article.summary, 180),
    keyPoints,
    evidence,
    factConstraints: factConstraints(evidence),
    recommendedVisualIntents: recommendedVisualIntents(article, evidence),
    cta: article.cta?.text || article.cta?.url ? article.cta : undefined,
    sourceMetadata: sourceMeta(article),
  };
}
