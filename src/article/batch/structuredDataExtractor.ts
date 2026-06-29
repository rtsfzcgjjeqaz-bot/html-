import * as cheerio from "cheerio";
import type { ArticleInput, EvidenceItem } from "../types";
import type { StructuredDataItem } from "./articleBatchTypes";

const numericPattern = /(\d|%|％|¥|\$|元|折扣|便宜|节省|成本|价格|月度|年度|对比|比较|更经济)/u;
const priceOrPercentagePattern = /(%|％|¥|\$|元|价格|折扣|节省|成本|便宜)/u;
const comparativePattern = /(比|vs|VS|对比|比较|更|高于|低于|便宜|节省|降低|优先|划算)/u;

function hasNumericData(value: string) {
  return numericPattern.test(value);
}

function hasComparativeData(value: string) {
  return comparativePattern.test(value);
}

function hasPriceOrPercentage(value: string) {
  return priceOrPercentagePattern.test(value);
}

function evidenceForLocation(evidence: EvidenceItem[], sectionId?: string) {
  return evidence.filter((item) => !sectionId || item.sourceLocation.sectionId === sectionId).map((item) => item.evidenceId);
}

export function extractStructuredData(article: ArticleInput, evidence: EvidenceItem[]): StructuredDataItem[] {
  const items: StructuredDataItem[] = [];
  const html = article.rawContent ?? "";
  if (/<table[\s>]/i.test(html)) {
    const $ = cheerio.load(html);
    $("table").each((index, table) => {
      const headers = $(table)
        .find("th")
        .map((_, item) => $(item).text().replace(/\s+/g, " ").trim())
        .get()
        .filter(Boolean);
      const rows: string[][] = [];
      $(table)
        .find("tr")
        .each((_, row) => {
          const cells = $(row)
            .find("td,th")
            .map((__, cell) => $(cell).text().replace(/\s+/g, " ").trim())
            .get()
            .filter(Boolean);
          if (cells.length) rows.push(cells);
        });
      const text = rows.flat().join(" ");
      const containsNumericData = hasNumericData(text);
      const containsComparativeData = hasComparativeData(text);
      const containsPriceOrPercentage = hasPriceOrPercentage(text);
      items.push({
        tableId: `table_${index + 1}`,
        kind: "html_table",
        headers,
        rowCount: rows.length,
        columnCount: Math.max(0, ...rows.map((row) => row.length)),
        containsNumericData,
        containsComparativeData,
        containsPriceOrPercentage,
        importanceLevel: containsPriceOrPercentage || containsComparativeData ? "critical" : containsNumericData ? "supporting" : "decorative",
        sourceLocation: { sectionIndex: index, sectionId: `html_table_${index + 1}` },
        sourceEvidenceIds: [],
        requiresDataDisplayPlan: containsPriceOrPercentage || containsComparativeData,
      });
    });
  }

  article.sections.forEach((section, sectionIndex) => {
    const values = [...section.paragraphs, ...(section.orderedSteps ?? [])];
    const matching = values.filter((value) => hasNumericData(value) && hasComparativeData(value));
    if (!matching.length) return;
    const text = matching.join(" ");
    const containsPriceOrPercentage = hasPriceOrPercentage(text);
    items.push({
      tableId: `data_segment_${sectionIndex + 1}`,
      kind: section.orderedSteps?.length ? "multi_item_numeric_list" : "numeric_comparison_segment",
      headers: [section.heading ?? `Section ${sectionIndex + 1}`],
      rowCount: matching.length,
      columnCount: 1,
      containsNumericData: true,
      containsComparativeData: true,
      containsPriceOrPercentage,
      importanceLevel: containsPriceOrPercentage ? "critical" : "supporting",
      sourceLocation: { ...section.sourceLocation, sectionId: section.sectionId },
      sourceEvidenceIds: evidenceForLocation(evidence, section.sectionId),
      requiresDataDisplayPlan: containsPriceOrPercentage || matching.length > 1,
    });
  });

  return items;
}
