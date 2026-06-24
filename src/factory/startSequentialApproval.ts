import fs from "fs";
import path from "path";
import { runQualityGate } from "./qualityGate";
import { ensureRunDirs, type FactoryState, videoIdFor, writeFactoryState } from "./factoryState";
import { generatePreviewFrames, renderPreviewWithPostCheck } from "./sequentialRenderer";

type TenManifestVideo = {
  index: number;
  videoId: string;
  structurePath: string;
  qaPath: string;
  qaStatus: "passed" | "failed" | "warning";
  expressionSystemId?: string;
};

type TenManifest = {
  runId: string;
  url: string;
  count: number;
  videos: TenManifestVideo[];
};

type SequenceScene = {
  layoutId?: string;
  motionId?: string;
  cameraPathId?: string;
  transitionId?: string;
  visualTemplate?: string;
  camera?: { motion?: string };
  expression?: {
    layoutId?: string;
    motionId?: string;
    cameraPathId?: string;
    transitionId?: string;
  };
};

type SequenceStructure = {
  expressionSystemId?: string;
  scenes?: SequenceScene[];
};

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readManifest(runId: string): TenManifest {
  const manifestPath = path.join(process.cwd(), "outputs", "runs", runId, "ten-video-manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing ten-video-manifest.json: ${manifestPath}`);
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function sequencesFromStructure(structure: SequenceStructure) {
  const scenes = Array.isArray(structure.scenes) ? structure.scenes : [];
  return {
    layoutSequence: scenes.map((scene) => scene.layoutId ?? scene.expression?.layoutId ?? scene.visualTemplate ?? "layout"),
    motionSequence: scenes.map((scene) => scene.motionId ?? scene.expression?.motionId ?? "motion"),
    cameraSequence: scenes.map((scene) => scene.cameraPathId ?? scene.expression?.cameraPathId ?? scene.camera?.motion ?? "camera"),
    transitionSequence: scenes.map((scene) => scene.transitionId ?? scene.expression?.transitionId ?? "transition"),
  };
}

export function startSequentialApproval(runId: string) {
  const manifest = readManifest(runId);
  const runDir = ensureRunDirs(runId);
  const videos = manifest.videos.map((item) => {
    const structure = JSON.parse(fs.readFileSync(item.structurePath, "utf8"));
    const seq = sequencesFromStructure(structure);
    return {
      index: item.index,
      videoId: item.videoId || videoIdFor(item.index),
      narrativeId: item.expressionSystemId ?? structure.expressionSystemId ?? "expression",
      ...seq,
      previewStatus: "missing" as const,
      finalStatus: "not_rendered" as const,
      qaStatus: item.qaStatus,
      previewPath: path.join(runDir, "previews", `${item.videoId}.preview.mp4`),
      finalPath: path.join(runDir, "final", `${item.videoId}.final.mp4`),
      structurePath: item.structurePath,
      qaPath: item.qaPath,
      revisionCount: 0,
      lastUserNote: "",
    };
  });

  const state: FactoryState = {
    runId,
    url: manifest.url,
    count: manifest.count,
    currentIndex: 1,
    status: "waiting_review",
    videos,
  };

  const first = state.videos[0];
  if (!first) throw new Error(`No videos in manifest for ${runId}`);
  const firstStructure = JSON.parse(fs.readFileSync(first.structurePath, "utf8"));
  const qa = runQualityGate(firstStructure, first.qaPath);
  first.qaStatus = qa.passed ? "passed" : "failed";

  if (!qa.passed) {
    first.previewStatus = "rejected";
    writeFactoryState(state);
    console.log(`Sequential start blocked by QA: ${first.qaPath}`);
    return state;
  }

  const renderQa = renderPreviewWithPostCheck(first.structurePath, first.previewPath);
  const frameWarnings = generatePreviewFrames(first.previewPath, path.join(runDir, "frames"), first.videoId);
  if (frameWarnings.length || renderQa.status === "passed") {
    const updatedQa = { ...qa, warnings: [...qa.warnings, ...frameWarnings], passed: qa.passed, postRender: renderQa };
    fs.writeFileSync(first.qaPath, JSON.stringify(updatedQa, null, 2));
    first.qaStatus = updatedQa.warnings.length ? "warning" : "passed";
  }
  first.previewStatus = "ready";
  writeFactoryState(state);
  console.log(`Sequential approval started: ${runId}`);
  console.log(`Review first preview: ${first.previewPath}`);
  return state;
}

if (require.main === module) {
  const runId = arg("--runId");
  if (!runId) throw new Error('Usage: npm run factory:sequential -- --runId "run_..."');
  startSequentialApproval(runId);
}
