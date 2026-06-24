import crypto from "crypto";
import type { CaptureResult } from "../capture/captureWebsite";
import type { WebsiteAnalysis } from "../ai/analyzeWebsite";

export type LockedContentScene = {
  id: number;
  purpose: "hook" | "scope" | "flow" | "comparison" | "decision" | "summary";
  message: string;
  dataRefs: string[];
};

export type LockedVideoContent = {
  contentHash: string;
  productName: string;
  coreValue: string;
  usp: string;
  appList: string[];
  appIcons: Array<{ appName: string; src: string; alt: string }>;
  countryData: string[];
  pricingData: string[];
  aiDecisionLogic: string[];
  scenes: LockedContentScene[];
};

const looksGarbled = (value: string) => /�|鍏|瑙|槄|鐞|浠|鏈|涓|绾|骞|鏍|鏂|馃|銆|€|泄|楼/.test(value);
const cleanValue = (value: string, fallback: string) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized || looksGarbled(normalized)) return fallback;
  if ([...normalized].some((char) => char.charCodeAt(0) > 0x7f)) return fallback;
  if (/[-–—:|]\s*$/.test(normalized)) return fallback;
  return normalized;
};
const unique = (items: string[]) => Array.from(new Set(items.map((item) => cleanValue(item, "")).filter(Boolean)));
const compact = (value: string, max = 54) => {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const words = clean.split(" ");
  let output = "";
  for (const word of words) {
    if (`${output} ${word}`.trim().length > max) break;
    output = `${output} ${word}`.trim();
  }
  if (/\b(and|or|for|with|to|of|in)$/i.test(output)) output = output.replace(/\s+\S+$/, "");
  return output || clean.slice(0, max).trim();
};

function inferApps(capture: CaptureResult, analysis: WebsiteAnalysis) {
  const text = `${capture.assets.text} ${analysis.coreSellingPoints.join(" ")}`;
  const known = ["ChatGPT", "Claude", "Gemini", "YouTube", "Spotify", "iCloud", "Netflix"];
  const iconApps = (capture.assets.appIcons ?? []).map((icon) => icon.appName);
  return unique([...iconApps, ...known.filter((name) => new RegExp(name, "i").test(text))]).slice(0, 6);
}

function inferCountries(capture: CaptureResult) {
  const text = capture.assets.text;
  const known = ["United States", "Japan", "Turkey", "India", "Brazil", "China", "Argentina"];
  const cnHints: Record<string, string> = { "美国": "United States", "日本": "Japan", "土耳其": "Turkey", "印度": "India", "巴西": "Brazil", "中国": "China", "阿根廷": "Argentina" };
  const found = known.filter((name) => new RegExp(name, "i").test(text));
  for (const [hint, name] of Object.entries(cnHints)) if (text.includes(hint)) found.push(name);
  return unique(found).slice(0, 6);
}

export function buildContentLock(capture: CaptureResult, analysis: WebsiteAnalysis): LockedVideoContent {
  const appList = inferApps(capture, analysis);
  const appIcons = (capture.assets.appIcons ?? []).filter((icon) => appList.includes(icon.appName)).slice(0, 6);
  const countryData = inferCountries(capture);
  const pricingData = unique([...capture.assets.prices, ...capture.assets.metrics, "global price reference", "subscription cost", "Low / Average / High"]).slice(0, 6);
  const aiDecisionLogic = ["collect app price signals", "compare country data", "check risk context", "recommend a buying route"];
  const productName = compact(cleanValue(analysis.productName || capture.assets.title || "", "SubPrice AI"), 34);
  const coreValue = compact(cleanValue(analysis.coreValue || analysis.oneLineValue || "", "Global subscription price intelligence for AI tools and digital subscriptions."), 60);
  const usp = compact(cleanValue(analysis.usp || analysis.coreSellingPoints[0] || "", "Global subscription price reference"), 54);

  const scenes: LockedContentScene[] = [
    { id: 1, purpose: "hook", message: "One subscription, many regional costs.", dataRefs: ["appList", "countryData"] },
    { id: 2, purpose: "scope", message: "Real app icons anchor the dataset.", dataRefs: ["appList"] },
    { id: 3, purpose: "flow", message: "Search once. Trace every signal.", dataRefs: ["aiDecisionLogic"] },
    { id: 4, purpose: "comparison", message: "Country context reveals the pattern.", dataRefs: ["countryData", "pricingData"] },
    { id: 5, purpose: "decision", message: "AI weighs price, region, and risk.", dataRefs: ["aiDecisionLogic", "pricingData"] },
    { id: 6, purpose: "summary", message: "One view compresses every signal.", dataRefs: ["pricingData", "countryData", "aiDecisionLogic"] },
    { id: 7, purpose: "scope", message: "Services stay linked to routes.", dataRefs: ["appList", "aiDecisionLogic"] },
    { id: 8, purpose: "summary", message: `${productName} turns price data into decisions.`, dataRefs: ["aiDecisionLogic", "countryData", "pricingData"] },
  ];

  const withoutHash = { productName, coreValue, usp, appList, appIcons, countryData, pricingData, aiDecisionLogic, scenes };
  const contentHash = crypto.createHash("sha256").update(JSON.stringify(withoutHash)).digest("hex").slice(0, 16);
  return { contentHash, ...withoutHash };
}
