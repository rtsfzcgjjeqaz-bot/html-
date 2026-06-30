import fs from "fs";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { buildArticleVideoJob } from "../buildArticleVideoJob";
import { validateArticleInput } from "../validateArticleInput";
import { validateContentBrief } from "../validateContentBrief";
import { buildArticleLayoutInspection } from "../../remotion/articleLayoutContract";
import { buildArticleMotionInspection } from "../../remotion/articleMotionContract";
import { buildArticleTransitionInspection } from "../../remotion/articleTransitionContract";
import type { ArticleContentBrief, ArticleInput } from "../types";
import type { ShotSelectionPlan } from "../../library/shotSelectionTypes";
import type { ArticleScriptPlan } from "./articleBatchTypes";

const remotionEntry = "src/index.ts";

export type PreviewAttemptManifest = {
  attemptId: string;
  sourceSnapshotId: string;
  scriptAttemptId?: string;
  visibleCopyAttemptId?: string;
  runtimeSelectionPlanId: string;
  renderInputPath: string;
  previewPath: string;
  qaSummaryPath: string;
  createdAt: string;
  status: "rendered" | "blocked";
  selectedAssetIds: string[];
  selectedRuntimeShotIds: string[];
  selectedChoreographyIds: string[];
  durationFrames: number;
  fps: number;
  width: number;
  height: number;
  fileSizeBytes: number;
};

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
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

function assertPreRender(input: { article: ArticleInput; brief: ArticleContentBrief; scriptPlan: ArticleScriptPlan }) {
  const articleValidation = validateArticleInput(input.article);
  if (!articleValidation.valid) return `ARTICLE_INPUT_INVALID:${articleValidation.errors.length}`;
  const briefValidation = validateContentBrief(input.brief);
  if (!briefValidation.valid) return `CONTENT_BRIEF_INVALID:${briefValidation.errors.length}`;
  if (input.scriptPlan.scriptStatus !== "qa_passed") return "SCRIPT_QA_NOT_PASSED";
  return undefined;
}

export async function runPreviewRenderGate(input: {
  outputDir: string;
  attemptNumber: number;
  article: ArticleInput;
  brief: ArticleContentBrief;
  scriptPlan: ArticleScriptPlan;
  sourceSnapshotId: string;
  scriptAttemptId?: string;
  visibleCopyAttemptId?: string;
  pinnedRuntimeSelectionPlan?: ShotSelectionPlan;
}): Promise<{ manifest: PreviewAttemptManifest; job: ReturnType<typeof buildArticleVideoJob>; blockedReason?: string }> {
  const attemptId = `preview-${String(input.attemptNumber).padStart(2, "0")}`;
  const attemptDir = path.join(input.outputDir, "preview-attempts", attemptId);
  ensureDir(attemptDir);
  const job = buildArticleVideoJob(input.article, input.brief, attemptDir, { pinnedRuntimeSelectionPlan: input.pinnedRuntimeSelectionPlan });
  const runtimeSelectionPlanId = `runtime-selection-${attemptId}`;
  const renderInputPath = path.join(attemptDir, "render-input.json");
  const previewPath = path.join(attemptDir, "preview.mp4");
  const qaSummaryPath = path.join(input.outputDir, "preview-qa", `${attemptId}-preview-qa.json`);
  const runtimeSelectionPlanPath = path.join(attemptDir, "article-runtime-selection-plan.json");
  const visibleCopyPlanPath = path.join(attemptDir, "article-visible-copy-plan.json");
  const articleVideoJobPath = path.join(attemptDir, "article-video-job.json");
  const selectedRuntimeShotIds = job.remotionInputProps.structure.articleJob?.selectedShotIds ?? [];
  const selectedChoreographyIds = job.selectedChoreographyIds;
  const selectedAssetIds = selectedRuntimeShotIds;
  const blockedReason = assertPreRender({ article: input.article, brief: input.brief, scriptPlan: input.scriptPlan });

  writeJson(renderInputPath, job.remotionInputProps);
  writeJson(articleVideoJobPath, job);
  writeJson(runtimeSelectionPlanPath, job.runtimeSelectionPlan);
  writeJson(visibleCopyPlanPath, { scenes: job.visibleCopyPlan ?? [] });

  const layoutInspection = buildArticleLayoutInspection(job);
  const motionInspection = buildArticleMotionInspection(job);
  const transitionInspection = buildArticleTransitionInspection(job);
  writeJson(path.join(attemptDir, "article-layout-qa-summary.json"), { status: layoutInspection.status, checks: layoutInspection.checks, sceneCount: layoutInspection.scenes.length });
  writeJson(path.join(attemptDir, "article-motion-qa-summary.json"), { status: motionInspection.status, checks: motionInspection.checks, sceneCount: motionInspection.scenes.length });
  writeJson(path.join(attemptDir, "article-transition-qa-summary.json"), { status: transitionInspection.status, checks: transitionInspection.checks, boundaryCount: transitionInspection.plan.boundaries.length });

  if (!blockedReason) {
    await renderArticlePreview(previewPath, job.remotionInputProps as Record<string, unknown>);
  }

  const fileSizeBytes = fs.existsSync(previewPath) ? fs.statSync(previewPath).size : 0;
  const manifest: PreviewAttemptManifest = {
    attemptId,
    sourceSnapshotId: input.sourceSnapshotId,
    scriptAttemptId: input.scriptAttemptId,
    visibleCopyAttemptId: input.visibleCopyAttemptId,
    runtimeSelectionPlanId,
    renderInputPath,
    previewPath,
    qaSummaryPath,
    createdAt: new Date().toISOString(),
    status: blockedReason ? "blocked" : "rendered",
    selectedAssetIds,
    selectedRuntimeShotIds,
    selectedChoreographyIds,
    durationFrames: job.actualDurationFrames,
    fps: job.videoSpec.fps,
    width: job.videoSpec.previewWidth,
    height: job.videoSpec.previewHeight,
    fileSizeBytes,
  };
  writeJson(path.join(attemptDir, "preview-attempt.json"), manifest);
  return { manifest, job, blockedReason };
}
