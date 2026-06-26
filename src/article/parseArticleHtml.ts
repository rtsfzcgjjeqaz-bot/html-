import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import type { ArticleLink, ArticleSection, ArticleSourceLocation } from "./types";

type ParsedArticleHtml = {
  rawContent: string;
  sections: ArticleSection[];
  titleFromH1?: string;
};

type DraftSection = {
  sectionId: string;
  heading?: string;
  headingPath: string[];
  paragraphs: string[];
  orderedSteps?: string[];
  links: ArticleLink[];
  sourceLocation: ArticleSourceLocation;
  listCount: number;
};

function normalizedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function textFromNode($: cheerio.CheerioAPI, element: Element) {
  return normalizedText($(element).text());
}

function ensureSection(sections: DraftSection[], heading?: string, headingPath?: string[]) {
  if (sections.length === 0) {
    sections.push({
      sectionId: `section-${String(sections.length + 1).padStart(2, "0")}`,
      heading,
      headingPath: headingPath ?? (heading ? [heading] : []),
      paragraphs: [],
      orderedSteps: undefined,
      links: [],
      sourceLocation: {
        sectionIndex: 0,
        headingPath: headingPath ?? (heading ? [heading] : []),
      },
      listCount: 0,
    });
  }

  return sections[sections.length - 1];
}

function createSection(sections: DraftSection[], heading: string, headingPath: string[]) {
  const sectionIndex = sections.length;
  const section: DraftSection = {
    sectionId: `section-${String(sectionIndex + 1).padStart(2, "0")}`,
    heading,
    headingPath,
    paragraphs: [],
    orderedSteps: undefined,
    links: [],
    sourceLocation: {
      sectionIndex,
      headingPath,
    },
    listCount: 0,
  };
  sections.push(section);
  return section;
}

function addLinks(
  $: cheerio.CheerioAPI,
  section: DraftSection,
  element: Element,
  sourceLocation: ArticleSourceLocation,
) {
  $(element)
    .find("a[href]")
    .each((linkIndex, anchor) => {
      const href = $(anchor).attr("href")?.trim();
      const anchorText = normalizedText($(anchor).text());
      if (!href || !anchorText) {
        return;
      }
      section.links.push({
        href,
        anchorText,
        sourceLocation: {
          ...sourceLocation,
          headingPath: [...section.headingPath],
        },
      });
    });
}

function commitOrderedSteps(section: DraftSection, steps: string[]) {
  if (steps.length === 0) {
    return;
  }
  section.orderedSteps = [...(section.orderedSteps ?? []), ...steps];
}

function stepSet(section: DraftSection) {
  return new Set((section.orderedSteps ?? []).map((item) => normalizedText(item)));
}

export function parseArticleHtml(contentHtml: string): ParsedArticleHtml {
  const rawHtml = contentHtml.replace(/^\uFEFF/, "").trim();
  const $ = cheerio.load(rawHtml);
  const rootChildren = $("body").length ? $("body").first().children().toArray() : $.root().children().toArray();
  const sections: DraftSection[] = [];

  let currentH2: string | undefined;
  let currentH3: string | undefined;
  let titleFromH1: string | undefined;

  rootChildren.forEach((element) => {
    if (element.type !== "tag") {
      return;
    }

    const tagName = element.tagName.toLowerCase();

    if (tagName === "h1") {
      const heading = textFromNode($, element);
      if (heading && !titleFromH1) {
        titleFromH1 = heading;
      }
      return;
    }

    if (tagName === "h2") {
      const heading = textFromNode($, element);
      if (!heading) {
        return;
      }
      currentH2 = heading;
      currentH3 = undefined;
      createSection(sections, heading, [heading]);
      return;
    }

    if (tagName === "h3") {
      const heading = textFromNode($, element);
      if (!heading) {
        return;
      }
      currentH3 = heading;
      const headingPath = [currentH2, currentH3].filter(Boolean) as string[];
      createSection(sections, heading, headingPath.length ? headingPath : [heading]);
      return;
    }

    const section = ensureSection(sections, currentH2 ?? titleFromH1, [currentH2, currentH3].filter(Boolean) as string[]);
    const baseLocation: ArticleSourceLocation = {
      sectionIndex: section.sourceLocation.sectionIndex,
      headingPath: [...section.headingPath],
    };

    if (tagName === "p") {
      const paragraph = textFromNode($, element);
      if (!paragraph) {
        return;
      }
      const paragraphIndex = section.paragraphs.length;
      section.paragraphs.push(paragraph);
      addLinks($, section, element, { ...baseLocation, paragraphIndex });
      return;
    }

    if (tagName === "ol") {
      const listIndex = section.listCount;
      section.listCount += 1;
      const steps: string[] = [];
      $(element)
        .children("li")
        .each((listItemIndex, item) => {
          const text = textFromNode($, item);
          if (!text) {
            return;
          }
          steps.push(text);
          addLinks($, section, item, { ...baseLocation, listIndex, listItemIndex });
        });
      commitOrderedSteps(section, steps);
      return;
    }

    if (tagName === "ul") {
      const listIndex = section.listCount;
      section.listCount += 1;
      $(element)
        .children("li")
        .each((listItemIndex, item) => {
          const text = textFromNode($, item);
          if (!text) {
            return;
          }
          const paragraphIndex = section.paragraphs.length;
          section.paragraphs.push(text);
          addLinks($, section, item, { ...baseLocation, paragraphIndex, listIndex, listItemIndex });
        });
      return;
    }
  });

  const normalizedSections: ArticleSection[] = sections
    .map((section) => {
      const canonicalSteps = stepSet(section);
      return {
        sectionId: section.sectionId,
        heading: section.heading,
        paragraphs: section.paragraphs.filter((paragraph) => {
          const normalized = normalizedText(paragraph);
          return normalized.length > 0 && !canonicalSteps.has(normalized);
        }),
        orderedSteps: section.orderedSteps?.filter(Boolean),
        links: section.links.length ? section.links : undefined,
        sourceLocation: section.sourceLocation,
      };
    })
    .filter((section) => section.heading || section.paragraphs.length);

  const rawContent = normalizedSections.flatMap((section) => section.paragraphs).join("\n\n").trim();

  return {
    rawContent,
    sections: normalizedSections,
    titleFromH1,
  };
}
