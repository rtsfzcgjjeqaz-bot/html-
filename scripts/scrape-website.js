const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const targetUrl = "http://app-card-price.tnt-pub.com/";
const outputPath = path.join(process.cwd(), "src", "data", "website.json");
const scrapeDir = path.join(process.cwd(), "public", "scrape");

const selectedNames = new Set([
  "ChatGPT",
  "Claude",
  "Gemini",
  "YouTube Premium",
  "Spotify Premium",
  "iCloud+",
  "Netflix",
  "Notion",
  "Duolingo Plus",
  "Apple Music",
]);

const getText = async (page) => {
  try {
    return await page.locator("body").innerText({ timeout: 10000 });
  } catch {
    return "";
  }
};

const extractDataArrayFromHtml = async (html) => {
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  for (const src of scripts) {
    const url = new URL(src, targetUrl).toString();
    const res = await fetch(url);
    if (!res.ok) continue;
    const js = await res.text();
    const marker = 'slug:"chatgpt"';
    const markerIndex = js.indexOf(marker);
    if (markerIndex === -1) continue;
    const start = js.lastIndexOf("[", markerIndex);
    let depth = 0;
    let quote = "";
    let escaped = false;
    for (let index = start; index < js.length; index += 1) {
      const char = js[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = "";
        continue;
      }
      if (char === '"' || char === "'" || char === "`") quote = char;
      else if (char === "[") depth += 1;
      else if (char === "]") {
        depth -= 1;
        if (depth === 0) {
          const arrayLiteral = js.slice(start, index + 1);
          return Function(`return ${arrayLiteral}`)();
        }
      }
    }
  }
  return null;
};

const normalizeDataset = (rawApps, sourceStatus, pageText) => {
  const apps = rawApps
    .filter((app) => selectedNames.has(app.name))
    .map((app) => ({
      slug: app.slug,
      name: app.name,
      plan: app.plans?.[0]?.nameZh || app.plans?.[0]?.name || "Primary plan",
      developer: app.developer,
      category: app.category,
      prices: (app.plans?.[0]?.prices || []).map((price) => ({
        country: price.regionName,
        countryZh: price.regionNameZh,
        regionCode: price.regionCode,
        currency: price.currencyCode,
        localPrice: price.priceLocal,
        priceCny: price.priceCny,
        priceUsd: price.priceUsd,
      })),
    }));

  const countryMap = new Map();
  for (const app of rawApps) {
    for (const plan of app.plans || []) {
      for (const price of plan.prices || []) {
        countryMap.set(price.regionCode, {
          regionCode: price.regionCode,
          country: price.regionName,
          countryZh: price.regionNameZh,
          currency: price.currencyCode,
        });
      }
    }
  }

  return {
    scrapedAt: new Date().toISOString(),
    sourceUrl: targetUrl,
    sourceStatus,
    pageTextSample: pageText.slice(0, 800),
    platform: "App-Card-Price",
    description: "Global Subscription Price Intelligence Platform",
    apps,
    allAppCount: rawApps.length,
    countries: [...countryMap.values()],
    aiDecisionLogic: [
      "Normalize local subscription prices to comparable CNY and USD values",
      "Keep app, country, plan, currency, and price attached as source facts",
      "Rank visible regions from lowest to highest converted price",
      "Surface lowest/highest spread and risk reminder before purchase",
      "Recommend checking the website before subscribing",
    ],
  };
};

const fallbackDataset = () => ({
  scrapedAt: new Date().toISOString(),
  sourceUrl: targetUrl,
  sourceStatus: "fallback_mock_after_scrape_failure",
  pageTextSample: "Scrape attempted, but no parseable site dataset was available.",
  platform: "App-Card-Price",
  description: "Global Subscription Price Intelligence Platform",
  allAppCount: 10,
  countries: [
    { regionCode: "TR", country: "Turkey", countryZh: "土耳其", currency: "TRY" },
    { regionCode: "US", country: "United States", countryZh: "美国", currency: "USD" },
    { regionCode: "JP", country: "Japan", countryZh: "日本", currency: "JPY" },
    { regionCode: "IN", country: "India", countryZh: "印度", currency: "INR" },
  ],
  apps: [
    { name: "ChatGPT", slug: "chatgpt", plan: "Plus Monthly", prices: [{ country: "Turkey", countryZh: "土耳其", regionCode: "TR", currency: "TRY", localPrice: 349.99, priceCny: 68.5, priceUsd: 9.45 }, { country: "United States", countryZh: "美国", regionCode: "US", currency: "USD", localPrice: 19.99, priceCny: 145.2, priceUsd: 19.99 }] },
    { name: "Claude", slug: "claude", plan: "Pro Monthly", prices: [{ country: "Turkey", countryZh: "土耳其", regionCode: "TR", currency: "TRY", localPrice: 349.99, priceCny: 68.5, priceUsd: 9.45 }, { country: "United States", countryZh: "美国", regionCode: "US", currency: "USD", localPrice: 19.99, priceCny: 145.2, priceUsd: 19.99 }] },
  ],
  aiDecisionLogic: ["Normalize local prices", "Compare regions", "Rank lowest visible price", "Show purchase reminder"],
});

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(scrapeDir, { recursive: true });

  let browser;
  let html = "";
  let text = "";
  let sourceStatus = "unknown";
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60000 });
    html = await page.content();
    text = await getText(page);
    await page.screenshot({ path: path.join(scrapeDir, "homepage.png"), fullPage: true });
    sourceStatus = text.includes("Error code 521") ? "cloudflare_521" : "playwright_ok";
  } catch (error) {
    sourceStatus = `playwright_error:${String(error).slice(0, 120)}`;
  } finally {
    if (browser) await browser.close();
  }

  let rawApps = null;
  try {
    if (html && !text.includes("Error code 521")) {
      rawApps = await extractDataArrayFromHtml(html);
    }
  } catch (error) {
    sourceStatus = `${sourceStatus};chunk_parse_error:${String(error).slice(0, 120)}`;
  }

  const dataset = rawApps ? normalizeDataset(rawApps, sourceStatus, text) : fallbackDataset();
  fs.writeFileSync(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ outputPath, sourceStatus: dataset.sourceStatus, appCount: dataset.apps.length, countryCount: dataset.countries.length }, null, 2));
})();
