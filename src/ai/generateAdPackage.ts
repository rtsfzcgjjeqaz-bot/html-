import type { CaptureResult } from "../capture/captureWebsite";
import type { DirectorDecision } from "./directorBrain";
import type { WebsiteAnalysis } from "./analyzeWebsite";
import type { AdStrategy, StrategyId } from "./generateStrategy";
import type { Storyboard } from "./generateStoryboard";

export type AdPackageInput = {
  director: DirectorDecision;
  analysis: WebsiteAnalysis;
  strategies: AdStrategy[];
  storyboard: Storyboard;
  capture: CaptureResult;
  selectedStrategy?: StrategyId;
};

export type AdPackage = {
  strategies: AdStrategy[];
  selectedStrategy: StrategyId;
  storyboard: Storyboard;
  bgmKeywords: string[];
  cover: {
    title: string;
    visual: string;
  };
};

export async function generateAdPackage(input: AdPackageInput): Promise<AdPackage> {
  const selectedStrategy = input.selectedStrategy ?? "A";
  const industryKeyword = input.director.industry.replace(/\s+/g, " ").trim();
  const emotionKeyword = input.director.emotionGoal;

  return {
    strategies: input.strategies,
    selectedStrategy,
    storyboard: input.storyboard,
    bgmKeywords: [
      "premium product ad",
      `${industryKeyword} commercial`,
      `${emotionKeyword} cinematic pulse`,
      "clean modern launch",
    ],
    cover: {
      title: input.director.brand || input.analysis.productName,
      visual: input.capture.screenshots[0]?.path || "Minimal brand lockup over website evidence.",
    },
  };
}
