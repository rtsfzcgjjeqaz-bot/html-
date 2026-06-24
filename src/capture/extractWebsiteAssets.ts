import type { Page } from "playwright";

export type WebsiteAssetSnapshot = {
  title: string;
  description: string;
  keyPoints: string[];
  text: string;
  headings: string[];
  buttons: string[];
  links: string[];
  tables: string[][];
  metrics: string[];
  prices: string[];
  images: Array<{ src: string; alt: string; title: string }>;
  appIcons: Array<{ appName: string; src: string; alt: string }>;
};

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

export async function extractWebsiteAssets(page: Page): Promise<WebsiteAssetSnapshot> {
  const snapshot = (await page.evaluate(`(() => {
    const cleanInner = (value) => value.replace(/\\s+/g, " ").trim();
    const text = cleanInner(document.body.innerText || "");
    const description = cleanInner(
      document.querySelector('meta[name="description"]')?.getAttribute("content") ||
      document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
      ""
    );
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
      .map((node) => cleanInner(node.textContent || ""))
      .filter(Boolean)
      .slice(0, 30);
    const buttons = Array.from(document.querySelectorAll("button,a"))
      .map((node) => cleanInner(node.textContent || ""))
      .filter(Boolean)
      .slice(0, 40);
    const links = Array.from(document.querySelectorAll("a"))
      .map((node) => node.href)
      .filter(Boolean)
      .slice(0, 30);
    const images = Array.from(document.querySelectorAll("img"))
      .map((node) => ({
        src: node.currentSrc || node.src || "",
        alt: cleanInner(node.getAttribute("alt") || ""),
        title: cleanInner(node.getAttribute("title") || ""),
      }))
      .filter((item) => item.src)
      .slice(0, 80);
    const appNames = ["ChatGPT", "Claude", "Gemini", "YouTube", "Spotify", "iCloud", "Netflix", "Notion", "Duolingo", "Canva", "Figma"];
    const appIcons = images
      .map((image) => {
        const haystack = (image.src + " " + image.alt + " " + image.title).toLowerCase();
        const appName = appNames.find((name) => haystack.includes(name.toLowerCase())) || "";
        return appName ? { appName, src: image.src, alt: image.alt || appName } : null;
      })
      .filter(Boolean)
      .slice(0, 30);
    const tables = Array.from(document.querySelectorAll("table"))
      .map((table) =>
        Array.from(table.querySelectorAll("tr"))
          .map((row) => cleanInner(row.textContent || ""))
          .filter(Boolean)
          .slice(0, 20)
      )
      .filter((rows) => rows.length > 0)
      .slice(0, 5);
    const prices = Array.from(text.matchAll(/(?:[$¥€£]\\s?\\d+(?:[.,]\\d+)?|\\d+(?:[.,]\\d+)?\\s?(?:USD|CNY|JPY|EUR|GBP|RUB|元|円))/gi))
      .map((match) => match[0])
      .slice(0, 60);
    const metrics = Array.from(text.matchAll(/\\b\\d+(?:[.,]\\d+)?\\s?(?:%|x|countries|regions|apps|services)\\b/gi))
      .map((match) => match[0])
      .slice(0, 40);
    const textSentences = text
      .split(/[.!?。！？\\n]/)
      .map(cleanInner)
      .filter((item) => item.length > 8)
      .slice(0, 8);
    const keyPoints = Array.from(new Set([...headings, ...buttons, ...textSentences]))
      .filter(Boolean)
      .slice(0, 3);
    while (keyPoints.length < 3) {
      keyPoints.push(["Website content", "Core offer", "User action"][keyPoints.length]);
    }

    return {
      title: document.title || "",
      description,
      keyPoints,
      text,
      headings,
      buttons,
      links,
      tables,
      metrics,
      prices,
      images,
      appIcons,
    };
  })()`)) as WebsiteAssetSnapshot;

  return {
    ...snapshot,
    text: clean(snapshot.text),
    title: clean(snapshot.title),
    description: clean(snapshot.description),
    keyPoints: snapshot.keyPoints.map(clean).slice(0, 3),
    images: snapshot.images ?? [],
    appIcons: snapshot.appIcons ?? [],
  };
}
