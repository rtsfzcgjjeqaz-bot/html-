import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fetchPublishedArticles, FetchPublishedArticlesError, validateArticleApiRequest } from "./fetchPublishedArticles";
import { normalizeApiArticleToInput } from "./normalizeApiArticleToInput";
import { normalizeArticleToContentBrief } from "./normalizeArticleToContentBrief";
import { selectApiArticle, SelectApiArticleError } from "./selectApiArticle";
import { validateArticleInput } from "./validateArticleInput";
import { validateContentBrief } from "./validateContentBrief";
import type { ApiArticleBatch, ApiArticleRecord, ArticleApiLocale } from "./types";

type CliArgs = {
  date?: string;
  locale?: string;
  slug?: string;
  output?: string;
  listOnly: boolean;
};

type InspectSummary = {
  status: "passed" | "warning" | "failed";
  mode: "list-only" | "single-article";
  date: string;
  locale?: ArticleApiLocale;
  slug?: string;
  checks: Record<string, boolean | number | string>;
  warnings: string[];
  errors: string[];
  outputDirectory: string;
  videoStructureHashUnchanged: boolean;
};

const keyLeakPattern = /(authorization|bearer\s+[a-z0-9_\-.]+|articles_api_key|token=|api[_-]?key)/i;
const defaultListOutputRoot = path.join("outputs", "article-api-inspect");
const videoStructurePath = path.resolve("video-structure.json");

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };

  return {
    date: valueAfter("--date"),
    locale: valueAfter("--locale"),
    slug: valueAfter("--slug"),
    output: valueAfter("--output"),
    listOnly: argv.includes("--list-only"),
  };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function sha256(filePath: string) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function normalizeLocale(locale?: string): ArticleApiLocale | undefined {
  if (!locale) return undefined;
  return locale === "zh" || locale === "en" ? locale : undefined;
}

function summarizeListItem(item: ApiArticleRecord) {
  return {
    slug: item.slug,
    title: item.title,
    locale: item.locale,
    page_type: item.page_type,
    published_at: item.published_at,
  };
}

function resolveOutputDirectory(args: CliArgs) {
  if (args.output) {
    return path.resolve(args.output);
  }
  if (!args.date) {
    throw new Error("Output directory requires --date.");
  }
  return path.resolve(defaultListOutputRoot, args.date);
}

function detectLeakInObject(value: unknown) {
  return keyLeakPattern.test(JSON.stringify(value));
}

function buildListSummary(batch: ApiArticleBatch, outputDirectory: string, initialHash: string): InspectSummary {
  const warnings: string[] = [];
  if (batch.count !== batch.items.length) {
    warnings.push(`API count (${batch.count}) did not match items length (${batch.items.length}).`);
  }

  return {
    status: warnings.length ? "warning" : "passed",
    mode: "list-only",
    date: batch.date,
    checks: {
      apiRequestSucceeded: true,
      jsonValid: true,
      itemCount: batch.items.length,
      countMatchesItemsLength: batch.count === batch.items.length,
      keyLeakDetected: false,
    },
    warnings,
    errors: [],
    outputDirectory,
    videoStructureHashUnchanged: sha256(videoStructurePath) === initialHash,
  };
}

function buildInspectSummary(input: {
  batch: ApiArticleBatch;
  record: ApiArticleRecord;
  articleInput: ReturnType<typeof normalizeApiArticleToInput>;
  contentBrief: ReturnType<typeof normalizeArticleToContentBrief>;
  articleInputValid: ReturnType<typeof validateArticleInput>;
  contentBriefValid: ReturnType<typeof validateContentBrief>;
  outputDirectory: string;
  initialHash: string;
}) {
  const { batch, record, articleInput, contentBrief, articleInputValid, contentBriefValid, outputDirectory, initialHash } = input;
  const warnings: string[] = [];
  const errors: string[] = [];
  const evidenceTraceable = contentBrief.evidence.every((item) => {
    const location = item.sourceLocation;
    return Boolean(location.sectionId) && (typeof location.paragraphIndex === "number" || typeof location.listItemIndex === "number");
  });

  if (batch.count !== batch.items.length) {
    warnings.push(`API count (${batch.count}) did not match items length (${batch.items.length}).`);
  }
  if (!articleInputValid.valid) {
    errors.push(...articleInputValid.errors.map((error) => `articleInput:${error}`));
  }
  if (!contentBriefValid.valid) {
    errors.push(...contentBriefValid.errors.map((error) => `contentBrief:${error}`));
  }
  if (!evidenceTraceable) {
    errors.push("evidence sourceLocation is not fully traceable");
  }

  return {
    status: errors.length ? "failed" : warnings.length ? "warning" : "passed",
    mode: "single-article" as const,
    date: batch.date,
    locale: record.locale,
    slug: record.slug,
    checks: {
      apiRequestSucceeded: true,
      jsonValid: true,
      countMatchesItemsLength: batch.count === batch.items.length,
      slugMatchedExactly: true,
      articleTitlePresent: Boolean(record.title.trim()),
      contentHtmlPresent: Boolean(record.content_html.trim()),
      htmlParsedToSections: articleInput.sections.length > 0,
      articleInputValid: articleInputValid.valid,
      contentBriefValid: contentBriefValid.valid,
      evidenceCount: contentBrief.evidence.length,
      evidenceTraceable,
      keyLeakDetected: false,
    },
    warnings,
    errors,
    outputDirectory,
    videoStructureHashUnchanged: sha256(videoStructurePath) === initialHash,
  } satisfies InspectSummary;
}

async function run() {
  const args = readArgs();
  if (!args.date) {
    throw new Error('Use: npm run article:api-inspect -- --date YYYY-MM-DD [--locale zh|en] [--list-only | --slug "exact-slug" --output "outputs/..."]');
  }

  validateArticleApiRequest(args.date, args.locale);
  const locale = normalizeLocale(args.locale);
  const outputDirectory = resolveOutputDirectory(args);
  ensureDir(outputDirectory);

  if (!args.listOnly && !args.slug) {
    throw new Error("Single-article inspect requires --slug.");
  }

  const initialHash = sha256(videoStructurePath);
  const batch = await fetchPublishedArticles(args.date, locale);

  if (args.listOnly) {
    const articleList = batch.items.map(summarizeListItem);
    const summary = buildListSummary(batch, outputDirectory, initialHash);
    writeJson(path.join(outputDirectory, "article-list.json"), articleList);
    writeJson(path.join(outputDirectory, "api-inspect-summary.json"), summary);

    console.log(`articleListPath=${path.join(outputDirectory, "article-list.json")}`);
    console.log(`apiInspectSummaryPath=${path.join(outputDirectory, "api-inspect-summary.json")}`);
    return;
  }

  const record = selectApiArticle(batch, args.slug!);
  const articleInput = normalizeApiArticleToInput(record);
  const contentBrief = normalizeArticleToContentBrief(articleInput);
  const articleInputValid = validateArticleInput(articleInput);
  const contentBriefValid = validateContentBrief(contentBrief);
  const summary = buildInspectSummary({
    batch,
    record,
    articleInput,
    contentBrief,
    articleInputValid,
    contentBriefValid,
    outputDirectory,
    initialHash,
  });

  const publicRecord = {
    ...record,
  };

  const outputFiles = {
    rawApiArticlePath: path.join(outputDirectory, "raw-api-article.json"),
    articleInputPath: path.join(outputDirectory, "article-input.json"),
    contentBriefPath: path.join(outputDirectory, "content-brief.json"),
    evidenceMapPath: path.join(outputDirectory, "evidence-map.json"),
    apiInspectSummaryPath: path.join(outputDirectory, "api-inspect-summary.json"),
  };

  if (
    detectLeakInObject(publicRecord) ||
    detectLeakInObject(articleInput) ||
    detectLeakInObject(contentBrief) ||
    detectLeakInObject(summary)
  ) {
    throw new Error("Potential secret leak detected in API inspect outputs.");
  }

  writeJson(outputFiles.rawApiArticlePath, publicRecord);
  writeJson(outputFiles.articleInputPath, articleInput);
  writeJson(outputFiles.contentBriefPath, contentBrief);
  writeJson(outputFiles.evidenceMapPath, contentBrief.evidence);
  writeJson(outputFiles.apiInspectSummaryPath, summary);

  console.log(`rawApiArticlePath=${outputFiles.rawApiArticlePath}`);
  console.log(`articleInputPath=${outputFiles.articleInputPath}`);
  console.log(`contentBriefPath=${outputFiles.contentBriefPath}`);
  console.log(`evidenceMapPath=${outputFiles.evidenceMapPath}`);
  console.log(`apiInspectSummaryPath=${outputFiles.apiInspectSummaryPath}`);
}

void run().catch((error) => {
  if (error instanceof FetchPublishedArticlesError) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  if (error instanceof SelectApiArticleError) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
