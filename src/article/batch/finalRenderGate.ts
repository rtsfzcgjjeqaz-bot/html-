import fs from "fs";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { hashFile, resolveCheckpointArtifact, type BatchCheckpointManifest } from "./checkpointManager";

const remotionEntry = "src/index.ts";

export type FinalRenderManifest = {
  finalAttemptId: string;
  createdAt: string;
  checkpointId: string;
  sourceSnapshotId: string;
  articleVideoJobHash: string;
  runtimeSelectionPlanHash: string;
  visibleCopyAttemptHash: string;
  previewAttemptId: string;
  renderInputHash: string;
  finalFileHash?: string;
  finalFileRelativePath: string;
  finalFileSizeBytes: number;
  width: number;
  height: number;
  fps: number;
  durationFrames: number;
  status: "passed" | "blocked";
  blockedReason?: string;
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

async function renderFinal(outputPath: string, inputProps: Record<string, unknown>) {
  const bundleLocation = await bundle({
    entryPoint: path.resolve(remotionEntry),
    onProgress: () => undefined,
    publicDir: path.resolve("public"),
    enableCaching: true,
  });
  const composition = await selectComposition({ serveUrl: bundleLocation, id: "WebsiteAdPreview", inputProps });
  await renderMedia({
    serveUrl: bundleLocation,
    composition,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    overwrite: true,
    muted: true,
    concurrency: 1,
  });
}

export async function runFinalRenderGate(input: {
  outputDir: string;
  checkpoint: BatchCheckpointManifest;
  attemptNumber: number;
}): Promise<FinalRenderManifest> {
  const finalAttemptId = `final-${String(input.attemptNumber).padStart(2, "0")}`;
  const attemptDir = path.join(input.outputDir, "final-render-attempts", finalAttemptId);
  fs.mkdirSync(attemptDir, { recursive: true });
  const sourceRenderInput = resolveCheckpointArtifact(input.outputDir, input.checkpoint.artifactPaths.previewRenderInputPath);
  const renderInputPath = path.join(attemptDir, "final-render-input.json");
  fs.copyFileSync(sourceRenderInput, renderInputPath);
  const renderInput = JSON.parse(fs.readFileSync(renderInputPath, "utf8")) as Record<string, unknown>;
  const structure = renderInput.structure as { meta?: { width?: number; height?: number; fps?: number; durationFrames?: number } } | undefined;
  const finalPath = path.join(attemptDir, "final.mp4");
  let blockedReason: string | undefined;
  try {
    await renderFinal(finalPath, renderInput);
  } catch {
    blockedReason = "ENCODING_FAILURE";
  }
  const finalExists = fs.existsSync(finalPath);
  const finalFileSizeBytes = finalExists ? fs.statSync(finalPath).size : 0;
  if (!blockedReason && !finalExists) blockedReason = "RENDER_FILE_MISSING";
  if (!blockedReason && finalFileSizeBytes <= 0) blockedReason = "RENDER_FILE_EMPTY";
  const manifest: FinalRenderManifest = {
    finalAttemptId,
    createdAt: new Date().toISOString(),
    checkpointId: input.checkpoint.checkpointId,
    sourceSnapshotId: input.checkpoint.sourceAttemptIds.sourceSnapshotId,
    articleVideoJobHash: input.checkpoint.dependencyHashes.articleVideoJobHash,
    runtimeSelectionPlanHash: input.checkpoint.dependencyHashes.runtimeSelectionPlanHash,
    visibleCopyAttemptHash: input.checkpoint.dependencyHashes.visibleCopyAttemptHash,
    previewAttemptId: path.basename(input.checkpoint.artifactPaths.previewAttemptPath ?? "preview-01", ".json"),
    renderInputHash: hashFile(renderInputPath),
    finalFileHash: finalExists && finalFileSizeBytes > 0 ? hashFile(finalPath) : undefined,
    finalFileRelativePath: path.relative(input.outputDir, finalPath),
    finalFileSizeBytes,
    width: structure?.meta?.width ?? 0,
    height: structure?.meta?.height ?? 0,
    fps: structure?.meta?.fps ?? 0,
    durationFrames: structure?.meta?.durationFrames ?? 0,
    status: blockedReason ? "blocked" : "passed",
    blockedReason,
  };
  writeJson(path.join(attemptDir, "final-render-manifest.json"), manifest);
  return manifest;
}
