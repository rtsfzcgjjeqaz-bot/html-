import type { ArticleContentBrief } from "./types";

export function validateContentBrief(contentBrief: ArticleContentBrief) {
  const errors: string[] = [];
  if (!contentBrief.articleId) errors.push("articleId is required");
  if (!contentBrief.title) errors.push("title is required");
  if (!contentBrief.coreMessage) errors.push("coreMessage is required");
  if (!contentBrief.summary) errors.push("summary is required");
  if (!contentBrief.evidence.length) errors.push("at least one evidence item is required");
  return {
    valid: errors.length === 0,
    errors,
  };
}
