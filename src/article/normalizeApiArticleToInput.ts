import { parseArticleHtml } from "./parseArticleHtml";
import type { ApiArticleRecord, ArticleInput } from "./types";

type NormalizeApiArticleOptions = {
  sourceUrl?: string;
};

function normalizeSourceUrl(sourceUrl?: string) {
  const trimmed = sourceUrl?.trim();
  return trimmed || undefined;
}

function findSummary(paragraphs: string[], fallbackTitle: string) {
  return paragraphs.find(Boolean) ?? fallbackTitle;
}

export function normalizeApiArticleToInput(record: ApiArticleRecord, options?: NormalizeApiArticleOptions): ArticleInput {
  const parsed = parseArticleHtml(record.content_html);
  const summary = findSummary(parsed.sections.flatMap((section) => section.paragraphs), record.title);

  return {
    articleId: record.slug,
    sourceType: "api_html",
    title: record.title.trim() || parsed.titleFromH1 || record.slug,
    summary,
    rawContent: parsed.rawContent || record.content_html,
    sections: parsed.sections,
    sourceUrl: normalizeSourceUrl(options?.sourceUrl),
    publishedAt: record.published_at,
    cta: undefined,
    metadata: {
      slug: record.slug,
      locale: record.locale,
      pageType: record.page_type,
      titleSource: "api_record",
      publishedAt: record.published_at,
    },
  };
}
