import { chatJson } from "../lib/openai";
import type { CaptureResult } from "../capture/captureWebsite";
import type { WebsiteAnalysis } from "./analyzeWebsite";
import type { AdStrategy } from "./generateStrategy";

export type HookType = "pattern_interrupt" | "emotional" | "curiosity";
export type CameraShot = "close" | "medium" | "wide";
export type CameraMotion = "zoom" | "pan" | "shake" | "static";

export type StoryboardScene = {
  id: number;
  duration: number;
  hookType: HookType;
  camera: {
    shot: CameraShot;
    motion: CameraMotion;
  };
  visualIntent: string;
  textOverlay: string[];
  assets: {
    image: string[];
    fallback: "ai_generated";
  };
  audioCue: string;
};

export type Storyboard = {
  scenes: StoryboardScene[];
};

const shotForIndex = (capture: CaptureResult, index: number) => capture.screenshots[index % Math.max(capture.screenshots.length, 1)]?.publicPath ?? "";

const fallbackStoryboard = (strategy: AdStrategy, analysis: WebsiteAnalysis, capture: CaptureResult): Storyboard => ({
  scenes: [
    {
      id: 1,
      duration: 5,
      hookType: "pattern_interrupt",
      camera: { shot: "close", motion: "zoom" },
      visualIntent: strategy.hook,
      textOverlay: [strategy.hook],
      assets: { image: [shotForIndex(capture, 0)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "tight pulse hit",
    },
    {
      id: 2,
      duration: 6,
      hookType: "emotional",
      camera: { shot: "medium", motion: "pan" },
      visualIntent: analysis.painPoints[0] || "Show user friction through website evidence.",
      textOverlay: [analysis.painPoints[0] || "Too many signals", "One clear path"],
      assets: { image: [shotForIndex(capture, 1)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "low rising bed",
    },
    {
      id: 3,
      duration: 6,
      hookType: "curiosity",
      camera: { shot: "wide", motion: "pan" },
      visualIntent: analysis.usp,
      textOverlay: [analysis.usp],
      assets: { image: [shotForIndex(capture, 2)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "data reveal accents",
    },
    {
      id: 4,
      duration: 6,
      hookType: "curiosity",
      camera: { shot: "medium", motion: "shake" },
      visualIntent: analysis.coreValue,
      textOverlay: ["Compare", "Understand", "Act"],
      assets: { image: [shotForIndex(capture, 3)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "rhythmic build",
    },
    {
      id: 5,
      duration: 4,
      hookType: "emotional",
      camera: { shot: "wide", motion: "static" },
      visualIntent: strategy.conversionLogic,
      textOverlay: [analysis.productName, analysis.conversionPoints[0] || "Learn more"],
      assets: { image: [shotForIndex(capture, 0)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "clean resolve",
    },
    {
      id: 6,
      duration: 3,
      hookType: "curiosity",
      camera: { shot: "close", motion: "zoom" },
      visualIntent: "Cover-ready brand lockup.",
      textOverlay: [analysis.oneLineValue],
      assets: { image: [shotForIndex(capture, 0)].filter(Boolean), fallback: "ai_generated" },
      audioCue: "final logo hit",
    },
  ],
});

const normalizeStoryboard = (storyboard: Storyboard, fallback: Storyboard): Storyboard => {
  const scenes = (storyboard.scenes?.length >= 5 ? storyboard.scenes : fallback.scenes).slice(0, 7);
  const total = scenes.reduce((sum, scene) => sum + Number(scene.duration || 0), 0) || 30;
  const scale = 30 / total;
  const normalized = scenes.map((scene, index) => ({
    ...fallback.scenes[index % fallback.scenes.length],
    ...scene,
    id: index + 1,
    duration: Math.max(3, Math.round(Number(scene.duration || 5) * scale * 10) / 10),
    assets: {
      image: scene.assets?.image?.length ? scene.assets.image : fallback.scenes[index % fallback.scenes.length].assets.image,
      fallback: "ai_generated" as const,
    },
  }));
  const normalizedTotal = normalized.reduce((sum, scene) => sum + scene.duration, 0);
  normalized[normalized.length - 1].duration = Math.max(3, Math.round((normalized[normalized.length - 1].duration + (30 - normalizedTotal)) * 10) / 10);
  return { scenes: normalized };
};

export async function generateStoryboard(strategy: AdStrategy, analysis: WebsiteAnalysis, capture: CaptureResult): Promise<Storyboard> {
  const fallback = fallbackStoryboard(strategy, analysis, capture);
  const prompt = `
Create a director-level 30-second storyboard for Remotion.
Return strict JSON only. Do not invent product facts or fake prices.

Strategy: ${JSON.stringify(strategy)}
Analysis: ${JSON.stringify(analysis)}
Website title: ${capture.assets.title}
Available screenshot public paths: ${capture.screenshots.map((shot) => shot.publicPath).join(" | ")}
Real key points: ${capture.assets.keyPoints.join(" | ")}

Schema:
{
  "scenes": [
    {
      "id": 1,
      "duration": 5,
      "hookType": "pattern_interrupt | emotional | curiosity",
      "camera": {"shot": "close | medium | wide", "motion": "zoom | pan | shake | static"},
      "visualIntent": "",
      "textOverlay": ["", ""],
      "assets": {"image": [""], "fallback": "ai_generated"},
      "audioCue": ""
    }
  ]
}
`;

  const result = await chatJson<Storyboard>(
    [
      { role: "system", content: "You are a film advertising director. Write structure for motion, not UI implementation." },
      { role: "user", content: prompt },
    ],
    fallback,
    0.7,
  );

  return normalizeStoryboard(result, fallback);
}
