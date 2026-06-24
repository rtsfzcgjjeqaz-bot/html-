import React from "react";
import { Composition } from "remotion";
import rawStructure from "../../video-structure.json";
import type { TimelineScene } from "../timeline/storyboard";
import { VideoFactoryComposition } from "./VideoFactoryComposition";

type FactoryBatchStructure = {
  scenes?: TimelineScene[];
  meta?: { fps?: number; width?: number; height?: number; durationSeconds?: number; durationFrames?: number };
};

type RootStructure = {
  meta?: { fps?: number; width?: number; height?: number; durationSeconds?: number; durationFrames?: number };
  renderConfig?: { duration?: number };
  duration?: number;
  factoryBatch?: FactoryBatchStructure[];
};

const rootStructure = rawStructure as RootStructure;
const fps = rootStructure.meta?.fps ?? 30;
const width = rootStructure.meta?.width ?? 1920;
const height = rootStructure.meta?.height ?? 1080;
const durationSeconds = rootStructure.renderConfig?.duration ?? rootStructure.meta?.durationSeconds ?? rootStructure.duration ?? 30;
const durationInFrames = rootStructure.meta?.durationFrames ?? Math.round(durationSeconds * fps);
const structures = Array.isArray(rootStructure.factoryBatch) ? rootStructure.factoryBatch.slice(0, 10) : [];

export const TenVideoRoot: React.FC = () => (
  <>
    {structures.map((structure, index: number) => (
      <Composition
        key={`WebsiteFactoryVideo${String(index + 1).padStart(2, "0")}`}
        id={`WebsiteFactoryVideo${String(index + 1).padStart(2, "0")}`}
        component={VideoFactoryComposition}
        defaultProps={{ structure }}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
    ))}
  </>
);
