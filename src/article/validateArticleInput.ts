import type { ArticleInput } from "./types";

export function validateArticleInput(article: ArticleInput) {
  const errors: string[] = [];
  if (!article.articleId) errors.push("articleId is required");
  if (!article.title) errors.push("title is required");
  if (!article.summary) errors.push("summary is required");
  if (!article.rawContent.trim()) errors.push("rawContent is empty");
  if (!article.sections.length) errors.push("at least one section is required");
  return {
    valid: errors.length === 0,
    errors,
  };
}
