import type { CaptureResult } from "../capture/captureWebsite";
import type { WebsiteAnalysis } from "./analyzeWebsite";
import type { AdStrategy } from "./generateStrategy";
import { generateStoryboard, type StoryboardScene } from "./generateStoryboard";
import type { BatchStrategy, BatchStrategyId } from "./generateBatchStrategies";

export type BatchStoryboard = {
  strategyId: BatchStrategyId;
  scenes: StoryboardScene[];
};

const toAdStrategy = (strategy: BatchStrategy, analysis: WebsiteAnalysis): AdStrategy => ({
  id: strategy.strategyId,
  name: strategy.type,
  hook: strategy.angle,
  angle: strategy.angle,
  emotionCurve:
    strategy.type === "pain_attack"
      ? "shock -> pressure -> proof -> relief"
      : strategy.type === "comparison"
        ? "question -> contrast -> evidence -> trust"
        : "curiosity -> beauty -> value -> desire",
  conversionLogic: `${analysis.coreValue} leads to ${analysis.conversionPoints[0] || "the next action"}.`,
});

const applyVariantGrammar = (strategy: BatchStrategy, scenes: StoryboardScene[]): StoryboardScene[] => {
  const grammars = {
    A: {
      hookType: "pattern_interrupt" as const,
      shots: ["close", "close", "medium", "close", "wide", "close"] as const,
      motions: ["shake", "zoom", "shake", "pan", "static", "zoom"] as const,
      prefix: "Problem",
    },
    B: {
      hookType: "curiosity" as const,
      shots: ["wide", "medium", "wide", "medium", "wide", "wide"] as const,
      motions: ["pan", "static", "pan", "zoom", "static", "pan"] as const,
      prefix: "Compare",
    },
    C: {
      hookType: "emotional" as const,
      shots: ["medium", "wide", "close", "wide", "medium", "close"] as const,
      motions: ["zoom", "pan", "static", "zoom", "pan", "static"] as const,
      prefix: "Look",
    },
  }[strategy.strategyId];

  return scenes.map((scene, index) => ({
    ...scene,
    hookType: index === 0 ? grammars.hookType : scene.hookType,
    camera: {
      shot: grammars.shots[index % grammars.shots.length],
      motion: grammars.motions[index % grammars.motions.length],
    },
    visualIntent: `[${strategy.type}] ${scene.visualIntent}`,
    textOverlay: index === 0 ? [grammars.prefix, ...scene.textOverlay].slice(0, 2) : scene.textOverlay,
    audioCue: `${strategy.emotion} / ${scene.audioCue}`,
  }));
};

export async function generateBatchStoryboard(
  strategies: BatchStrategy[],
  analysis: WebsiteAnalysis,
  capture: CaptureResult,
): Promise<BatchStoryboard[]> {
  return Promise.all(
    strategies.map(async (strategy) => {
      const storyboard = await generateStoryboard(toAdStrategy(strategy, analysis), analysis, capture);
      return {
        strategyId: strategy.strategyId,
        scenes: applyVariantGrammar(strategy, storyboard.scenes),
      };
    }),
  );
}
