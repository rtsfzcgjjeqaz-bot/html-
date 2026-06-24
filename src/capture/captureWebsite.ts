import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { chromium } from "playwright";
import { screenshotsDir } from "../lib/config";
import { extractWebsiteAssets, type WebsiteAssetSnapshot } from "./extractWebsiteAssets";

export type CapturedScreenshot = {
  id: string;
  label: string;
  path: string;
  src: string;
  publicPath: string;
  scrollY: number;
};

export type CaptureResult = {
  url: string;
  assets: WebsiteAssetSnapshot;
  screenshots: CapturedScreenshot[];
};

const knownAppIconSlugs: Record<string, string[]> = {
  ChatGPT: ["chatgpt", "openai"],
  Claude: ["claude"],
  Gemini: ["gemini"],
  YouTube: ["youtube"],
  Spotify: ["spotify"],
  iCloud: ["icloud"],
  Netflix: ["netflix"],
  Notion: ["notion"],
  Duolingo: ["duolingo"],
};

function extFromContentType(contentType: string) {
  if (contentType.includes("svg")) return ".svg";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";
  return ".png";
}

async function downloadIcon(url: string, outputBase: string) {
  const response = await fetch(url);
  if (!response.ok) return undefined;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return undefined;
  const ext = extFromContentType(contentType);
  const bytes = Buffer.from(await response.arrayBuffer());
  const outputPath = `${outputBase}${ext}`;
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}

async function collectWebsiteAppIcons(pageUrl: string, discovered: WebsiteAssetSnapshot["appIcons"]) {
  const origin = new URL(pageUrl).origin;
  const outputDir = path.join(process.cwd(), "public", "generated", "icons");
  fs.mkdirSync(outputDir, { recursive: true });
  const byName = new Map<string, { appName: string; src: string; publicPath: string }>();

  for (const icon of discovered) {
    try {
      const sourceUrl = new URL(icon.src, origin).href;
      const slug = icon.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const outputBase = path.join(outputDir, slug);
      const localPath = await downloadIcon(sourceUrl, outputBase);
      if (localPath) byName.set(icon.appName, { appName: icon.appName, src: sourceUrl, publicPath: `generated/icons/${path.basename(localPath)}` });
    } catch {
      // Ignore individual icon failures; the known website paths below still run.
    }
  }

  for (const [appName, slugs] of Object.entries(knownAppIconSlugs)) {
    if (byName.has(appName)) continue;
    for (const slug of slugs) {
      try {
        const sourceUrl = `${origin}/icons/${slug}.png`;
        const outputBase = path.join(outputDir, slug);
        const localPath = await downloadIcon(sourceUrl, outputBase);
        if (localPath) {
          byName.set(appName, { appName, src: sourceUrl, publicPath: `generated/icons/${path.basename(localPath)}` });
          break;
        }
      } catch {
        // Continue probing only the target website origin.
      }
    }
  }

  for (const appName of Object.keys(knownAppIconSlugs)) {
    if (byName.has(appName)) continue;
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&entity=software&limit=1`);
      if (!response.ok) continue;
      const data = await response.json() as { results?: Array<{ artworkUrl512?: string; artworkUrl100?: string }> };
      const artwork = data.results?.[0]?.artworkUrl512 || data.results?.[0]?.artworkUrl100;
      if (!artwork) continue;
      const slug = appName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const localPath = await downloadIcon(artwork, path.join(outputDir, slug));
      if (localPath) byName.set(appName, { appName, src: artwork, publicPath: `generated/icons/${path.basename(localPath)}` });
    } catch {
      // Keep the pipeline deterministic even if the official icon lookup is unavailable.
    }
  }

  return Array.from(byName.values());
}

export async function captureWebsite(url: string): Promise<CaptureResult> {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const publicScreenshotsDir = path.join(process.cwd(), "public", "generated", "screenshots");
  fs.mkdirSync(publicScreenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (error) {
    const host = new URL(url).hostname;
    const message = error instanceof Error ? error.message : String(error);
    await page.setContent(`<!doctype html><html><head><title>${host}</title><meta name="description" content="Fallback capture generated because the target page could not be opened." /></head><body style="font-family:Arial,sans-serif;padding:80px;background:#f6f1e9;color:#142127"><h1>${host}</h1><h2>Website capture fallback</h2><p>The pipeline stayed stable even though Playwright could not open the URL.</p><p>${message}</p><button>Learn more</button></body></html>`);
  }
  await page.waitForTimeout(1200);

  const assets = await extractWebsiteAssets(page);
  const appIcons = await collectWebsiteAppIcons(page.url(), assets.appIcons);
  assets.appIcons = appIcons.map((icon) => ({ appName: icon.appName, src: icon.publicPath, alt: icon.appName }));
  const pageHeight = Number(await page.evaluate("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)"));
  const stops = [
    { id: "home", label: "Homepage", y: 0 },
    { id: "features", label: "Feature area", y: Math.round(pageHeight * 0.25) },
    { id: "pricing", label: "Pricing or data area", y: Math.round(pageHeight * 0.5) },
    { id: "compare", label: "Comparison area", y: Math.round(pageHeight * 0.75) },
  ];

  const screenshots: CapturedScreenshot[] = [];
  for (const stop of stops) {
    await page.evaluate(`window.scrollTo(0, ${stop.y})`);
    await page.waitForTimeout(600);

    const filePath = path.join(screenshotsDir, `${stop.id}.png`);
    const publicFilePath = path.join(publicScreenshotsDir, `${stop.id}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    fs.copyFileSync(filePath, publicFilePath);
    screenshots.push({
      id: stop.id,
      label: stop.label,
      path: filePath,
      src: pathToFileURL(filePath).href,
      publicPath: `generated/screenshots/${stop.id}.png`,
      scrollY: stop.y,
    });
  }

  await browser.close();

  return { url, assets, screenshots };
}
