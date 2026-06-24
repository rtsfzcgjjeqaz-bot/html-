import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { buildTimeline } from "../timeline/storyboard";
import { SceneRenderer } from "./components/SceneRenderer";

type VideoFactoryCompositionProps = {
  structure: { meta?: { fps?: number }; scenes?: Parameters<typeof buildTimeline>[0] };
  strategyId?: "A" | "B" | "C";
};

export const VideoFactoryComposition: React.FC<VideoFactoryCompositionProps> = ({ structure, strategyId }) => {
  void strategyId;
  const fps = structure?.meta?.fps ?? 30;
  const scenes = Array.isArray(structure?.scenes) ? structure.scenes : [];
  const timeline = buildTimeline(scenes, fps);

  return (
    <AbsoluteFill style={{ background: "#F6F9FF" }}>
      {timeline.map(({ scene, index, startFrame, durationFrames }) => (
        <Sequence key={scene.id ?? index} from={startFrame} durationInFrames={durationFrames} premountFor={fps}>
          <SceneRenderer scene={scene} sceneIndex={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
