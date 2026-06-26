import React from "react";
import { Composition } from "remotion";
import { WebsiteAdVideo } from "./Video";
import { Cover } from "./components/Cover";
import { TenVideoRoot } from "./TenVideoRoot";
import { getDefaultRuntimeStructure, resolveRuntimeMeta, resolveRuntimeStructure, type RuntimeInputProps } from "./runtimeStructure";

const structure = getDefaultRuntimeStructure();
const { fps, width, height, durationInFrames } = resolveRuntimeMeta(structure);
const coverTitle = structure.cover?.title ?? structure.director?.brand ?? structure.analysis?.productName ?? "Website Ad";
const coverSubtitle = structure.analysis?.coreValue ?? structure.analysis?.oneLineValue ?? "AI generated website advertisement";
const coverImage = structure.scenes?.[0]?.assets?.image?.[0] ?? structure.assets?.screenshots?.[0] ?? structure.assets?.images?.[0];
const batchVideos = Array.isArray(structure.batchVideos) ? structure.batchVideos : [];
const batchIds = batchVideos.length ? batchVideos.map((item) => item.strategyId ?? "A") : ["A", "B", "C"];
const toCompositionSafeId = (value: string) => value.replace(/[^a-zA-Z0-9\u4e00-\u9fff-]/g, "-");
const calculateMetadata = ({ props }: { props: RuntimeInputProps }) => {
  const resolved = resolveRuntimeStructure(props);
  return resolveRuntimeMeta(resolved);
};

export const WebsiteAdRoot: React.FC = () => (
  <>
    <Composition
      id="WebsiteAdPreview"
      component={WebsiteAdVideo}
      defaultProps={{ withAudio: false }}
      calculateMetadata={calculateMetadata}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
    <Composition
      id="WebsiteAdFinal"
      component={WebsiteAdVideo}
      defaultProps={{ withAudio: true }}
      calculateMetadata={calculateMetadata}
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
