import path from "path";
import { loadArticleFile } from "./loadArticleFile";
import type { ArticleInput, ArticleSection, ArticleSourceType } from "./types";

type ParsedFrontmatter = {
  metadata: Record<string, string>;
  body: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "article";
}

function stableArticleId(fileName: string) {
  return slugify(path.basename(fileName, path.extname(fileName)));
}

function parseFrontmatter(rawContent: string): ParsedFrontmatter {
  const normalized = rawContent.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { metadata: {}, body: rawContent };
  }
  const lines = normalized.split("\n");
  let closingIndex = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (/^-{3,}\s*$/.test(lines[index])) {
      closingIndex = index;
      break;
    }
  }
  if (closingIndex === -1) {
    return { metadata: {}, body: rawContent };
  }

  const metadata: Record<string, string> = {};
  for (const line of lines.slice(1, closingIndex)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key && value) metadata[key] = value;
  }
  return {
    metadata,
    body: lines.slice(closingIndex + 1).join("\n").trim(),
  };
}

function splitParagraphs(block: string) {
  return block
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function collectOrderedSteps(paragraphs: string[]) {
  const steps = paragraphs
    .filter((paragraph) => /^\d+[.)]\s+/.test(paragraph))
    .map((paragraph) => paragraph.replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);
  return steps.length ? steps : undefined;
}

function removeParagraphsDuplicatedBySteps(paragraphs: string[], orderedSteps?: string[]) {
  if (!orderedSteps?.length) {
    return paragraphs;
  }
  const canonicalSteps = new Set(orderedSteps.map((step) => step.replace(/\s+/g, " ").trim()));
  return paragraphs.filter((paragraph) => {
    const normalized = paragraph.replace(/^\d+[.)]\s+/, "").replace(/\s+/g, " ").trim();
    return normalized.length > 0 && !canonicalSteps.has(normalized);
  });
}

function buildSections(body: string, sourceType: ArticleSourceType): ArticleSection[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  if (sourceType === "text") {
    const paragraphs = splitParagraphs(normalized);
    const orderedSteps = collectOrderedSteps(paragraphs);
    return [
      {
        sectionId: "section-01",
        paragraphs: removeParagraphsDuplicatedBySteps(paragraphs, orderedSteps),
        orderedSteps,
        sourceLocation: { lineStart: 1, lineEnd: normalized.split("\n").length },
      },
    ];
  }

  const lines = normalized.split("\n");
  const sections: ArticleSection[] = [];
  let currentHeading: string | undefined;
  let currentLines: string[] = [];
  let sectionLineStart = 1;

  const flush = (lineEnd: number) => {
    const paragraphs = splitParagraphs(currentLines.join("\n"));
    const orderedSteps = collectOrderedSteps(paragraphs);
    if (!currentHeading && paragraphs.length === 0) return;
    sections.push({
      sectionId: `section-${String(sections.length + 1).padStart(2, "0")}`,
      heading: currentHeading,
      paragraphs: removeParagraphsDuplicatedBySteps(paragraphs, orderedSteps),
      orderedSteps,
      sourceLocation: { lineStart: sectionLineStart, lineEnd },
    });
  };

  lines.forEach((line, index) => {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line.trim());
    if (headingMatch) {
      if (currentHeading || currentLines.join("").trim()) {
        flush(index);
      }
      currentHeading = headingMatch[2].trim();
      currentLines = [];
      sectionLineStart = index + 1;
      return;
    }
    if (!currentHeading && !currentLines.length && !line.trim()) {
      sectionLineStart = index + 2;
      return;
    }
    currentLines.push(line);
  });

  flush(lines.length);
  return sections.filter((section) => section.heading || section.paragraphs.length);
}

function firstNonEmptyLine(body: string) {
  return body
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
}

export function parseArticleFile(inputPath: string): ArticleInput {
  const loaded = loadArticleFile(inputPath);
  const { metadata, body } = parseFrontmatter(loaded.rawContent);
  const sections = buildSections(body, loaded.sourceType);

  const headingTitle = sections.find((section) => section.heading)?.heading;
  const title = metadata.title ?? headingTitle ?? firstNonEmptyLine(body) ?? stableArticleId(loaded.fileName);
  const summary =
    metadata.summary ??
    sections.flatMap((section) => section.paragraphs).find(Boolean) ??
    title;

  return {
    articleId: metadata.articleId ?? stableArticleId(loaded.fileName),
    sourceType: loaded.sourceType,
    title,
    summary,
    rawContent: body,
    sections,
    sourceUrl: metadata.sourceUrl,
    publishedAt: metadata.publishedAt,
    cta: {
      text: metadata.ctaText,
      url: metadata.ctaUrl,
    },
    metadata,
  };
}
