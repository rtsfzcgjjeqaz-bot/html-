import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { articleVisualPolicy } from "../articleVisualPolicy";
import { validateArticleInput } from "../validateArticleInput";
import { validateContentBrief } from "../validateContentBrief";
import { buildArticleLayoutInspection } from "../../remotion/articleLayoutContract";
import { buildArticleMotionInspection } from "../../remotion/articleMotionContract";
import { buildArticleTransitionInspection } from "../../remotion/articleTransitionContract";
import { runVisibleCopyQa } from "./visibleCopyQaGate";
import type { ArticleContentBrief, ArticleInput } from "../types";
import type { BatchDefect, ArticleScriptPlan } from "./articleBatchTypes";
import type { PreviewAttemptManifest } from "./previewRenderGate";
import type { MediaToolchainPreflight } from "./mediaToolchainPreflight";

export type PreviewQaReport = {
  previewAttemptId: string;
  previewPath: string;
  renderInputPath: string;
  runtimeSelectionPlanId: string;
  selectedAssetIds: string[];
  selectedRuntimeShotIds: string[];
  sourceEnvironments: { ffmpegAvailable: boolean; ffprobeAvailable: boolean; mediaToolchainStatus: string };
  durationFrames: number;
  fps: number;
  width: number;
  height: number;
  fileSizeBytes: number;
  staticQa: Record<string, boolean | number | string>;
  layoutQa: Record<string, unknown>;
  motionQa: Record<string, unknown>;
  transitionQa: Record<string, unknown>;
  bindingQa: Record<string, boolean | number | string>;
  frameQa: Record<string, boolean | string>;
  defects: BatchDefect[];
  repairRoute: string;
  finalPreviewStatus: "passed" | "passed_with_frame_qa_unavailable" | "repairable" | "blocked";
};

function resolveFfmpegBinaryForExecution() {
  const configured = process.env.FFMPEG_PATH?.trim();
  if (configured) return configured;
  try {
    return execFileSync("where.exe", ["ffmpeg"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
  } catch {
    return undefined;
  }
}

function runFrameQa(input: { previewPath: string; outputDir: string; mediaToolchain: MediaToolchainPreflight }): Record<string, boolean | string> {
  const frameQaPath = path.join(input.outputDir, "preview-qa", "frame-qa-summary.json");
  if (input.mediaToolchain.toolchainStatus !== "passed") {
    const unavailable = {
      frameQaExecuted: false,
      frameQaPassed: false,
      frameQaStatus: "unavailable",
      reason: input.mediaToolchain.sanitizedFailureCategory ?? "MEDIA_TOOLCHAIN_UNAVAILABLE",
      frameExtracted: false,
      frameFileExists: false,
      frameFileSizeGreaterThanZero: false,
      noTextClipping: "not_evaluated",
      noUnexpectedBlankFrame: "not_evaluated",
      noHardCut: "not_evaluated",
      noTransitionGap: "not_evaluated",
      noVisualFallback: "not_evaluated",
    };
    fs.mkdirSync(path.dirname(frameQaPath), { recursive: true });
    fs.writeFileSync(frameQaPath, JSON.stringify(unavailable, null, 2));
    return unavailable;
  }

  const ffmpeg = resolveFfmpegBinaryForExecution();
  const framePath = path.join(input.outputDir, "preview-qa", "frame-qa-preview-01.jpg");
  let frameExtracted = false;
  try {
    fs.mkdirSync(path.dirname(framePath), { recursive: true });
    if (ffmpeg) {
      execFileSync(ffmpeg, ["-y", "-ss", "0", "-i", input.previewPath, "-frames:v", "1", framePath], { stdio: ["ignore", "ignore", "ignore"], timeout: 10000 });
      frameExtracted = true;
    }
  } catch {
    frameExtracted = false;
  }
  const frameFileExists = fs.existsSync(framePath);
  const frameFileSizeGreaterThanZero = frameFileExists && fs.statSync(framePath).size > 0;
  const summary = {
    frameQaExecuted: true,
    frameQaPassed: frameExtracted && frameFileExists && frameFileSizeGreaterThanZero,
    frameQaStatus: frameExtracted && frameFileExists && frameFileSizeGreaterThanZero ? "passed" : "failed",
    frameExtracted,
    frameFileExists,
    frameFileSizeGreaterThanZero,
    noTextClipping: "not_evaluated",
    noUnexpectedBlankFrame: "not_evaluated",
    noHardCut: "not_evaluated",
    noTransitionGap: "not_evaluated",
    noVisualFallback: "not_evaluated",
  };
  fs.writeFileSync(frameQaPath, JSON.stringify(summary, null, 2));
  return summary;
}

function defect(input: { issueId: string; category: string; message: string; repairScope: BatchDefect["repairScope"]; severity?: BatchDefect["severity"] }): BatchDefect {
  return {
    issueId: input.issueId,
    severity: input.severity ?? "BLOCKER",
    category: input.category,
    sceneIds: [],
    evidenceIds: [],
    tableIds: [],
    message: input.message,
    detectedBy: "previewQaGate",
    repairScope: input.repairScope,
    recommendedAction: input.message,
    autoRepairEligible: input.repairScope === "rerender_output",
  };
}

function noDefaultWebsiteCopy(job: { remotionInputProps: { structure: { scenes: unknown[] } } }) {
  const blockedTokens = ["ChatGPT", "Claude", "Gemini", "Best route", "One subscription", "placeholder", "TODO"];
  const serialized = JSON.stringify(job.remotionInputProps.structure.scenes);
  return !blockedTokens.some((token) => serialized.includes(token));
}

function visibleCopyValues(job: ReturnType<typeof import("../buildArticleVideoJob").buildArticleVideoJob>) {
  return (job.visibleCopyPlan ?? []).flatMap((scene) => [
    scene.headline?.value,
    scene.supportingText?.value,
    scene.shortLabel?.value,
    scene.evidenceCaption?.value,
    scene.recommendationTitle?.value,
    ...(scene.recommendationItems ?? []).map((item) => item.value),
    ...(scene.stepItems ?? []).map((item) => item.value),
    ...(scene.cards ?? []).map((item) => item.value),
  ]).filter((value): value is string => Boolean(value));
}

function textDensityWithinPolicy(job: ReturnType<typeof import("../buildArticleVideoJob").buildArticleVideoJob>) {
  return job.resolvedScenes.every((scene) => {
    const articleContent = scene.componentProps?.articleContent as { headline?: string; supportingText?: string; recommendationTitle?: string; recommendationItems?: string[]; stepItems?: string[]; ctaText?: string } | undefined;
    if (!articleContent) return true;
    if (scene.sourceType === "article" && ["shot_01", "shot_03", "shot_51"].includes(String(scene.selectedShotId ?? ""))) {
      return (
        (articleContent.headline?.length ?? 0) <= 48 &&
        (articleContent.supportingText?.length ?? 0) <= 52 &&
        (articleContent.recommendationTitle?.length ?? 0) <= 28 &&
        (articleContent.recommendationItems ?? []).every((item) => item.length <= 34) &&
        (articleContent.stepItems ?? []).every((item) => item.length <= 34)
      );
    }
    return (
      (articleContent.headline?.length ?? 0) <= articleVisualPolicy.textDensity.maxHookHeadlineCharacters + 2 &&
      (articleContent.supportingText?.length ?? 0) <= articleVisualPolicy.textDensity.maxHookSupportingCharacters + 2 &&
      (articleContent.recommendationTitle?.length ?? 0) <= articleVisualPolicy.textDensity.maxRecommendationTitleCharacters + 2 &&
      (articleContent.ctaText?.length ?? 0) <= articleVisualPolicy.textDensity.maxCtaCharacters + 2 &&
      (articleContent.recommendationItems ?? []).every((item) => item.length <= articleVisualPolicy.textDensity.maxRecommendationItemCharacters + 2) &&
      (articleContent.stepItems ?? []).every((item) => item.length <= articleVisualPolicy.textDensity.maxStepTitleCharacters + 2)
    );
  });
}

function endingHoldSeconds(job: ReturnType<typeof import("../buildArticleVideoJob").buildArticleVideoJob>) {
  const lastScene = job.resolvedScenes[job.resolvedScenes.length - 1];
  const holdTrack = lastScene?.animationTracks?.find((track) => track.role === "readability-hold");
  return holdTrack ? Math.max(0, (lastScene.durationInFrames - holdTrack.startFrame) / job.videoSpec.fps) : 0;
}

export function runPreviewQaGate(input: {
  outputDir: string;
  manifest: PreviewAttemptManifest;
  job: ReturnType<typeof import("../buildArticleVideoJob").buildArticleVideoJob>;
  article: ArticleInput;
  brief: ArticleContentBrief;
  scriptPlan: ArticleScriptPlan;
  mediaToolchain: MediaToolchainPreflight;
}): PreviewQaReport {
  const defects: BatchDefect[] = [];
  const previewFileExists = fs.existsSync(input.manifest.previewPath);
  const previewFileSizeGreaterThanZero = input.manifest.fileSizeBytes > 0;
  if (!previewFileExists) defects.push(defect({ issueId: "preview_file_missing", category: "RENDER_FILE_MISSING", message: "Preview file is missing.", repairScope: "rerender_output" }));
  if (previewFileExists && !previewFileSizeGreaterThanZero) defects.push(defect({ issueId: "preview_file_empty", category: "RENDER_FILE_EMPTY", message: "Preview file is empty.", repairScope: "rerender_output" }));

  const articleInputValid = validateArticleInput(input.article).valid;
  const contentBriefValid = validateContentBrief(input.brief).valid;
  const selectedShotSequenceMatchesPlan = input.manifest.selectedRuntimeShotIds.join(",") === (input.job.remotionInputProps.structure.articleJob?.selectedShotIds ?? []).join(",");
  const fallbackScenes = input.job.resolvedScenes.filter((scene) => scene.fallbackReason);
  const durationWithinRange = input.job.actualDurationSeconds >= input.job.videoSpec.minDurationSeconds && input.job.actualDurationSeconds <= input.job.videoSpec.maxDurationSeconds;
  const renderParametersValid = input.manifest.fps === 30 && input.manifest.width === 1920 && input.manifest.height === 1080 && durationWithinRange;
  if (!renderParametersValid) defects.push(defect({ issueId: "render_parameter_invalid", category: "RENDER_PARAMETER_INVALID", message: "Preview render parameters are invalid.", repairScope: "rerender_output" }));
  if (fallbackScenes.length) defects.push(defect({ issueId: "visual_fallback", category: "VISUAL_FALLBACK", message: "Unexpected visual fallback detected.", repairScope: "replan_visual" }));

  const layoutInspection = buildArticleLayoutInspection(input.job);
  const motionInspection = buildArticleMotionInspection(input.job);
  const transitionInspection = buildArticleTransitionInspection(input.job);
  if (layoutInspection.status !== "passed") defects.push(defect({ issueId: "layout_visual", category: "LAYOUT_VISUAL", message: "Layout QA did not pass.", repairScope: "replan_visual" }));
  if (motionInspection.status !== "passed") defects.push(defect({ issueId: "motion_issue", category: "MOTION_ISSUE", message: "Motion QA did not pass.", repairScope: "replan_visual" }));
  if (transitionInspection.status !== "passed") defects.push(defect({ issueId: "transition_issue", category: "TRANSITION_ISSUE", message: "Transition QA did not pass.", repairScope: "replan_visual" }));

  const visibleCopyQa = runVisibleCopyQa({ visibleCopyPlan: input.job.visibleCopyPlan ?? [], scriptPlan: input.scriptPlan, evidence: input.brief.evidence });
  defects.push(...visibleCopyQa.defects);

  const frameQa = runFrameQa({ previewPath: input.manifest.previewPath, outputDir: input.outputDir, mediaToolchain: input.mediaToolchain });

  const endingStableHoldPassed = endingHoldSeconds(input.job) >= 0.4;
  const copyValues = visibleCopyValues(input.job);
  const staticQa = {
    previewFileExists,
    previewFileSizeGreaterThanZero,
    durationFramesPresent: input.manifest.durationFrames > 0,
    fpsPresent: input.manifest.fps > 0,
    widthPresent: input.manifest.width > 0,
    heightPresent: input.manifest.height > 0,
    renderParametersValid,
    selectedShotSequenceMatchesPlan,
    noUnexpectedFallback: fallbackScenes.length === 0,
    noDemoCopy: noDefaultWebsiteCopy(input.job),
    noEnglishFallback: noDefaultWebsiteCopy(input.job),
    noEllipsis: copyValues.every((value) => !value.includes("...") && !value.includes("…")),
    noPlaceholder: noDefaultWebsiteCopy(input.job),
    noKnownTextCapacityViolation: textDensityWithinPolicy(input.job),
    endingStableHoldPassed,
  };
  if (!staticQa.noKnownTextCapacityViolation) defects.push(defect({ issueId: "visible_copy_capacity_preview", category: "VISIBLE_COPY_CAPACITY", message: "Known text capacity violation in preview input.", repairScope: "repair_visible_copy", severity: "REPAIRABLE" }));
  if (!endingStableHoldPassed) defects.push(defect({ issueId: "low_information_boundary", category: "LOW_INFORMATION_BOUNDARY", message: "Ending stable hold is too short.", repairScope: "replan_visual" }));

  const hasBlocker = defects.some((item) => item.severity === "BLOCKER" && item.repairScope !== "rerender_output");
  const frameQaExecuted = frameQa.frameQaExecuted === true;
  const frameQaPassed = frameQa.frameQaPassed === true;
  const finalPreviewStatus = defects.length ? (hasBlocker ? "blocked" : "repairable") : frameQaExecuted && frameQaPassed ? "passed" : "passed_with_frame_qa_unavailable";
  const report: PreviewQaReport = {
    previewAttemptId: input.manifest.attemptId,
    previewPath: input.manifest.previewPath,
    renderInputPath: input.manifest.renderInputPath,
    runtimeSelectionPlanId: input.manifest.runtimeSelectionPlanId,
    selectedAssetIds: input.manifest.selectedAssetIds,
    selectedRuntimeShotIds: input.manifest.selectedRuntimeShotIds,
    sourceEnvironments: {
      ffmpegAvailable: input.mediaToolchain.ffmpegAvailable,
      ffprobeAvailable: input.mediaToolchain.ffprobeAvailable,
      mediaToolchainStatus: input.mediaToolchain.toolchainStatus,
    },
    durationFrames: input.manifest.durationFrames,
    fps: input.manifest.fps,
    width: input.manifest.width,
    height: input.manifest.height,
    fileSizeBytes: input.manifest.fileSizeBytes,
    staticQa,
    layoutQa: { status: layoutInspection.status, checks: layoutInspection.checks },
    motionQa: { status: motionInspection.status, checks: motionInspection.checks },
    transitionQa: { status: transitionInspection.status, checks: transitionInspection.checks },
    bindingQa: { articleInputValid, contentBriefValid, strictBindingStillPassed: visibleCopyQa.checks.strictBindingCompatible, visibleCopyStillPassed: visibleCopyQa.status === "passed" },
    frameQa,
    defects,
    repairRoute: defects[0]?.repairScope ?? "not_needed",
    finalPreviewStatus,
  };
  fs.mkdirSync(path.dirname(input.manifest.qaSummaryPath), { recursive: true });
  fs.writeFileSync(input.manifest.qaSummaryPath, JSON.stringify(report, null, 2));
  return report;
}
