import { chatJson } from "../lib/openai";
import type { CaptureResult } from "../capture/captureWebsite";

export type WebsiteAnalysis = {
  brandPositioning: string;
  coreValue: string;
  usp: string;
  painPoints: string[];
  emotionalTrigger: string;
  productName: string;
  oneLineValue: string;
  adAngles: string[];
  coreSellingPoints: string[];
  targetUsers: string[];
  conversionPoints: string[];
  dataHighlights: string[];
  visualEvidence: string[];
};

const fallbackAnalysis = (capture: CaptureResult): WebsiteAnalysis => {
  const title = capture.assets.title || new URL(capture.url).hostname;
  const keyPoints = capture.assets.keyPoints.length ? capture.assets.keyPoints : ["Website content", "Core offer", "User action"];
  const dataHighlights = [...capture.assets.prices.slice(0, 6), ...capture.assets.metrics.slice(0, 6)];

  return {
    brandPositioning: `${title} helps users understand the offer faster.`,
    coreValue: capture.assets.description || keyPoints[0] || "Clear value from website data.",
    usp: keyPoints[0] || "A focused website experience with clear decision signals.",
    painPoints: ["Users need to understand value quickly", "Key details can be hard to compare", "Decision confidence is often low"],
    emotionalTrigger: dataHighlights.length ? "curiosity" : "trust",
    productName: title,
    oneLineValue: capture.assets.description || "Turn website information into a clear decision.",
    adAngles: ["Problem to solution", "Proof from real website data"],
    coreSellingPoints: capture.assets.headings.slice(0, 4).length ? capture.assets.headings.slice(0, 4) : keyPoints,
    targetUsers: ["Website visitors", "Decision makers", "Buyers comparing options"],
    conversionPoints: capture.assets.buttons.slice(0, 4).length ? capture.assets.buttons.slice(0, 4) : ["Visit website", "Learn more"],
    dataHighlights,
    visualEvidence: capture.screenshots.map((shot) => shot.label),
  };
};

export async function analyzeWebsite(capture: CaptureResult): Promise<WebsiteAnalysis> {
  const fallback = fallbackAnalysis(capture);
  const prompt = `
Analyze this website for a standardized AI Creative Director system.
Return strict JSON only. Use only facts from the website.

URL: ${capture.url}
Title: ${capture.assets.title}
Description: ${capture.assets.description}
Headings: ${capture.assets.headings.join(" | ")}
Buttons: ${capture.assets.buttons.join(" | ")}
Prices: ${capture.assets.prices.join(" | ")}
Metrics: ${capture.assets.metrics.join(" | ")}
Tables: ${capture.assets.tables.map((table) => table.join(" / ")).join(" | ")}
Body text: ${capture.assets.text.slice(0, 3000)}

Schema:
{
  "brandPositioning": "",
  "coreValue": "",
  "usp": "",
  "painPoints": ["", "", ""],
  "emotionalTrigger": "",
  "productName": "",
  "oneLineValue": "",
  "adAngles": ["", ""],
  "coreSellingPoints": ["", ""],
  "targetUsers": ["", ""],
  "conversionPoints": ["", ""],
  "dataHighlights": ["", ""],
  "visualEvidence": ["", ""]
}
`;

  const result = await chatJson<WebsiteAnalysis>(
    [
      { role: "system", content: "You are a commercial strategist for premium product advertising. Return structured facts, not prose." },
      { role: "user", content: prompt },
    ],
    fallback,
  );

  return {
    ...fallback,
    ...result,
    painPoints: result.painPoints?.length ? result.painPoints : fallback.painPoints,
    adAngles: result.adAngles?.length ? result.adAngles : fallback.adAngles,
    coreSellingPoints: result.coreSellingPoints?.length ? result.coreSellingPoints : fallback.coreSellingPoints,
    targetUsers: result.targetUsers?.length ? result.targetUsers : fallback.targetUsers,
    conversionPoints: result.conversionPoints?.length ? result.conversionPoints : fallback.conversionPoints,
    dataHighlights: result.dataHighlights?.length ? result.dataHighlights : fallback.dataHighlights,
    visualEvidence: result.visualEvidence?.length ? result.visualEvidence : fallback.visualEvidence,
  };
}
