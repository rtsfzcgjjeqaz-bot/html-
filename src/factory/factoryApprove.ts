import "dotenv/config";
import fs from "fs";
import path from "path";
import { findVideo, readFactoryState, runDirFor, writeFactoryState } from "./factoryState";
import { runQualityGate } from "./qualityGate";
import { runPreviewGate } from "./previewGate";
import { generatePreviewFrames, renderFinalFromStructure, renderPreviewWithPostCheck } from "./sequentialRenderer";

function readArgs() {
  const args = process.argv.slice(2);
  const runIndex = args.indexOf("--runId");
  const videoIndex = args.indexOf("--index");
  return {
    runId: runIndex >= 0 ? args[runIndex + 1] : "",
    index: videoIndex >= 0 ? Number(args[videoIndex + 1]) : 0,
  };
}

async function run() {
  const { runId, index } = readArgs();
  if (!runId || !index) {
    throw new Error('Usage: npm run factory:approve -- --runId "{runId}" --index 1');
  }

  const state = readFactoryState(runId);
  if (index !== state.currentIndex) {
    throw new Error(`Cannot approve video_${String(index).padStart(2, "0")}. Current review index is ${state.currentIndex}.`);
  }

  const current = findVideo(state, index);
  if (current.previewStatus !== "ready") {
    throw new Error(`Cannot approve ${current.videoId}. Preview status is ${current.previewStatus}.`);
  }
  const existingQa = fs.existsSync(current.qaPath) ? JSON.parse(fs.readFileSync(current.qaPath, "utf8")) : null;
  if (!existingQa || existingQa.passed === false || existingQa.status === "failed") {
    throw new Error(`Cannot approve ${current.videoId}. QA failed or missing: ${current.qaPath}`);
  }
  const currentStructure = JSON.parse(fs.readFileSync(current.structurePath, "utf8"));
  const finalGate = runQualityGate(currentStructure, current.qaPath);
  if (!finalGate.passed) {
    throw new Error(`Cannot render final for ${current.videoId}. qualityGate failed: ${current.qaPath}`);
  }

  current.previewStatus = "approved";
  renderFinalFromStructure(current.structurePath, current.finalPath);
  current.finalStatus = "rendered";

  if (index < state.count) {
    const next = findVideo(state, index + 1);
    const structure = JSON.parse(fs.readFileSync(next.structurePath, "utf8"));
    const qa = runPreviewGate(structure, next.qaPath);
    next.qaStatus = qa.status;
    state.currentIndex = index + 1;

    if (qa.status === "failed") {
      next.previewStatus = "rejected";
      writeFactoryState(state);
      console.log(`Current final rendered: ${current.finalPath}`);
      console.log(`Next preview blocked by QA: ${next.qaPath}`);
      return;
    }

    const renderQa = renderPreviewWithPostCheck(next.structurePath, next.previewPath);
    const frameWarnings = generatePreviewFrames(next.previewPath, path.join(runDirFor(runId), "frames"), next.videoId);
    if (frameWarnings.length) {
      const updatedQa = { ...qa, warnings: [...qa.warnings, ...frameWarnings], status: qa.status === "passed" ? "warning" : qa.status, postRender: renderQa };
      fs.writeFileSync(next.qaPath, JSON.stringify(updatedQa, null, 2));
      next.qaStatus = updatedQa.status;
    } else {
      fs.writeFileSync(next.qaPath, JSON.stringify({ ...qa, postRender: renderQa }, null, 2));
    }
    next.previewStatus = "ready";
  } else {
    state.status = "complete";
  }

  writeFactoryState(state);
  console.log(`Final rendered:\n${current.finalPath}`);
  if (index < state.count) {
    const next = findVideo(state, index + 1);
    console.log(`Next preview ready:\n${next.previewPath}`);
  } else {
    console.log("Factory complete.");
  }
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
