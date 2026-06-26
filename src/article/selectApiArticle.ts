import type { ApiArticleBatch, ApiArticleRecord } from "./types";

export class SelectApiArticleError extends Error {
  public readonly code = "ARTICLES_API_SLUG_NOT_FOUND";

  constructor(slug: string) {
    super(`No published API article matched slug "${slug}" exactly.`);
    this.name = "SelectApiArticleError";
  }
}

export function selectApiArticle(batch: ApiArticleBatch, slug: string): ApiArticleRecord {
  const normalizedSlug = slug.trim();
  const match = batch.items.find((item) => item.slug === normalizedSlug);
  if (!match) {
    throw new SelectApiArticleError(normalizedSlug);
  }
  return match;
}
