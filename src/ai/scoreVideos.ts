import type { BatchStrategy, BatchStrategyId } from "./generateBatchStrategies";
import type { BatchStoryboard } from "./generateBatchStoryboard";

export type VideoScores = Record<BatchStrategyId, number>;

const uniqueCount = (items: string[]) => new Set(items.filter(Boolean)).size;

export function scoreVideos(strategies: BatchStrategy[], storyboards: BatchStoryboard[]): VideoScores {
  const scores = {} as VideoScores;

  for (const strategy of strategies) {
    const storyboard = storyboards.find((item) => item.strategyId === strategy.strategyId);
    const scenes = storyboard?.scenes ?? [];
    const hookScore = strategy.hookStrength * 0.38;
    const rhythmScore = Math.min(1, uniqueCount(scenes.map((scene) => String(scene.duration))) / Math.max(1, scenes.length)) * 0.16;
    const motionScore = Math.min(1, uniqueCount(scenes.map((scene) => scene.camera.motion)) / 4) * 0.18;
    const emotionScore = strategy.emotion === "urgency" || strategy.emotion === "desire" ? 0.14 : 0.11;
    const densityScore = Math.min(1, scenes.reduce((sum, scene) => sum + scene.textOverlay.length, 0) / Math.max(1, scenes.length * 2)) * 0.14;
    scores[strategy.strategyId] = Number((hookScore + rhythmScore + motionScore + emotionScore + densityScore).toFixed(2));
  }

  return scores;
}
