import React from "react";
import { Composition } from "remotion";
import rawStructure from "../../video-structure.json";
import { WebsiteAdVideo } from "./Video";
import { Cover } from "./components/Cover";
import { TenVideoRoot } from "./TenVideoRoot";

type BatchVideo = {
  strategyId?: string;
};

type WebsiteStructure = {
  meta?: { fps?: number; width?: number; height?: number; durationSeconds?: number; durationFrames?: number };
  renderConfig?: { duration?: number };
  duration?: number;
  cover?: { title?: string };
  director?: { brand?: string };
  analysis?: { productName?: string; coreValue?: string; oneLineValue?: string };
  scenes?: Array<{ assets?: { image?: string[] } }>;
  assets?: { screenshots?: string[]; images?: string[] };
  batchVideos?: BatchVideo[];
};

const structure = rawStructure as WebsiteStructure;
const fps = structure.meta?.fps ?? 30;
const width = structure.meta?.width ?? 1920;
const height = structure.meta?.height ?? 1080;
const durationSeconds = structure.renderConfig?.duration ?? structure.meta?.durationSeconds ?? structure.duration ?? 30;
const durationInFrames = structure.meta?.durationFrames ?? Math.round(durationSeconds * fps);
const coverTitle = structure.cover?.title ?? structure.director?.brand ?? structure.analysis?.productName ?? "Website Ad";
const coverSubtitle = structure.analysis?.coreValue ?? structure.analysis?.oneLineValue ?? "AI generated website advertisement";
const coverImage = structure.scenes?.[0]?.assets?.image?.[0] ?? structure.assets?.screenshots?.[0] ?? structure.assets?.images?.[0];
const batchVideos = Array.isArray(structure.batchVideos) ? structure.batchVideos : [];
const batchIds = batchVideos.length ? batchVideos.map((item) => item.strategyId ?? "A") : ["A", "B", "C"];
const toCompositionSafeId = (value: string) => value.replace(/[^a-zA-Z0-9\u4e00-\u9fff-]/g, "-");

export const WebsiteAdRoot: React.FC = () => (
  <>
    <Composition
      id="WebsiteAdPreview"
      component={WebsiteAdVideo}
      defaultProps={{ withAudio: false }}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
    <Composition
      id="WebsiteAdFinal"
      component={WebsiteAdVideo}
      defaultProps={{ withAudio: true }}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
    {batchIds.map((strategyId) => (
      <Composition
        key={strategyId}
        id={`WebsiteAdBatch-${toCompositionSafeId(String(strategyId))}`}
        component={WebsiteAdVideo}
        defaultProps={{ withAudio: false, strategyId }}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
    ))}
    <Composition
      id="WebsiteAdCover"
      component={Cover}
      defaultProps={{ title: coverTitle, subtitle: coverSubtitle, imageSrc: coverImage }}
      durationInFrames={1}
      fps={fps}
      width={width}
      height={height}
    />
      <TenVideoRoot />
  </>
);
