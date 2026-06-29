import { validateArticleInput } from "../validateArticleInput";
import { validateContentBrief } from "../validateContentBrief";
import type { ArticleContentBrief } from "../types";
import { extractStructuredData } from "./structuredDataExtractor";
import type { ArticleBatchInputBundle, BatchDefect, InputReadingQaReport, StructuredDataItem } from "./articleBatchTypes";

function defect(input: { issueId: string; category: string; message: string; repairScope: BatchDefect["repairScope"]; detectedBy: string }): BatchDefect {
  return {
    issueId: input.issueId,
    severity: "BLOCKER",
    category: input.category,
    sceneIds: [],
    evidenceIds: [],
    tableIds: [],
    message: input.message,
    detectedBy: input.detectedBy,
    repairScope: input.repairScope,
    recommendedAction: input.repairScope === "re_read_input" ? "Create a new input snapshot and rerun input parsing." : "Repair source data before script generation.",
    autoRepairEligible: input.repairScope === "re_read_input",
  };
}

function countPricePercentageComparisonData(structuredData: StructuredDataItem[], brief: ArticleContentBrief) {
  const evidenceCount = brief.evidence.filter((item) => ["currency", "percentage", "count", "duration"].includes(item.valueType) || item.kind === "comparison").length;
  return evidenceCount + structuredData.filter((item) => item.containsPriceOrPercentage || item.containsComparativeData).length;
}

export function runInputReadingGate(bundle: ArticleBatchInputBundle, brief: ArticleContentBrief, sourceContentHash: string): { report: InputReadingQaReport; structuredData: StructuredDataItem[] } {
  const articleValidation = validateArticleInput(bundle.article);
  const briefValidation = validateContentBrief(brief);
  const structuredData = extractStructuredData(bundle.article, brief.evidence);
  const requiredBackendFields = [bundle.article.metadata.slug, bundle.article.metadata.locale, bundle.article.metadata.pageType, bundle.article.publishedAt].filter(Boolean).length;
  const defects: BatchDefect[] = [];

  if (!articleValidation.valid) {
    defects.push(
      defect({
        issueId: "input_article_invalid",
        category: "INPUT_MISSING_OR_PARSE_FAILED",
        message: `Article input validation failed with ${articleValidation.errors.length} error(s).`,
        repairScope: "re_read_input",
        detectedBy: "validateArticleInput",
      }),
    );
  }
  if (!briefValidation.valid) {
    defects.push(
      defect({
        issueId: "input_brief_invalid",
        category: "EVIDENCE_MISSING",
        message: `Content brief validation failed with ${briefValidation.errors.length} error(s).`,
        repairScope: "repair_script",
        detectedBy: "validateContentBrief",
      }),
    );
  }

  const checks = {
    inputSnapshotCreated: true,
    sourceContentHashPresent: Boolean(sourceContentHash),
    articleTitlePresent: Boolean(bundle.article.title),
    articleBodyPresent: Boolean(bundle.article.rawContent.trim() && bundle.article.sections.length),
    articleTypePresentOrInferable: Boolean(bundle.article.metadata.pageType || brief.sourceMetadata.pageType || bundle.article.sourceType),
    contentHtmlParseSucceeded: bundle.article.sourceType !== "api_html" || bundle.article.sections.length > 0,
    evidenceExtractionSucceeded: brief.evidence.length > 0,
    structuredDataExtractionSucceeded: true,
    tableParsingSucceededWhenTablesExist: !/<table[\s>]/i.test(bundle.article.rawContent) || structuredData.some((item) => item.kind === "html_table"),
    requiredBackendFieldsPresent: requiredBackendFields >= 3,
    noMalformedCriticalField: articleValidation.valid,
  };

  Object.entries(checks).forEach(([key, passed]) => {
    if (!passed) {
      defects.push(
        defect({
          issueId: `input_${key}`,
          category: key === "tableParsingSucceededWhenTablesExist" ? "TABLE_READ_FAILED" : "INPUT_MISSING_OR_PARSE_FAILED",
          message: `Input reading check failed: ${key}.`,
          repairScope: "re_read_input",
          detectedBy: "runInputReadingGate",
        }),
      );
    }
  });

  const report: InputReadingQaReport = {
    status: defects.some((item) => item.severity === "BLOCKER") ? "rejected" : "passed",
    checks,
    defects,
    evidenceCount: brief.evidence.length,
    tableCount: structuredData.filter((item) => item.kind === "html_table").length,
    pricePercentageComparisonDataCount: countPricePercentageComparisonData(structuredData, brief),
    dataDisplayPlanRequiredCount: structuredData.filter((item) => item.requiresDataDisplayPlan).length,
  };
  return { report, structuredData };
}
