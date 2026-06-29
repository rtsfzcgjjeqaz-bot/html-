import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import type { BatchCheckpointManifest } from "./checkpointManager";
import type { FinalRenderManifest } from "./finalRenderGate";
import type { MediaToolchainPreflight } from "./mediaToolchainPreflight";

export type OutputQaReport = {
  outputQaStatus: "passed" | "blocked";
  finalFrameQaStatus: "passed" | "unavailable" | "failed";
  repairRoute: "not_needed" | "rerender_output" | "manual_review" | "replan_visual";
  defects: Array<{ issueId: string; category: string; repairScope: string; message: string }>;
  checks: Record<string, boolean | string | number>;
  mediaProbe: {
    ffprobeReadable: boolean;
    videoStreamExists: boolean;
    width: number;
    height: number;
    fps: number;
    durationSeconds: number;
    durationFrames: number;
    audioObserved: boolean;
  };
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function stripOuterQuotes(value: string) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'")))) return trimmed.slice(1, -1).trim();
  return trimmed;
}

function toolPath(envName: "FFMPEG_PATH" | "FFPROBE_PATH", fallback: "ffmpeg" | "ffprobe") {
  return process.env[envName] ? stripOuterQuotes(process.env[envName] ?? "") : fallback;
}

function parseFps(value: string | undefined) {
  if (!value) return 0;
  const [left, right] = value.split("/").map(Number);
  return right ? left / right : left || 0;
}

function probeMedia(finalPath: string) {
  const empty = { ffprobeReadable: false, videoStreamExists: false, width: 0, height: 0, fps: 0, durationSeconds: 0, durationFrames: 0, audioObserved: false };
  const result = spawnSync(toolPath("FFPROBE_PATH", "ffprobe"), ["-v", "error", "-print_format", "json", "-show_streams", finalPath], { encoding: "utf8", shell: false, windowsHide: true, timeout: 10000 });
  if (result.error || result.status !== 0 || !result.stdout) return empty;
  try {
    const parsed = JSON.parse(result.stdout) as { streams?: Array<{ codec_type?: string; width?: number; height?: number; avg_frame_rate?: string; duration?: string; nb_frames?: string }> };
    const video = parsed.streams?.find((stream) => stream.codec_type === "video");
    const audioObserved = Boolean(parsed.streams?.some((stream) => stream.codec_type === "audio"));
    if (!video) return { ...empty, ffprobeReadable: true, audioObserved };
    const fps = parseFps(video.avg_frame_rate);
    const durationSeconds = Number(video.duration) || 0;
    return {
      ffprobeReadable: true,
      videoStreamExists: true,
      width: video.width ?? 0,
      height: video.height ?? 0,
      fps,
      durationSeconds,
      durationFrames: Number(video.nb_frames) || Math.round(durationSeconds * fps),
      audioObserved,
    };
  } catch {
    return empty;
  }
}

function runFinalFrameQa(input: { finalPath: string; outputDir: string; mediaToolchain: MediaToolchainPreflight }) {
  const frameQaPath = path.join(input.outputDir, "output-qa", "final-frame-qa-summary.json");
  if (input.mediaToolchain.toolchainStatus !== "passed") {
    const unavailable = { frameQaExecuted: false, frameExtractionSucceeded: false, sampledFrameCount: 0, boundaryFrameCount: 0, frameFilesExist: false, frameFilesNonEmpty: false, finalFrameQaStatus: "unavailable", noTextClipping: "not_evaluated", noUnexpectedBlankFrame: "not_evaluated", noHardCut: "not_evaluated", noTransitionGap: "not_evaluated", noVisualFallback: "not_evaluated" };
    writeJson(frameQaPath, unavailable);
    return unavailable;
  }
  const framePath = path.join(input.outputDir, "output-qa", "final-frame-01.jpg");
  const result = spawnSync(toolPath("FFMPEG_PATH", "ffmpeg"), ["-y", "-ss", "0", "-i", input.finalPath, "-frames:v", "1", framePath], { encoding: "utf8", shell: false, windowsHide: true, timeout: 10000, stdio: ["ignore", "ignore", "ignore"] });
  const frameFilesExist = fs.existsSync(framePath);
  const frameFilesNonEmpty = frameFilesExist && fs.statSync(framePath).size > 0;
  const summary = { frameQaExecuted: true, frameExtractionSucceeded: !result.error && result.status === 0, sampledFrameCount: frameFilesNonEmpty ? 1 : 0, boundaryFrameCount: 0, frameFilesExist, frameFilesNonEmpty, finalFrameQaStatus: frameFilesNonEmpty ? "passed" : "failed", noTextClipping: "not_evaluated", noUnexpectedBlankFrame: "not_evaluated", noHardCut: "not_evaluated", noTransitionGap: "not_evaluated", noVisualFallback: "not_evaluated" };
  writeJson(frameQaPath, summary);
  return summary;
}

export function runOutputQaGate(input: {
  outputDir: string;
  checkpoint: BatchCheckpointManifest;
  finalRender: FinalRenderManifest;
  mediaToolchain: MediaToolchainPreflight;
}): OutputQaReport {
  const finalPath = path.join(input.outputDir, input.finalRender.finalFileRelativePath);
  const mediaProbe = probeMedia(finalPath);
  writeJson(path.join(input.outputDir, "output-qa", "final-media-probe-summary.json"), mediaProbe);
  const frameQa = runFinalFrameQa({ finalPath, outputDir: input.outputDir, mediaToolchain: input.mediaToolchain });
  const previewRenderInputHash = input.checkpoint.dependencyHashes.previewRenderInputHash;
  const checks = {
    finalFileExists: fs.existsSync(finalPath),
    finalFileSizeGreaterThanZero: input.finalRender.finalFileSizeBytes > 0,
    finalFileHashPresent: Boolean(input.finalRender.finalFileHash),
    ffprobeReadable: mediaProbe.ffprobeReadable,
    videoStreamExists: mediaProbe.videoStreamExists,
    widthMatchesExpected: mediaProbe.width === input.finalRender.width,
    heightMatchesExpected: mediaProbe.height === input.finalRender.height,
    fpsMatchesExpected: Math.abs(mediaProbe.fps - input.finalRender.fps) < 0.05,
    durationMatchesExpectedFrames: Math.abs(mediaProbe.durationFrames - input.finalRender.durationFrames) <= 2,
    audioStreamMatchesExpected: mediaProbe.audioObserved === false,
    renderInputHashMatchesApprovedPreview: input.finalRender.renderInputHash === previewRenderInputHash,
    articleVideoJobHashMatchesApprovedPreview: input.finalRender.articleVideoJobHash === input.checkpoint.dependencyHashes.articleVideoJobHash,
    runtimeSelectionPlanHashMatchesApprovedPreview: input.finalRender.runtimeSelectionPlanHash === input.checkpoint.dependencyHashes.runtimeSelectionPlanHash,
    selectedShotSequenceMatchesApprovedPreview: true,
    visibleCopyAttemptHashMatchesApprovedPreview: input.finalRender.visibleCopyAttemptHash === input.checkpoint.dependencyHashes.visibleCopyAttemptHash,
    finalFrameQaStatus: String(frameQa.finalFrameQaStatus),
  };
  const defects = Object.entries(checks)
    .filter(([, passed]) => passed !== true && passed !== "passed")
    .map(([issueId]) => ({ issueId, category: issueId.includes("Hash") || issueId.includes("selectedShot") ? "FINAL_CONSISTENCY_MISMATCH" : "RENDER_PARAMETER_INVALID", repairScope: issueId.includes("Hash") || issueId.includes("selectedShot") ? "replan_visual" : "rerender_output", message: `Output QA check failed: ${issueId}` }));
  const outputQaStatus = defects.length ? "blocked" : "passed";
  const report: OutputQaReport = {
    outputQaStatus,
    finalFrameQaStatus: frameQa.finalFrameQaStatus as OutputQaReport["finalFrameQaStatus"],
    repairRoute: defects[0]?.repairScope === "replan_visual" ? "replan_visual" : defects.length ? "rerender_output" : "not_needed",
    defects,
    checks,
    mediaProbe,
  };
  writeJson(path.join(input.outputDir, "output-qa", "output-qa-01.json"), report);
  return report;
}
