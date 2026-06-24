import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import rawStructure from "../../video-structure.json";
import { buildBeatMap } from "../timeline/beatMap";
import { buildTimeline, type TimelineScene } from "../timeline/storyboard";
import { Scene } from "./components/Scene";

type WebsiteAdVideoProps = {
  withAudio?: boolean;
  strategyId?: "A" | "B" | "C";
};

type BatchVideo = {
  strategyId?: "A" | "B" | "C";
  scenes?: TimelineScene[];
};

type WebsiteStructure = {
  meta?: { fps?: number };
  scenes?: TimelineScene[];
  batchVideos?: BatchVideo[];
};

const structure = rawStructure as WebsiteStructure;
const fps = structure.meta?.fps ?? 30;

const pickScenes = (strategyId?: "A" | "B" | "C") => {
  if (strategyId && Array.isArray(structure.batchVideos)) {
    const batch = structure.batchVideos.find((item) => item.strategyId === strategyId);
    if (Array.isArray(batch?.scenes)) return batch.scenes;
  }
  return Array.isArray(structure.scenes) ? structure.scenes : [];
};

export const WebsiteAdVideo: React.FC<WebsiteAdVideoProps> = ({ withAudio = false, strategyId }) => {
  const scenes = pickScenes(strategyId);
  const timeline = buildTimeline(scenes, fps);
  buildBeatMap(timeline);

  return (
    <AbsoluteFill style={{ background: "#f6f1e9" }}>
      {withAudio ? <Audio src={staticFile("audio/bgm.mp3")} volume={0.22} /> : null}
      {timeline.map(({ scene, index, startFrame, durationFrames }) => {
        return (
          <Sequence key={scene.id ?? index} from={startFrame} durationInFrames={durationFrames} premountFor={fps}>
            <Scene scene={scene} sceneIndex={index} strategyId={strategyId} />
          </Sequence>
        );
      })}
      {withAudio ? <Audio src={staticFile("audio/voice.mp3")} volume={1} /> : null}
    </AbsoluteFill>
  );
};
