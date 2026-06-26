import { loadArticleApiEnv } from "./loadArticleApiEnv";
import type { ApiArticleBatch, ArticleApiLocale } from "./types";

const defaultApiBaseUrl = "https://subscriptionatlas.com";
const requestTimeoutMs = 15000;

export type FetchPublishedArticlesErrorCode =
  | "ARTICLES_API_KEY_MISSING"
  | "ARTICLES_API_DATE_INVALID"
  | "ARTICLES_API_LOCALE_INVALID"
  | "ARTICLES_API_HTTP_ERROR"
  | "ARTICLES_API_TIMEOUT"
  | "ARTICLES_API_INVALID_JSON"
  | "ARTICLES_API_EMPTY_ITEMS"
  | "ARTICLES_API_INVALID_SHAPE";

export class FetchPublishedArticlesError extends Error {
  public readonly code: FetchPublishedArticlesErrorCode;
  public readonly status?: number;

  constructor(code: FetchPublishedArticlesErrorCode, message: string, options?: { status?: number }) {
    super(message);
    this.name = "FetchPublishedArticlesError";
    this.code = code;
    this.status = options?.status;
  }
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isValidLocale(locale?: string): locale is ArticleApiLocale {
  return locale === undefined || locale === "zh" || locale === "en";
}

function sanitizeBaseUrl(value?: string) {
  const raw = value?.trim() || defaultApiBaseUrl;
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  try {
    return new URL(normalized).toString().replace(/\/$/, "");
  } catch {
    return defaultApiBaseUrl;
  }
}

function validateBatchPayload(payload: unknown, expectedDate: string): ApiArticleBatch {
  if (!payload || typeof payload !== "object") {
    throw new FetchPublishedArticlesError("ARTICLES_API_INVALID_SHAPE", "Article API returned a non-object payload.");
  }

  const batch = payload as Partial<ApiArticleBatch>;
  if (batch.date !== expectedDate || typeof batch.count !== "number" || !Array.isArray(batch.items)) {
    throw new FetchPublishedArticlesError("ARTICLES_API_INVALID_SHAPE", "Article API payload is missing required batch fields.");
  }

  const items = batch.items.map((item, index) => {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.slug !== "string" ||
      (item.locale !== "zh" && item.locale !== "en") ||
      typeof item.title !== "string" ||
      typeof item.page_type !== "string" ||
      typeof item.published_at !== "string" ||
      typeof item.content_html !== "string"
    ) {
      throw new FetchPublishedArticlesError(
        "ARTICLES_API_INVALID_SHAPE",
        `Article API item ${index + 1} is missing required article fields.`,
      );
    }

    return item;
  });

  if (items.length === 0) {
    throw new FetchPublishedArticlesError("ARTICLES_API_EMPTY_ITEMS", "Article API returned no published items for the requested date.");
  }

  return {
    date: batch.date,
    count: batch.count,
    items,
  };
}

export function validateArticleApiRequest(date: string, locale?: string) {
  if (!isValidDate(date)) {
    throw new FetchPublishedArticlesError("ARTICLES_API_DATE_INVALID", "Article API date must use YYYY-MM-DD format.");
  }

  if (!isValidLocale(locale)) {
    throw new FetchPublishedArticlesError("ARTICLES_API_LOCALE_INVALID", "Article API locale must be zh, en, or omitted.");
  }
}

export async function fetchPublishedArticles(date: string, locale?: ArticleApiLocale): Promise<ApiArticleBatch> {
  loadArticleApiEnv();
  validateArticleApiRequest(date, locale);

  const apiKey = process.env.ARTICLES_API_KEY?.trim();
  if (!apiKey) {
    throw new FetchPublishedArticlesError("ARTICLES_API_KEY_MISSING", "ARTICLES_API_KEY_MISSING");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const baseUrl = sanitizeBaseUrl(process.env.ARTICLES_API_BASE_URL);
    const url = new URL("/api/articles", baseUrl);
    url.searchParams.set("date", date);
    if (locale) {
      url.searchParams.set("locale", locale);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new FetchPublishedArticlesError("ARTICLES_API_HTTP_ERROR", `Article API request failed with HTTP ${response.status}.`, {
        status: response.status,
      });
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new FetchPublishedArticlesError("ARTICLES_API_INVALID_JSON", "Article API response was not valid JSON.");
    }

    return validateBatchPayload(payload, date);
  } catch (error) {
    if (error instanceof FetchPublishedArticlesError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchPublishedArticlesError("ARTICLES_API_TIMEOUT", "Article API request timed out.");
    }
    throw new FetchPublishedArticlesError("ARTICLES_API_HTTP_ERROR", "Article API request failed before a valid response was received.");
  } finally {
    clearTimeout(timeout);
  }
}
