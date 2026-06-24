import fs from "fs";
import path from "path";
import { outputsDir } from "../lib/config";
import type { BatchStrategyId } from "../ai/generateBatchStrategies";
import type { VideoScores } from "../ai/scoreVideos";

export type SelectedVideo = {
  strategyId: BatchStrategyId;
  score: number;
  source: string;
  final: string;
};

export function selectBestVideo(scores: VideoScores): SelectedVideo {
  const entries = Object.entries(scores) as [BatchStrategyId, number][];
  const [strategyId, score] = entries.sort((a, b) => b[1] - a[1])[0] ?? ["A", 0];
  const source = path.join(outputsDir, "batch", `video_${strategyId}.mp4`);
  const final = path.join(outputsDir, "final.mp4");

  if (!fs.existsSync(source)) {
    throw new Error(`Cannot select best video. Missing render: ${source}`);
  }

  fs.copyFileSync(source, final);
  return { strategyId, score, source, final };
}
