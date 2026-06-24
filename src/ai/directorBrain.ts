import { chatJson } from "../lib/openai";
import type { CaptureResult } from "../capture/captureWebsite";

export type EmotionGoal = "trust" | "desire" | "urgency" | "curiosity";

export type DirectorDecision = {
  brand: string;
  industry: string;
  audience: string;
  emotionGoal: EmotionGoal;
  strategies: ["A", "B", "C"];
};

const inferIndustry = (capture: CaptureResult) => {
  const text = `${capture.assets.title} ${capture.assets.description} ${capture.assets.text}`.toLowerCase();
  if (/(price|pricing|subscription|compare|cost)/.test(text)) return "price intelligence";
  if (/(shop|cart|checkout|product|commerce)/.test(text)) return "ecommerce";
  if (/(ai|automation|dashboard|data|analytics)/.test(text)) return "software";
  return "digital service";
};

export async function directorBrain(capture: CaptureResult): Promise<DirectorDecision> {
  const host = new URL(capture.url).hostname.replace(/^www\./, "");
  const fallback: DirectorDecision = {
    brand: capture.assets.title || host,
    industry: inferIndustry(capture),
    audience: capture.assets.buttons.length ? "website visitors ready to evaluate the offer" : "online decision makers",
    emotionGoal: capture.assets.prices.length || capture.assets.metrics.length ? "curiosity" : "trust",
    strategies: ["A", "B", "C"],
  };

  const prompt = `
You are the AI Creative Director for a generic website-to-ad system.
Return strict JSON only. Use only the supplied website facts.

URL: ${capture.url}
Title: ${capture.assets.title}
Description: ${capture.assets.description}
Headings: ${capture.assets.headings.join(" | ")}
Buttons: ${capture.assets.buttons.join(" | ")}
Key points: ${capture.assets.keyPoints.join(" | ")}

Schema:
{
  "brand": "",
  "industry": "",
  "audience": "",
  "emotionGoal": "trust | desire | urgency | curiosity",
  "strategies": ["A", "B", "C"]
}
`;

  const result = await chatJson<DirectorDecision>(
    [
      { role: "system", content: "Select a stable creative direction for a 30-second web ad." },
      { role: "user", content: prompt },
    ],
    fallback,
    0.45,
  );

  return {
    brand: result.brand || fallback.brand,
    industry: result.industry || fallback.industry,
    audience: result.audience || fallback.audience,
    emotionGoal: ["trust", "desire", "urgency", "curiosity"].includes(result.emotionGoal) ? result.emotionGoal : fallback.emotionGoal,
    strategies: ["A", "B", "C"],
  };
}
