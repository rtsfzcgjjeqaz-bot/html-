import "dotenv/config";
import fs from "fs";
import path from "path";
import { findVideo, readFactoryState, runDirFor, writeFactoryState } from "./factoryState";
import { runPreviewGate } from "./previewGate";
import { generatePreviewFrames, renderPreviewWithPostCheck } from "./sequentialRenderer";

function readArgs() {
  const args = process.argv.slice(2);
  const runIndex = args.indexOf("--runId");
  const videoIndex = args.indexOf("--index");
  const noteIndex = args.indexOf("--note");
  return {
    runId: runIndex >= 0 ? args[runIndex + 1] : "",
    index: videoIndex >= 0 ? Number(args[videoIndex + 1]) : 0,
    note: noteIndex >= 0 ? args.slice(noteIndex + 1).join(" ") : "",
  };
}

type RevisableScene = {
  visualTemplate?: string;
  layoutId?: string;
  textOverlay?: string[];
  visualIntent?: string;
  animationEvents?: string[];
  [key: string]: unknown;
};

type RevisableStructure = {
  scenes?: RevisableScene[];
  [key: string]: unknown;
};

function reviseStructure(structure: RevisableStructure, note: string, revisionCount: number) {
  const motions = ["push_in", "dolly_left", "tilt_up", "slide_right", "arc", "pull_back"];
  const shots = ["wide", "medium", "close", "wide", "close", "medium"];
  return {
    ...structure,
    scenes: (structure.scenes ?? []).map((scene, index: number) => {
      const motion = motions[index % motions.length];
      const visualTemplate = scene.visualTemplate ?? scene.layoutId ?? `revisedLayout_${index + 1}`;
      return {
        ...scene,
        textOverlay: (scene.textOverlay ?? []).slice(0, 2).map((line: string) => line.replace(/\s+/g, " ").trim()).filter(Boolean),
        visualIntent: `${scene.visualIntent || ""} / revised ${revisionCount + 1}: ${note}`,
        camera: {
          shot: shots[(index + revisionCount) % shots.length],
          motion,
        },
        motionId: `${visualTemplate}_motion_${index + 1}`,
        cameraPathId: `${motion}_${index + 1}`,
        layoutId: `${visualTemplate}_${index + 1}`,
        animationEvents: (scene.animationEvents?.length ?? 0) >= 3 ? scene.animationEvents : ["camera", "primaryVisual", "semanticFocus"],
      };
    }),
  };
}

async function run() {
  const { runId, index, note } = readArgs();
  if (!runId || !index || !note) {
    throw new Error('Usage: npm run factory:revise -- --runId "{runId}" --index 1 --note "text overflow"');
  }

  const state = readFactoryState(runId);
  if (index !== state.currentIndex) {
    throw new Error(`Cannot revise video_${String(index).padStart(2, "0")}. Current review index is ${state.currentIndex}.`);
  }

  const video = findVideo(state, index);
  const original = JSON.parse(fs.readFileSync(video.structurePath, "utf8"));
  const revised = reviseStructure(original, note, video.revisionCount);
  fs.writeFileSync(video.structurePath, JSON.stringify(revised, null, 2));

  const qa = runPreviewGate(revised, video.qaPath);
  video.qaStatus = qa.status;
  video.lastUserNote = note;
  video.revisionCount += 1;

  const revisionPath = path.join(runDirFor(runId), "revision-log.json");
  const existing = fs.existsSync(revisionPath) ? JSON.parse(fs.readFileSync(revisionPath, "utf8")) : [];
  existing.push({
    index,
    videoId: video.videoId,
    note,
    revisionCount: video.revisionCount,
    timestamp: new Date().toISOString(),
    qaStatus: qa.status,
  });
  fs.writeFileSync(revisionPath, JSON.stringify(existing, null, 2));

  if (qa.status === "failed") {
    video.previewStatus = "rejected";
    writeFactoryState(state);
    console.log(`Revision blocked by QA: ${video.qaPath}`);
    return;
  }

  const renderQa = renderPreviewWithPostCheck(video.structurePath, video.previewPath);
  const frameWarnings = generatePreviewFrames(video.previewPath, path.join(runDirFor(runId), "frames"), video.videoId);
  if (frameWarnings.length || renderQa.status === "passed") {
    const updatedQa = { ...qa, warnings: [...qa.warnings, ...frameWarnings], status: qa.status === "passed" && frameWarnings.length ? "warning" : qa.status, postRender: renderQa };
    fs.writeFileSync(video.qaPath, JSON.stringify(updatedQa, null, 2));
    video.qaStatus = updatedQa.status;
  }
  video.previewStatus = "ready";
  writeFactoryState(state);

  console.log(`Revised preview ready:\n${video.previewPath}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
