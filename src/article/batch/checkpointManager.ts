import crypto from "crypto";
import fs from "fs";
import path from "path";
import { articleBatchQualityPolicy } from "./articleBatchQualityPolicy";
import type { ArticleScriptPlan } from "./articleBatchTypes";
import type { ArticleContentBrief, ArticleInput, EvidenceItem } from "../types";

export type BatchCheckpointManifest = {
  checkpointId: string;
  createdAt: string;
  checkpointStage: "VISIBLE_COPY_AND_VISUAL_PLAN" | "PREVIEW_QA";
  sourceAttemptIds: Record<string, string>;
  dependencyHashes: Record<string, string>;
  artifactPaths: Record<string, string>;
  qualityStatuses: Record<string, string | boolean | number>;
  resumeAllowedStages: string[];
  invalidated: boolean;
  invalidatedReason?: string;
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

export function hashFile(filePath: string) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

export function resolveCheckpointArtifact(outputDir: string, artifactPath: string) {
  return resolveArtifact(outputDir, artifactPath);
}

function relative(outputDir: string, filePath: string | undefined) {
  if (!filePath) return "";
  return path.relative(outputDir, filePath);
}

function resolveArtifact(outputDir: string, artifactPath: string) {
  return path.resolve(outputDir, artifactPath);
}

function fileExists(filePath: string) {
  return Boolean(filePath) && fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function runtimeContractVersions() {
  return {
    qualityPolicyVersion: articleBatchQualityPolicy.policyVersion,
    layoutContractVersion: "article-layout-contract-v1",
    motionContractVersion: "article-motion-contract-v1",
    transitionContractVersion: "article-transition-contract-v1",
  };
}

function hashText(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").toUpperCase();
}

function dependencyHashes(input: {
  articleInputPath: string;
  contentBriefPath: string;
  evidenceMapPath: string;
  scriptAttemptPath: string;
  semanticReviewAttemptPath: string;
  visibleCopyAttemptPath: string;
  runtimeSelectionPlanPath: string;
  articleVideoJobPath: string;
  sourceSnapshotHash: string;
}) {
  const versions = runtimeContractVersions();
  return {
    sourceSnapshotHash: input.sourceSnapshotHash,
    articleInputHash: hashFile(input.articleInputPath),
    contentBriefHash: hashFile(input.contentBriefPath),
    evidenceMapHash: hashFile(input.evidenceMapPath),
    scriptAttemptHash: hashFile(input.scriptAttemptPath),
    semanticReviewAttemptHash: hashFile(input.semanticReviewAttemptPath),
    visibleCopyAttemptHash: hashFile(input.visibleCopyAttemptPath),
    runtimeSelectionPlanHash: hashFile(input.runtimeSelectionPlanPath),
    articleVideoJobHash: hashFile(input.articleVideoJobPath),
    qualityPolicyVersion: hashText(versions.qualityPolicyVersion),
    layoutContractVersion: hashText(versions.layoutContractVersion),
    motionContractVersion: hashText(versions.motionContractVersion),
    transitionContractVersion: hashText(versions.transitionContractVersion),
  };
}

function latestPreviewAttemptPath(outputDir: string) {
  const historyPath = path.join(outputDir, "preview-attempt-history.json");
  if (!fs.existsSync(historyPath)) return undefined;
  const history = readJson<string[]>(historyPath);
  return history[history.length - 1];
}

function scriptAttemptPathFromRef(outputDir: string, ref: string | undefined) {
  if (!ref) return undefined;
  if (path.isAbsolute(ref) || ref.includes("/") || ref.includes("\\")) return ref;
  return path.join(outputDir, "script-attempts", ref.endsWith(".json") ? ref : `${ref}.json`);
}

function visibleCopyAttemptPathFromRef(outputDir: string, ref: string | undefined) {
  if (!ref) return undefined;
  if (path.isAbsolute(ref) || ref.includes("/") || ref.includes("\\")) return ref;
  return path.join(outputDir, "visible-copy-attempts", ref.endsWith(".json") ? ref : `${ref}.json`);
}

export function createVisibleCopyApprovedCheckpointFromLatest(outputDir: string): BatchCheckpointManifest | undefined {
  const summaryPath = path.join(outputDir, "batch-dry-run-summary.json");
  const summary = fs.existsSync(summaryPath) ? readJson<{
    inputIntegrityStatus?: string;
    scriptQaStatus?: string;
    visibleCopyQaStatus?: string;
    sourceContentHash?: string;
    paths?: Record<string, string>;
  }>(summaryPath) : {};
  const paths = summary.paths ?? {};
  const previewAttemptPath = latestPreviewAttemptPath(outputDir);
  if (!previewAttemptPath || !fs.existsSync(previewAttemptPath)) return undefined;
  const previewAttempt = readJson<{ sourceSnapshotId: string; scriptAttemptId?: string; visibleCopyAttemptId?: string }>(previewAttemptPath);
  const scriptAttemptPath = paths.latestScriptPlan ?? scriptAttemptPathFromRef(outputDir, previewAttempt.scriptAttemptId);
  const visibleCopyAttemptPath = paths.latestVisibleCopyPlan ?? visibleCopyAttemptPathFromRef(outputDir, previewAttempt.visibleCopyAttemptId);
  const latestVisibleCopyQa = paths.latestVisibleCopyQa ?? path.join(outputDir, "qa-reports", "visible-copy-qa-02.json");
  if (!latestVisibleCopyQa || !fs.existsSync(latestVisibleCopyQa)) return undefined;
  const visibleCopyQa = readJson<{ status: string; checks?: Record<string, boolean> }>(latestVisibleCopyQa);
  const scriptQaPath = scriptAttemptPath ? path.join(outputDir, "qa-reports", `${path.basename(scriptAttemptPath, ".json")}-script-qa.json`) : undefined;
  const scriptQa = scriptQaPath && fs.existsSync(scriptQaPath) ? readJson<{ status: string; blockerCount?: number }>(scriptQaPath) : undefined;
  const scriptQaStatus = summary.scriptQaStatus ?? (scriptQa?.status === "repair_required" && scriptQa.blockerCount === 0 ? "passed_with_deferred_visible_copy_repairs" : scriptQa?.status);
  const inputIntegrityStatus = summary.inputIntegrityStatus ?? "passed";
  if (inputIntegrityStatus !== "passed" || !["passed", "passed_with_deferred_visible_copy_repairs"].includes(String(scriptQaStatus)) || visibleCopyQa.status !== "passed" || visibleCopyQa.checks?.strictBindingCompatible !== true) return undefined;

  const previewDir = path.dirname(previewAttemptPath);
  const articleVideoJobPath = path.join(previewDir, "article-video-job.json");
  const runtimeSelectionPlanPath = path.join(previewDir, "article-runtime-selection-plan.json");
  const articleVideoJob = readJson<{ contentBrief: ArticleContentBrief }>(articleVideoJobPath);
  const checkpointDir = path.join(outputDir, "checkpoints");
  const contentBriefPath = path.join(checkpointDir, "checkpoint-visible-copy-approved-content-brief.json");
  writeJson(contentBriefPath, articleVideoJob.contentBrief);

  const required = {
    articleInputPath: path.join(outputDir, "input-snapshots", previewAttempt.sourceSnapshotId, "article-input.json"),
    contentBriefPath,
    evidenceMapPath: path.join(outputDir, "input-snapshots", previewAttempt.sourceSnapshotId, "evidence-map.json"),
    scriptAttemptPath,
    semanticReviewAttemptPath: paths.latestSemanticReview ?? path.join(outputDir, "semantic-review-attempts", "semantic-review-01.json"),
    visibleCopyAttemptPath,
    runtimeSelectionPlanPath,
    articleVideoJobPath,
  };
  if (!Object.values(required).every(fileExists)) return undefined;

  const checkpointId = "checkpoint-visible-copy-approved";
  const manifest: BatchCheckpointManifest = {
    checkpointId,
    createdAt: new Date().toISOString(),
    checkpointStage: "VISIBLE_COPY_AND_VISUAL_PLAN",
    sourceAttemptIds: {
      sourceSnapshotId: previewAttempt.sourceSnapshotId,
      scriptAttemptId: path.basename(required.scriptAttemptPath, ".json"),
      visibleCopyAttemptId: path.basename(required.visibleCopyAttemptPath, ".json"),
    },
    dependencyHashes: dependencyHashes({ ...required, sourceSnapshotHash: hashFile(path.join(outputDir, "input-snapshots", previewAttempt.sourceSnapshotId, "input-snapshot-summary.json")) }),
    artifactPaths: Object.fromEntries(Object.entries(required).map(([key, value]) => [key, relative(outputDir, value)])),
    qualityStatuses: {
      inputIntegrityStatus: String(inputIntegrityStatus),
      scriptQaStatus: String(scriptQaStatus),
      visibleCopyQaStatus: visibleCopyQa.status,
      strictBindingPassed: true,
      runtimeSelectionPlanExists: true,
    },
    resumeAllowedStages: ["PREVIEW_RENDER", "MEDIA_TOOLCHAIN_PREFLIGHT", "PREVIEW_QA"],
    invalidated: false,
  };
  writeJson(path.join(checkpointDir, "checkpoint-visible-copy-approved.json"), manifest);
  writeJson(path.join(checkpointDir, "checkpoint-manifest.json"), manifest);
  const historyPath = path.join(checkpointDir, "checkpoint-history.json");
  const history = fs.existsSync(historyPath) ? readJson<BatchCheckpointManifest[]>(historyPath) : [];
  writeJson(historyPath, [...history.filter((item) => item.checkpointId !== checkpointId), manifest]);
  return manifest;
}

export function loadAndValidateCheckpoint(outputDir: string, checkpointId: string): { manifest: BatchCheckpointManifest; valid: true } | { manifest?: BatchCheckpointManifest; valid: false; reason: string } {
  const manifestPath = path.join(outputDir, "checkpoints", `${checkpointId}.json`);
  if (!fs.existsSync(manifestPath)) return { valid: false, reason: "CHECKPOINT_SOURCE_NOT_AVAILABLE" };
  const manifest = readJson<BatchCheckpointManifest>(manifestPath);
  const files = manifest.artifactPaths;
  const required = {
    articleInputPath: resolveArtifact(outputDir, files.articleInputPath),
    contentBriefPath: resolveArtifact(outputDir, files.contentBriefPath),
    evidenceMapPath: resolveArtifact(outputDir, files.evidenceMapPath),
    scriptAttemptPath: resolveArtifact(outputDir, files.scriptAttemptPath),
    semanticReviewAttemptPath: resolveArtifact(outputDir, files.semanticReviewAttemptPath),
    visibleCopyAttemptPath: resolveArtifact(outputDir, files.visibleCopyAttemptPath),
    runtimeSelectionPlanPath: resolveArtifact(outputDir, files.runtimeSelectionPlanPath),
    articleVideoJobPath: resolveArtifact(outputDir, files.articleVideoJobPath),
  };
  if (!Object.values(required).every(fileExists)) return { manifest, valid: false, reason: "CHECKPOINT_ARTIFACT_MISSING" };
  const current = dependencyHashes({ ...required, sourceSnapshotHash: manifest.dependencyHashes.sourceSnapshotHash });
  const mismatch = Object.entries(current).find(([key, value]) => manifest.dependencyHashes[key] !== value);
  if (mismatch) return { manifest, valid: false, reason: `CHECKPOINT_INVALIDATED:${mismatch[0]}` };
  return { manifest, valid: true };
}

export function createPreviewApprovedCheckpoint(input: {
  outputDir: string;
  visibleCopyCheckpoint: BatchCheckpointManifest;
  previewAttemptPath: string;
  previewQaSummaryPath: string;
  frameQaSummaryPath: string;
  mediaToolchainStatus: string;
}): BatchCheckpointManifest | undefined {
  const previewAttempt = readJson<{ renderInputPath: string; previewPath: string; attemptId: string }>(input.previewAttemptPath);
  const previewQa = readJson<{ finalPreviewStatus: string; frameQa?: Record<string, unknown> }>(input.previewQaSummaryPath);
  const frameQa = readJson<{ frameQaStatus?: string; frameQaExecuted?: boolean }>(input.frameQaSummaryPath);
  if (previewQa.finalPreviewStatus !== "passed" || frameQa.frameQaStatus !== "passed" || frameQa.frameQaExecuted !== true) return undefined;
  const baseHashes = input.visibleCopyCheckpoint.dependencyHashes;
  const manifest: BatchCheckpointManifest = {
    ...input.visibleCopyCheckpoint,
    checkpointId: "checkpoint-preview-approved",
    createdAt: new Date().toISOString(),
    checkpointStage: "PREVIEW_QA",
    dependencyHashes: {
      ...baseHashes,
      previewRenderInputHash: hashFile(previewAttempt.renderInputPath),
      previewFileHash: hashFile(previewAttempt.previewPath),
      previewQaSummaryHash: hashFile(input.previewQaSummaryPath),
      frameQaSummaryHash: hashFile(input.frameQaSummaryPath),
      mediaToolchainStatus: hashText(input.mediaToolchainStatus),
    },
    artifactPaths: {
      ...input.visibleCopyCheckpoint.artifactPaths,
      previewAttemptPath: relative(input.outputDir, input.previewAttemptPath),
      previewRenderInputPath: relative(input.outputDir, previewAttempt.renderInputPath),
      previewFilePath: relative(input.outputDir, previewAttempt.previewPath),
      previewQaSummaryPath: relative(input.outputDir, input.previewQaSummaryPath),
      frameQaSummaryPath: relative(input.outputDir, input.frameQaSummaryPath),
    },
    qualityStatuses: {
      ...input.visibleCopyCheckpoint.qualityStatuses,
      previewQaStatus: "passed",
      frameQaStatus: "passed",
      mediaToolchainStatus: input.mediaToolchainStatus,
      previewApprovedForFinalRender: true,
    },
    resumeAllowedStages: ["FINAL_RENDER", "OUTPUT_QA", "FINAL_DELIVERY"],
    invalidated: false,
  };
  const checkpointDir = path.join(input.outputDir, "checkpoints");
  writeJson(path.join(checkpointDir, "checkpoint-preview-approved.json"), manifest);
  writeJson(path.join(checkpointDir, "checkpoint-manifest.json"), manifest);
  const historyPath = path.join(checkpointDir, "checkpoint-history.json");
  const history = fs.existsSync(historyPath) ? readJson<BatchCheckpointManifest[]>(historyPath) : [];
  writeJson(historyPath, [...history.filter((item) => item.checkpointId !== manifest.checkpointId), manifest]);
  return manifest;
}

export function validatePreviewApprovedCheckpoint(outputDir: string, manifest: BatchCheckpointManifest): { valid: true } | { valid: false; reason: string } {
  const keys = [
    ["previewRenderInputHash", "previewRenderInputPath"],
    ["previewFileHash", "previewFilePath"],
    ["previewQaSummaryHash", "previewQaSummaryPath"],
    ["frameQaSummaryHash", "frameQaSummaryPath"],
  ] as const;
  for (const [hashKey, pathKey] of keys) {
    const artifactPath = manifest.artifactPaths[pathKey];
    if (!artifactPath) return { valid: false, reason: `CHECKPOINT_INVALIDATED:${pathKey}` };
    const fullPath = resolveArtifact(outputDir, artifactPath);
    if (!fileExists(fullPath)) return { valid: false, reason: `CHECKPOINT_INVALIDATED:${pathKey}` };
    if (hashFile(fullPath) !== manifest.dependencyHashes[hashKey]) return { valid: false, reason: `CHECKPOINT_INVALIDATED:${hashKey}` };
  }
  if (manifest.qualityStatuses.previewQaStatus !== "passed" || manifest.qualityStatuses.frameQaStatus !== "passed" || manifest.qualityStatuses.previewApprovedForFinalRender !== true) {
    return { valid: false, reason: "CHECKPOINT_INVALIDATED:preview_quality_status" };
  }
  return { valid: true };
}

export function loadCheckpointArtifacts(outputDir: string, manifest: BatchCheckpointManifest) {
  return {
    article: readJson<ArticleInput>(resolveArtifact(outputDir, manifest.artifactPaths.articleInputPath)),
    brief: readJson<ArticleContentBrief>(resolveArtifact(outputDir, manifest.artifactPaths.contentBriefPath)),
    evidence: readJson<EvidenceItem[]>(resolveArtifact(outputDir, manifest.artifactPaths.evidenceMapPath)),
    scriptPlan: readJson<ArticleScriptPlan>(resolveArtifact(outputDir, manifest.artifactPaths.scriptAttemptPath)),
  };
}
