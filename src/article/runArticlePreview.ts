import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { articleVisualPolicy } from "./articleVisualPolicy";
import { buildArticleVideoJob } from "./buildArticleVideoJob";
import { normalizeArticleToContentBrief } from "./normalizeArticleToContentBrief";
import { parseArticleFile } from "./parseArticleFile";
import { validateArticleInput } from "./validateArticleInput";
import { validateContentBrief } from "./validateContentBrief";
import { getShot } from "../../assets/index/asset-resolver";
import type { ArticlePreviewQaResult } from "./types";

type CliArgs = {
  input?: string;
  output?: string;
};

const remotionEntry = "src/index.ts";

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return {
    input: valueAfter("--input"),
    output: valueAfter("--output"),
  };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function resolveFfmpegBinary() {
  const configured = process.env.FFMPEG_PATH?.trim();
  if (configured) {
    return configured;
  }
  try {
    const resolved = execFileSync("where.exe", ["ffmpeg"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    return resolved ?? null;
  } catch {
    return null;
  }
}

type FfmpegBlankCheckResult =
  | { available: false; errorType: "FFMPEG_NOT_AVAILABLE" | "FFMPEG_EXECUTION_FAILED"; details?: string }
  | { available: true; black: boolean; white: boolean };

type FfmpegFilterResult = string | { failed: true; output: string };

function ffmpegBlankCheck(previewPath: string, atSeconds: number): FfmpegBlankCheckResult {
  const ffmpegBinary = resolveFfmpegBinary();
  if (!ffmpegBinary) {
    return { available: false, errorType: "FFMPEG_NOT_AVAILABLE" };
  }

  const runFilter = (filter: string): FfmpegFilterResult => {
    try {
      return execFileSync(
        ffmpegBinary,
        ["-ss", atSeconds.toFixed(3), "-i", previewPath, "-vf", filter, "-frames:v", "1", "-f", "null", "-"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      );
    } catch (error) {
      const stdout = (error as { stdout?: string }).stdout;
      const stderr = (error as { stderr?: string }).stderr;
      return { failed: true as const, output: [stdout, stderr].filter(Boolean).join("\n") };
    }
  };

  const blackLog = runFilter("blackframe=amount=98:threshold=32");
  const whiteLog = runFilter("negate,blackframe=amount=98:threshold=32");
  if (typeof blackLog !== "string" || typeof whiteLog !== "string") {
    const details = [
      typeof blackLog === "string" ? "" : blackLog.output,
      typeof whiteLog === "string" ? "" : whiteLog.output,
    ]
      .filter(Boolean)
      .join("\n");
    return { available: false, errorType: "FFMPEG_EXECUTION_FAILED", details };
  }

  return {
    available: true,
    black: /pblack:100/i.test(blackLog),
    white: /pblack:100/i.test(whiteLog),
  };
}

async function renderArticlePreview(outputPath: string, inputProps: Record<string, unknown>) {
  ensureDir(path.dirname(outputPath));
  const bundleLocation = await bundle({
    entryPoint: path.resolve(remotionEntry),
    onProgress: () => undefined,
    publicDir: path.resolve("public"),
    enableCaching: true,
  });
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "WebsiteAdPreview",
    inputProps,
  });

  await renderMedia({
    serveUrl: bundleLocation,
    composition,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    overwrite: true,
    scale: 0.5,
    concurrency: 1,
  });
}

function outputStats(previewPath: string) {
  const size = fs.existsSync(previewPath) ? fs.statSync(previewPath).size : 0;
  return { exists: fs.existsSync(previewPath), bytes: size };
}

function holdSecondsForLastScene(job: ReturnType<typeof buildArticleVideoJob>) {
  const lastScene = job.resolvedScenes[job.resolvedScenes.length - 1];
  if (!lastScene?.animationTracks?.length) return 0;
  const holdTrack = lastScene.animationTracks.find((track) => track.role === "readability-hold");
  if (!holdTrack) return 0;
  return Math.max(0, (lastScene.durationInFrames - holdTrack.startFrame) / job.videoSpec.fps);
}

function sceneDurationFitsCertifiedTiming(scene: ReturnType<typeof buildArticleVideoJob>["resolvedScenes"][number]) {
  if (!scene.selectedShotId) return true;
  const shot = getShot(scene.selectedShotId);
  const min = shot.duration_frames?.min ?? shot.choreography?.durationFrames?.min ?? shot.duration_frames?.preferred;
  const max = shot.duration_frames?.max ?? shot.choreography?.durationFrames?.max ?? shot.duration_frames?.preferred;
  if (!min || !max) return false;
  return scene.durationInFrames >= min && scene.durationInFrames <= max;
}

function hookVisibleByThreshold(job: ReturnType<typeof buildArticleVideoJob>) {
  const firstScene = job.resolvedScenes[0];
  if (!firstScene?.animationTracks?.length) return false;
  const titleTrack = firstScene.animationTracks.find((track) => track.target === "hookTitle" || track.semanticTarget === "coverHook.title");
  if (!titleTrack) return false;
  return titleTrack.startFrame / job.videoSpec.fps <= articleVisualPolicy.globalRhythm.hookMustAppearBySeconds;
}

function initialEmptyDurationWithinLimit(job: ReturnType<typeof buildArticleVideoJob>) {
  const firstScene = job.resolvedScenes[0];
  if (!firstScene?.animationTracks?.length) return false;
  const titleTrack = firstScene.animationTracks.find((track) => track.target === "hookTitle" || track.semanticTarget === "coverHook.title");
  if (!titleTrack) return false;
  return titleTrack.startFrame / job.videoSpec.fps <= articleVisualPolicy.globalRhythm.maxInitialEmptySeconds;
}

function transitionEmptyDurationWithinLimit(job: ReturnType<typeof buildArticleVideoJob>) {
  const fallbackScenes = job.resolvedScenes.filter((scene) => scene.fallbackReason);
  return fallbackScenes.length === 0;
}

function policyWarningsForJob(job: ReturnType<typeof buildArticleVideoJob>) {
  const warnings = (job.policyDebug as { warnings?: Array<{ message?: string } | string> } | undefined)?.warnings ?? [];
  return warnings.map((warning) => (typeof warning === "string" ? warning : warning.message ?? "")).filter(Boolean);
}

function sceneIntentSinglePurpose(job: ReturnType<typeof buildArticleVideoJob>) {
  const scenes = (job.policyDebug as { scenes?: Array<{ visualIntent?: string | string[] }> } | undefined)?.scenes ?? [];
  return scenes.every((scene) => !Array.isArray(scene.visualIntent));
}

function textDensityWithinPolicy(job: ReturnType<typeof buildArticleVideoJob>) {
  return job.resolvedScenes.every((scene) => {
    const articleContent = scene.componentProps?.articleContent as {
      headline?: string;
      supportingText?: string;
      recommendationTitle?: string;
      recommendationItems?: string[];
      stepItems?: string[];
      ctaText?: string;
    } | undefined;
    if (!articleContent) return true;
    const recommendationItemsOk = (articleContent.recommendationItems ?? []).every(
      (item) => item.length <= articleVisualPolicy.textDensity.maxRecommendationItemCharacters + 2,
    );
    const stepItemsOk = (articleContent.stepItems ?? []).every(
      (item) => item.length <= articleVisualPolicy.textDensity.maxStepTitleCharacters + 2,
    );
    return (
      (articleContent.headline?.length ?? 0) <= articleVisualPolicy.textDensity.maxHookHeadlineCharacters + 2 &&
      (articleContent.supportingText?.length ?? 0) <= articleVisualPolicy.textDensity.maxHookSupportingCharacters + 2 &&
      (articleContent.recommendationTitle?.length ?? 0) <= articleVisualPolicy.textDensity.maxRecommendationTitleCharacters + 2 &&
      (articleContent.ctaText?.length ?? 0) <= articleVisualPolicy.textDensity.maxCtaCharacters + 2 &&
      recommendationItemsOk &&
      stepItemsOk
    );
  });
}

function noUnreadableSmallGrid(job: ReturnType<typeof buildArticleVideoJob>) {
  return job.resolvedScenes
    .filter((scene) => scene.selectedShotId === "shot_15")
    .every((scene) => {
      const articleContent = scene.componentProps?.articleContent as { stepItems?: string[] } | undefined;
      return Boolean(articleContent?.stepItems?.length && articleContent.stepItems.length <= articleVisualPolicy.textDensity.maxStepItems);
    });
}

function noTruncatedCriticalText(job: ReturnType<typeof buildArticleVideoJob>) {
  const policyDebugScenes = (job.policyDebug as { scenes?: Array<{ bindings?: Record<string, unknown> }> } | undefined)?.scenes ?? [];
  return policyDebugScenes.every((scene) => {
    const bindings = scene.bindings ?? {};
    const headline = bindings.headline as { finalCharacters?: number } | undefined;
    const recommendationTitle = bindings.recommendationTitle as { finalCharacters?: number } | undefined;
    return (
      (headline?.finalCharacters ?? 0) <= articleVisualPolicy.textDensity.maxHookHeadlineCharacters + 2 &&
      (recommendationTitle?.finalCharacters ?? 0) <= articleVisualPolicy.textDensity.maxRecommendationTitleCharacters + 2
    );
  });
}

function noDefaultWebsiteCopy(job: ReturnType<typeof buildArticleVideoJob>) {
  const blockedTokens = ["ChatGPT", "Claude", "Gemini", "Best route", "One subscription"];
  const serialized = JSON.stringify(job.remotionInputProps.structure.scenes);
  return !blockedTokens.some((token) => serialized.includes(token));
}

function buildQaSummary(
  job: ReturnType<typeof buildArticleVideoJob>,
  previewPath: string,
  articleInputValid: ReturnType<typeof validateArticleInput>,
  contentBriefValid: ReturnType<typeof validateContentBrief>,
): ArticlePreviewQaResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!articleInputValid.valid) errors.push(...articleInputValid.errors.map((error) => `articleInput:${error}`));
  if (!contentBriefValid.valid) errors.push(...contentBriefValid.errors.map((error) => `contentBrief:${error}`));

  const unresolvedEvidence = job.selectedEvidenceIds.filter(
    (evidenceId) => !job.contentBrief.evidence.some((item) => item.evidenceId === evidenceId),
  );
  if (unresolvedEvidence.length) {
    errors.push(`unresolved evidence ids: ${unresolvedEvidence.join(", ")}`);
  }

  const fallbackScenes = job.resolvedScenes.filter((scene) => scene.selectedShotId && scene.fallbackReason);
  if (fallbackScenes.length) {
    warnings.push(...fallbackScenes.map((scene) => `fallback:${scene.selectedShotId}:${scene.fallbackReason}`));
  }

  const durationWithinRange =
    job.actualDurationSeconds >= job.videoSpec.minDurationSeconds &&
    job.actualDurationSeconds <= job.videoSpec.maxDurationSeconds;
  if (!durationWithinRange) {
    errors.push(`duration out of range: ${job.actualDurationSeconds.toFixed(2)}s`);
  }

  const hookScene = job.sceneSchedule[0];
  const hookInWindow = hookScene ? hookScene.startFrame / job.videoSpec.fps <= 1.5 : false;
  if (!hookInWindow) {
    errors.push("hook does not appear within the first 1.5 seconds");
  }

  const nonCertifiedDurationScenes = job.resolvedScenes.filter((scene) => !sceneDurationFitsCertifiedTiming(scene));
  if (nonCertifiedDurationScenes.length) {
    errors.push(`scene duration outside certified timing: ${nonCertifiedDurationScenes.map((scene) => scene.id).join(", ")}`);
  }

  const endingHoldSeconds = holdSecondsForLastScene(job);
  if (endingHoldSeconds < 0.4) {
    errors.push(`ending stable hold too short: ${endingHoldSeconds.toFixed(2)}s`);
  } else if (endingHoldSeconds > 0.8) {
    warnings.push(`ending stable hold exceeds preferred window: ${endingHoldSeconds.toFixed(2)}s`);
  }

  const preview = outputStats(previewPath);
  if (!preview.exists) errors.push("preview.mp4 missing");

  const firstFrame = ffmpegBlankCheck(previewPath, 0);
  let frameQaExecuted = false;
  let firstFrameCheckPassed = false;
  let sceneBoundaryChecksPassed = false;
  const endingStableHoldPassed = endingHoldSeconds >= 0.4;
  const hookVisibleByThresholdCheck = hookVisibleByThreshold(job);
  const initialEmptyDurationOk = initialEmptyDurationWithinLimit(job);
  const transitionEmptyDurationOk = transitionEmptyDurationWithinLimit(job);
  const noTruncatedCriticalTextCheck = noTruncatedCriticalText(job);
  const textDensityWithinPolicyCheck = textDensityWithinPolicy(job);
  const noUnreadableSmallGridCheck = noUnreadableSmallGrid(job);
  const sceneIntentSinglePurposeCheck = sceneIntentSinglePurpose(job);
  const articlePolicyWarnings = policyWarningsForJob(job);
  const noDefaultWebsiteCopyCheck = noDefaultWebsiteCopy(job);
  if (!hookVisibleByThresholdCheck) errors.push("hook not visible by policy threshold");
  if (!initialEmptyDurationOk) errors.push("initial empty duration exceeds policy");
  if (!transitionEmptyDurationOk) errors.push("transition empty duration exceeds policy");
  if (!noTruncatedCriticalTextCheck) errors.push("critical text exceeds policy truncation limits");
  if (!textDensityWithinPolicyCheck) errors.push("text density exceeds policy");
  if (!noUnreadableSmallGridCheck) errors.push("shot_15 produced unreadable small-grid content");
  if (!sceneIntentSinglePurposeCheck) errors.push("scene intent is not single-purpose");
  if (!noDefaultWebsiteCopyCheck) errors.push("default website copy remains in article scenes");
  let boundaryBlankCount = 0;
  const boundaryBlankSceneIds: number[] = [];

  if (!firstFrame.available) {
    warnings.push(firstFrame.errorType);
    if (firstFrame.errorType === "FFMPEG_EXECUTION_FAILED" && firstFrame.details) {
      warnings.push(`ffmpeg execution failed: ${firstFrame.details.slice(0, 240)}`);
    }
  } else {
    frameQaExecuted = true;
    firstFrameCheckPassed = !(firstFrame.black || firstFrame.white);
    if (!firstFrameCheckPassed) {
      errors.push("first frame is blank");
    }

    let cursor = 0;
    let boundaryChecksOk = true;
    for (const scene of job.resolvedScenes.slice(0, -1)) {
      cursor += scene.durationInFrames / job.videoSpec.fps;
      const boundary = ffmpegBlankCheck(previewPath, Math.max(0, cursor - 0.033));
      if (!boundary.available) {
        boundaryChecksOk = false;
        warnings.push(boundary.errorType);
        if (boundary.errorType === "FFMPEG_EXECUTION_FAILED" && boundary.details) {
          warnings.push(`ffmpeg execution failed: ${boundary.details.slice(0, 240)}`);
        }
        break;
      }
      if (boundary.black || boundary.white) {
        boundaryChecksOk = false;
        boundaryBlankCount += 1;
        boundaryBlankSceneIds.push(scene.id);
        warnings.push(`blank-near-boundary:${scene.id}`);
      }
    }
    sceneBoundaryChecksPassed = boundaryChecksOk && boundaryBlankCount === 0;
  }

  const status = errors.length ? "failed" : warnings.length ? "warning" : "passed";
  return {
    status,
    errors,
    warnings,
    checks: {
      articleInputValid: articleInputValid.valid,
      contentBriefValid: contentBriefValid.valid,
      previewExists: preview.exists,
      previewBytes: preview.bytes,
      sceneCount: job.resolvedScenes.length,
      targetDurationFrames: job.targetDurationFrames,
      actualDurationFrames: job.actualDurationFrames,
      actualDurationSeconds: Number(job.actualDurationSeconds.toFixed(3)),
      durationInFrames: job.remotionInputProps.structure.meta.durationFrames,
      fps: job.remotionInputProps.structure.meta.fps,
      width: job.remotionInputProps.structure.meta.width,
      height: job.remotionInputProps.structure.meta.height,
      durationWithinRange,
      hookStartSeconds: hookScene ? Number((hookScene.startFrame / job.videoSpec.fps).toFixed(3)) : -1,
      hookInWindow,
      hookVisibleByThreshold: hookVisibleByThresholdCheck,
      initialEmptyDurationWithinLimit: initialEmptyDurationOk,
      transitionEmptyDurationWithinLimit: transitionEmptyDurationOk,
      frameQaExecuted,
      firstFrameCheckPassed,
      sceneBoundaryChecksPassed,
      boundaryBlankCount,
      boundaryBlankSceneIds: boundaryBlankSceneIds.join(","),
      endingStableHoldPassed,
      endingHoldSeconds: Number(endingHoldSeconds.toFixed(3)),
      noTruncatedCriticalText: noTruncatedCriticalTextCheck,
      textDensityWithinPolicy: textDensityWithinPolicyCheck,
      noUnreadableSmallGrid: noUnreadableSmallGridCheck,
      sceneIntentSinglePurpose: sceneIntentSinglePurposeCheck,
      noDefaultWebsiteCopy: noDefaultWebsiteCopyCheck,
      articlePolicyWarnings: articlePolicyWarnings.join(" | "),
      certifiedTimingValid: nonCertifiedDurationScenes.length === 0,
      selectedShotIds: job.remotionInputProps.structure.articleJob?.selectedShotIds.join(",") ?? "",
      selectedChoreographyIds: job.remotionInputProps.structure.articleJob?.selectedChoreographyIds.join(",") ?? "",
      selectedEvidenceIds: job.selectedEvidenceIds.join(","),
      fallbackCount: fallbackScenes.length,
    },
  };
}

async function run() {
  const args = readArgs();
  if (!args.input || !args.output) {
    throw new Error('Use: npm run article:preview -- --input "examples/article-file-template.md" --output "outputs/article-preview/article_001"');
  }

  const outputDir = path.resolve(args.output);
  ensureDir(outputDir);

  const articleInput = parseArticleFile(args.input);
  const articleInputValid = validateArticleInput(articleInput);
  if (!articleInputValid.valid) {
    throw new Error(`Article input invalid: ${articleInputValid.errors.join("; ")}`);
  }

  const contentBrief = normalizeArticleToContentBrief(articleInput);
  const contentBriefValid = validateContentBrief(contentBrief);
  if (!contentBriefValid.valid) {
    throw new Error(`Content brief invalid: ${contentBriefValid.errors.join("; ")}`);
  }

  const job = buildArticleVideoJob(articleInput, contentBrief, outputDir);
  const articleInputPath = path.join(outputDir, "article-input.json");
  const contentBriefPath = path.join(outputDir, "content-brief.json");
  const evidenceMapPath = path.join(outputDir, "evidence-map.json");
  const videoSpecPath = path.join(outputDir, "article-video-spec.json");
  const jobPath = path.join(outputDir, "article-video-job.json");
  const policyDebugPath = path.join(outputDir, "policy-debug.json");
  const previewPath = path.join(outputDir, "preview.mp4");
  const qaPath = path.join(outputDir, "qa-summary.json");

  writeJson(articleInputPath, articleInput);
  writeJson(contentBriefPath, contentBrief);
  writeJson(evidenceMapPath, contentBrief.evidence);
  writeJson(videoSpecPath, {
    videoSpec: job.videoSpec,
    targetDurationFrames: job.targetDurationFrames,
    actualDurationFrames: job.actualDurationFrames,
    actualDurationSeconds: job.actualDurationSeconds,
    selectedSceneIds: job.selectedSceneIds,
    selectedChoreographyIds: job.selectedChoreographyIds,
    sceneSchedule: job.sceneSchedule,
  });
  writeJson(jobPath, job);
  writeJson(policyDebugPath, job.policyDebug ?? {});

  await renderArticlePreview(previewPath, job.remotionInputProps as Record<string, unknown>);

  const qaSummary = buildQaSummary(job, previewPath, articleInputValid, contentBriefValid);
  writeJson(qaPath, qaSummary);

  console.log(`articleInputPath=${articleInputPath}`);
  console.log(`contentBriefPath=${contentBriefPath}`);
  console.log(`evidenceMapPath=${evidenceMapPath}`);
  console.log(`videoSpecPath=${videoSpecPath}`);
  console.log(`articleVideoJobPath=${jobPath}`);
  console.log(`policyDebugPath=${policyDebugPath}`);
  console.log(`previewPath=${previewPath}`);
  console.log(`qaSummaryPath=${qaPath}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
