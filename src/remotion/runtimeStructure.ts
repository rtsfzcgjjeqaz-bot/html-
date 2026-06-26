import rawStructure from "../../video-structure.json";
import type { ResolvedScene } from "../factory/shotPlanner";

export type RuntimeBatchVideo = {
  strategyId?: string;
  scenes?: ResolvedScene[];
};

export type RuntimeStructure = {
  meta?: { fps?: number; width?: number; height?: number; durationSeconds?: number; durationFrames?: number };
  renderConfig?: { duration?: number };
  duration?: number;
  scenes?: ResolvedScene[];
  batchVideos?: RuntimeBatchVideo[];
  cover?: { title?: string };
  director?: { brand?: string };
  analysis?: { productName?: string; coreValue?: string; oneLineValue?: string };
  assets?: { screenshots?: string[]; images?: string[] };
  articleJob?: {
    jobId: string;
    articleId: string;
    selectedEvidenceIds: string[];
    selectedShotIds: string[];
    selectedChoreographyIds: string[];
  };
};

export type RuntimeInputProps = {
  withAudio?: boolean;
  strategyId?: "A" | "B" | "C";
  structure?: RuntimeStructure;
  resolvedScenes?: ResolvedScene[];
};

export function getDefaultCompositionSpec() {
  const structure = getDefaultRuntimeStructure();
  const { fps, width, height } = resolveRuntimeMeta(structure);
  return { fps, width, height };
}

export function getDefaultRuntimeStructure(): RuntimeStructure {
  return rawStructure as unknown as RuntimeStructure;
}

export function resolveRuntimeStructure(props?: Pick<RuntimeInputProps, "structure" | "resolvedScenes">): RuntimeStructure {
  if (props?.structure) {
    return props.structure;
  }
  if (props?.resolvedScenes?.length) {
    const durationFrames = props.resolvedScenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);
    return {
      meta: { fps: 30, width: 1920, height: 1080, durationFrames },
      renderConfig: { duration: durationFrames / 30 },
      scenes: props.resolvedScenes,
    };
  }
  return getDefaultRuntimeStructure();
}

export function resolveRuntimeMeta(structure: RuntimeStructure) {
  const fps = structure.meta?.fps ?? 30;
  const width = structure.meta?.width ?? 1920;
  const height = structure.meta?.height ?? 1080;
  const durationSeconds = structure.renderConfig?.duration ?? structure.meta?.durationSeconds ?? structure.duration ?? 30;
  const durationInFrames = structure.meta?.durationFrames ?? Math.round(durationSeconds * fps);
  return { fps, width, height, durationSeconds, durationInFrames };
}

export function pickScenesFromStructure(structure: RuntimeStructure, strategyId?: "A" | "B" | "C") {
  if (strategyId && Array.isArray(structure.batchVideos)) {
    const batch = structure.batchVideos.find((item) => item.strategyId === strategyId);
    if (Array.isArray(batch?.scenes)) return batch.scenes;
  }
  return Array.isArray(structure.scenes) ? structure.scenes : [];
}
