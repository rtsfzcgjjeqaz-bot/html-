import type { TimelineItem, TimelineScene } from "./storyboard";

export type Beat = {
  frame: number;
  strength: "strong" | "weak";
  sceneIndex: number;
};

export function buildBeatMap<T extends TimelineScene>(timeline: TimelineItem<T>[]): Beat[] {
  return timeline.flatMap((item) => [
    {
      frame: item.startFrame,
      strength: "strong" as const,
      sceneIndex: item.index,
    },
    {
      frame: item.startFrame + Math.max(1, item.durationFrames - 10),
      strength: "weak" as const,
      sceneIndex: item.index,
    },
  ]);
}
