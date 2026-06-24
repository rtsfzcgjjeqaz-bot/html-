export type TimelineScene = {
  id?: number;
  duration?: number;
};

export type TimelineItem<T extends TimelineScene> = {
  scene: T;
  index: number;
  startFrame: number;
  durationFrames: number;
};

export function buildTimeline<T extends TimelineScene>(scenes: T[], fps: number): TimelineItem<T>[] {
  let cursor = 0;

  return scenes.map((scene, index) => {
    const durationFrames = Math.max(1, Math.round(Number(scene.duration || 5) * fps));
    const item = {
      scene,
      index,
      startFrame: cursor,
      durationFrames,
    };
    cursor += durationFrames;
    return item;
  });
}
