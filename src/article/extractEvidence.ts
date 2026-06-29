import type { ArticleInput, ArticleSection, EvidenceItem, EvidenceKind, EvidenceValueType } from "./types";

const currencyPattern = /(?:[$€£¥])\s?\d[\d,]*(?:\.\d+)?|\b(?:USD|EUR|GBP|CNY|RMB)\s*\d[\d,]*(?:\.\d+)?/gi;
const percentagePattern = /\b\d[\d,]*(?:\.\d+)?\s*%/g;
const isoDatePattern = /\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b/g;
const yearPattern = /20\d{2}(?=年)/g;
const englishDatePattern = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+20\d{2}\b/gi;
const durationPattern = /\b\d[\d,]*(?:\.\d+)?\s*(?:days?|weeks?|months?|years?|天|周|个月|月|年)\b/gi;
const countPattern = /\b\d[\d,]*(?:\.\d+)?\s*(?:users?|people|devices?|times?|regions?|countries?|platforms?|人|次|台|个|家|月)\b/gi;
const genericNumberPattern = /\b\d[\d,]*(?:\.\d+)?\b/g;
const quotePattern = /["\u201C\u201D][^"\u201C\u201D]{8,}["\u201C\u201D]/g;

function normalizedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function evidenceId(articleId: string, sectionId: string, paragraphIndex: number, kind: EvidenceKind, itemIndex: number) {
  return `${articleId}_${sectionId}_p${String(paragraphIndex + 1).padStart(2, "0")}_${kind}_${String(itemIndex + 1).padStart(2, "0")}`;
}

function numericValue(raw: string) {
  const normalized = raw.replace(/[$€£¥,%\s]|USD|EUR|GBP|CNY|RMB|天|周|个月|月|年|days?|weeks?|months?|years?|users?|people|devices?|times?|regions?|countries?|platforms?|人|次|台|个|家/gi, "").replace(/,/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function inferCurrencyUnit(raw: string) {
  if (raw.includes("¥")) return "¥";
  if (raw.includes("$")) return "$";
  if (raw.includes("€")) return "€";
  if (raw.includes("£")) return "£";
  const code = raw.match(/\b(USD|EUR|GBP|CNY|RMB)\b/i)?.[1];
  return code?.toUpperCase();
}

function inferDurationUnit(raw: string) {
  return raw.match(/days?|weeks?|months?|years?|天|周|个月|月|年/i)?.[0];
}

function inferCountUnit(raw: string) {
  return raw.match(/users?|people|devices?|times?|regions?|countries?|platforms?|人|次|台|个|家|月/i)?.[0];
}

function shouldMarkVideoEligible(kind: EvidenceKind, valueType: EvidenceValueType, hasTraceableSource: boolean) {
  if (!hasTraceableSource) {
    return false;
  }
  if (kind === "instruction") {
    return true;
  }
  if (kind === "quote") {
    return true;
  }
  if (kind === "comparison") {
    return valueType !== "none";
  }
  return valueType !== "none" && valueType !== "text";
}

function pushEvidence(
  items: EvidenceItem[],
  articleId: string,
  section: ArticleSection,
  paragraphIndex: number,
  kind: EvidenceKind,
  valueType: EvidenceValueType,
  claim: string,
  sourceExcerpt: string,
  options?: {
    value?: number | string;
    unit?: string;
    sourceLocation?: Partial<ArticleSection["sourceLocation"]>;
  },
) {
  const sourceLocation = {
    sectionId: section.sectionId,
    lineStart: section.sourceLocation.lineStart,
    lineEnd: section.sourceLocation.lineEnd,
    sectionIndex: section.sourceLocation.sectionIndex,
    headingPath: section.sourceLocation.headingPath,
    paragraphIndex: options?.sourceLocation?.paragraphIndex ?? paragraphIndex,
    listIndex: options?.sourceLocation?.listIndex,
    listItemIndex: options?.sourceLocation?.listItemIndex,
  };
  const hasTraceableSource =
    Boolean(sourceLocation.sectionId) &&
    (typeof sourceLocation.paragraphIndex === "number" || typeof sourceLocation.listItemIndex === "number");

  items.push({
    evidenceId: evidenceId(articleId, section.sectionId, paragraphIndex, kind, items.length),
    claim: normalizedText(claim),
    sourceExcerpt: normalizedText(sourceExcerpt),
    sourceLocation,
    kind,
    valueType,
    value: options?.value,
    unit: options?.unit,
    videoEligible: shouldMarkVideoEligible(kind, valueType, hasTraceableSource),
  });
}

function overlaps(ranges: Array<{ start: number; end: number }>, start: number, end: number) {
  return ranges.some((range) => start < range.end && end > range.start);
}

function collectPatternEvidence(
  items: EvidenceItem[],
  article: ArticleInput,
  section: ArticleSection,
  paragraph: string,
  paragraphIndex: number,
) {
  const claimedRanges: Array<{ start: number; end: number }> = [];
  const extractedValueTypes: EvidenceValueType[] = [];

  const capture = (
    pattern: RegExp,
    valueType: EvidenceValueType,
    options?: {
      kind?: EvidenceKind;
      unit?: (raw: string) => string | undefined;
      value?: (raw: string) => number | string | undefined;
    },
  ) => {
    for (const match of paragraph.matchAll(pattern)) {
      const raw = match[0];
      const start = match.index ?? 0;
      const end = start + raw.length;
      if (!raw || overlaps(claimedRanges, start, end)) {
        continue;
      }
      claimedRanges.push({ start, end });
      extractedValueTypes.push(valueType);
      pushEvidence(
        items,
        article.articleId,
        section,
        paragraphIndex,
        options?.kind ?? "fact",
        valueType,
        paragraph,
        raw,
        {
          value: options?.value ? options.value(raw) : numericValue(raw) ?? raw,
          unit: options?.unit?.(raw),
        },
      );
    }
  };

  capture(currencyPattern, "currency", {
    unit: inferCurrencyUnit,
    value: (raw) => numericValue(raw),
  });
  capture(percentagePattern, "percentage", {
    value: (raw) => numericValue(raw),
    unit: () => "%",
  });
  capture(isoDatePattern, "date", {
    value: (raw) => raw,
  });
  capture(yearPattern, "date", {
    value: (raw) => raw,
  });
  capture(englishDatePattern, "date", {
    value: (raw) => raw,
  });
  capture(durationPattern, "duration", {
    value: (raw) => numericValue(raw),
    unit: inferDurationUnit,
  });
  capture(countPattern, "count", {
    value: (raw) => numericValue(raw),
    unit: inferCountUnit,
  });
  capture(genericNumberPattern, "count", {
    value: (raw) => numericValue(raw),
  });

  return extractedValueTypes;
}

function extractParagraphEvidence(items: EvidenceItem[], article: ArticleInput, section: ArticleSection, paragraph: string, paragraphIndex: number) {
  const extractedValueTypes = collectPatternEvidence(items, article, section, paragraph, paragraphIndex);

  const quotes = [...paragraph.matchAll(quotePattern)];
  quotes.forEach((match) => {
    pushEvidence(items, article.articleId, section, paragraphIndex, "quote", "text", paragraph, match[0], {
      value: match[0],
    });
  });

  const lower = paragraph.toLowerCase();
  const strongComparisonLanguage =
    /\b(compare|comparison|versus|vs\.?|better|worse|higher|lower|cheaper|more expensive|difference)\b/.test(lower) ||
    /对比|比较|高于|低于|更便宜|更贵|优于|劣于/.test(paragraph);

  if (strongComparisonLanguage) {
    const valueType: EvidenceValueType = extractedValueTypes[0] ?? "text";
    pushEvidence(items, article.articleId, section, paragraphIndex, "comparison", valueType, paragraph, paragraph, {
      value: valueType === "text" ? undefined : undefined,
    });
    return;
  }

  if (!quotes.length && extractedValueTypes.length === 0 && normalizedText(paragraph)) {
    pushEvidence(items, article.articleId, section, paragraphIndex, "fact", "text", paragraph, paragraph, {
      value: normalizedText(paragraph),
    });
  }
}

function canonicalStepSet(section: ArticleSection) {
  return new Set((section.orderedSteps ?? []).map((step) => normalizedText(step)));
}

export function extractEvidence(article: ArticleInput): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];

  article.sections.forEach((section) => {
    const stepSet = canonicalStepSet(section);

    section.paragraphs.forEach((paragraph, paragraphIndex) => {
      if (stepSet.has(normalizedText(paragraph))) {
        return;
      }
      extractParagraphEvidence(evidence, article, section, paragraph, paragraphIndex);
    });

    section.orderedSteps?.forEach((step, stepIndex) => {
      pushEvidence(evidence, article.articleId, section, stepIndex, "instruction", "text", step, step, {
        value: normalizedText(step),
        sourceLocation: {
          paragraphIndex: undefined,
          listIndex: 0,
          listItemIndex: stepIndex,
        },
      });
    });
  });

  return evidence;
}
