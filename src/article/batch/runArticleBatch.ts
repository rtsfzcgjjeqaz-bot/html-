import fs from "fs";
import path from "path";
import crypto from "crypto";
import { articleBatchQualityPolicy, type ArticleBatchStage, type ArticleBatchStageStatus } from "./articleBatchQualityPolicy";
import { buildArticleScriptPlan } from "./articleScriptPlan";
import { runInputReadingGate } from "./inputReadingGate";
import { runInputIntegrityGate, type InputIntegrityReport } from "./inputIntegrityGate";
import { buildScriptRepairPlan, runScriptQa } from "./scriptQaGate";
import { runSemanticReview } from "./semanticReviewAdapter";
import { routingDecisionForDefect, runSemanticIssueRoutingGuard, type SemanticIssueRoutingDecision } from "./semanticIssueRoutingGuard";
import { runSemanticProviderPreflight } from "./semanticProviderPreflight";
import { runScriptRepairAdapter } from "./scriptRepairAdapter";
import { runVisibleCopyRepairAdapter } from "./visibleCopyRepairAdapter";
import { runVisibleCopyQa } from "./visibleCopyQaGate";
import { runPreviewRenderGate } from "./previewRenderGate";
import { runPreviewQaGate } from "./previewQaGate";
import { buildPreviewRepairPlan } from "./previewRepairRouter";
import { runMediaToolchainPreflight } from "./mediaToolchainPreflight";
import { createPreviewApprovedCheckpoint, createVisibleCopyApprovedCheckpointFromLatest, loadAndValidateCheckpoint, loadCheckpointArtifacts, loadRuntimeSelectionPlanArtifact, validatePreviewApprovedCheckpoint } from "./checkpointManager";
import { runFinalRenderGate } from "./finalRenderGate";
import { runOutputQaGate } from "./outputQaGate";
import { runFinalDeliveryGate } from "./finalDeliveryGate";
import type { SemanticReviewIssue, SemanticReviewResult } from "./semanticReviewSchema";
import type { ArticleBatchInputBundle, ArticleBatchJobState, ArticleScriptPlan, BatchDefect, InputRecoveryHistoryEntry, InputReadingQaReport, ScriptQaReport, StructuredDataItem, VisibleCopyGateResult } from "./articleBatchTypes";
import { buildArticleVideoJob } from "../buildArticleVideoJob";
import { normalizeApiArticleToInput } from "../normalizeApiArticleToInput";
import { normalizeArticleToContentBrief } from "../normalizeArticleToContentBrief";
import type { ApiArticleRecord, ArticleContentBrief, ArticleInput, EvidenceItem } from "../types";
import { ensureMacShotRuntimeForBatch, requiredMacRuntimeSource, summarizeRuntimePinning, validatePinnedRuntimeSelectionPlan, type MacRuntimePinningSnapshot } from "./macRuntimeCheckpointPinning";

type CliArgs = { inputJsonDir?: string; output?: string; stopAfter?: ArticleBatchStage; resumeFromCheckpoint?: string };

type ScriptGateResult = {
  scriptPlan: ArticleScriptPlan;
  scriptQa: ScriptQaReport;
  semanticReview: SemanticReviewResult;
  semanticProviderAvailable: boolean;
  semanticModelId?: string;
  semanticRequestSummaryHash: string;
  repairAttemptCount: number;
  autoRepairExecuted: boolean;
  blockedReason?: string;
  scriptAttemptHistory: string[];
  scriptQaHistory: string[];
  deferredVisibleCopyDefects: BatchDefect[];
  passedWithDeferredVisibleCopyRepairs: boolean;
};

type InputReadAttemptResult = {
  bundle: ArticleBatchInputBundle;
  brief: ArticleContentBrief;
  sourceContentHash: string;
  sourceSnapshotId: string;
  inputQa: InputReadingQaReport;
  inputIntegrity: InputIntegrityReport;
  structuredData: StructuredDataItem[];
  recoveryHistory: InputRecoveryHistoryEntry[];
  reparseTriggered: boolean;
  blockedReason?: "INPUT_INTEGRITY_RETRY_EXHAUSTED" | "SOURCE_SNAPSHOT_NOT_REPARSEABLE";
};

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  const stopAfter = valueAfter("--stop-after") as ArticleBatchStage | undefined;
  return { inputJsonDir: valueAfter("--input-json-dir"), output: valueAfter("--output"), stopAfter, resumeFromCheckpoint: valueAfter("--resume-from-checkpoint") };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").toUpperCase();
}

function nowIso() {
  return new Date().toISOString();
}

function safeJobId(article: ArticleInput) {
  const slug = article.metadata.slug ?? article.articleId;
  return slug.replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 96) || "article-batch-job";
}

function sourceHash(article: ArticleInput) {
  return sha256(JSON.stringify({ title: article.title, rawContent: article.rawContent, sections: article.sections, metadata: article.metadata }));
}

function loadInitialInputBundle(inputDir: string): { bundle: ArticleBatchInputBundle; brief: ArticleContentBrief } {
  const article = readJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = readJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const evidence = fs.existsSync(path.join(inputDir, "evidence-map.json")) ? readJson<EvidenceItem[]>(path.join(inputDir, "evidence-map.json")) : brief.evidence;
  return { bundle: { article, evidence, sourceInputDir: inputDir }, brief };
}

function rebuildInputBundleFromCanonicalSource(inputDir: string): { bundle: ArticleBatchInputBundle; brief: ArticleContentBrief } | undefined {
  const rawApiArticlePath = path.join(inputDir, "raw-api-article.json");
  if (!fs.existsSync(rawApiArticlePath)) {
    return undefined;
  }
  const rawApiArticle = readJson<ApiArticleRecord>(rawApiArticlePath);
  const article = normalizeApiArticleToInput(rawApiArticle);
  const brief = normalizeArticleToContentBrief(article);
  return { bundle: { article, evidence: brief.evidence, sourceInputDir: inputDir }, brief };
}

function writeSnapshot(outputDir: string, bundle: ArticleBatchInputBundle, sourceContentHash: string, attemptId: string) {
  const snapshotId = `input_${attemptId}`;
  const snapshotDir = path.join(outputDir, "input-snapshots", snapshotId);
  ensureDir(snapshotDir);
  writeJson(path.join(snapshotDir, "article-input.json"), bundle.article);
  writeJson(path.join(snapshotDir, "evidence-map.json"), bundle.evidence);
  writeJson(path.join(snapshotDir, "input-snapshot-summary.json"), {
    sourceSnapshotId: snapshotId,
    sourceInputDir: bundle.sourceInputDir,
    sourceContentHash,
    articleSlug: bundle.article.metadata.slug ?? bundle.article.articleId,
    title: bundle.article.title,
    sourceType: bundle.article.sourceType,
    createdAt: nowIso(),
  });
  return snapshotId;
}

function stage(stage: ArticleBatchStage, status: ArticleBatchStageStatus, summary: string, attemptId?: string) {
  return { stage, status, at: nowIso(), attemptId, summary };
}

function stopReached(current: ArticleBatchStage, stopAfter?: ArticleBatchStage) {
  if (!stopAfter) return false;
  return articleBatchQualityPolicy.stageOrder.indexOf(current) >= articleBatchQualityPolicy.stageOrder.indexOf(stopAfter);
}


function applyMacRuntimePinning(jobState: ArticleBatchJobState, pinning: ReturnType<typeof summarizeRuntimePinning>) {
  jobState.runtimePinningStatus = pinning.runtimePinningStatus;
  jobState.runtimeSelectionPlanHash = pinning.runtimeSelectionPlanHash;
  jobState.canonicalRuntimeSelectionPlanHash = pinning.canonicalRuntimeSelectionPlanHash;
  if (pinning.macShotRuntimeStatus) jobState.macShotRuntimeStatus = pinning.macShotRuntimeStatus;
  if (pinning.macShotSourceBranch) jobState.macShotSourceBranch = pinning.macShotSourceBranch;
  if (pinning.macShotSourceCommit) jobState.macShotSourceCommit = pinning.macShotSourceCommit;
  if (pinning.macShotRuntimeCatalogVersion) jobState.macShotRuntimeCatalogVersion = pinning.macShotRuntimeCatalogVersion;
  if (pinning.generatedRuntimeRegistryHash) jobState.generatedRuntimeRegistryHash = pinning.generatedRuntimeRegistryHash;
}

function applyMacRuntimeSnapshot(jobState: ArticleBatchJobState, snapshot: MacRuntimePinningSnapshot) {
  jobState.macShotRuntimeStatus = snapshot.macShotRuntimeStatus;
  jobState.macShotSourceSyncStatus = "passed";
  jobState.macShotSourceBranch = snapshot.macShotSourceBranch;
  jobState.macShotSourceCommit = snapshot.macShotSourceCommit;
  jobState.macShotPackagesDiscovered = snapshot.macShotPackagesDiscovered;
  jobState.macShotPackagesValidated = snapshot.macShotPackagesValidated;
  jobState.macShotPackagesRejected = snapshot.macShotPackagesRejected;
  jobState.macShotRuntimeCatalogVersion = snapshot.macShotRuntimeCatalogVersion;
  jobState.generatedRuntimeRegistryHash = snapshot.generatedRuntimeRegistryHash;
}

function buildInitialJobState(input: {
  jobId: string;
  articleSlug: string;
  sourceSnapshotId: string;
  sourceContentHash: string;
}): ArticleBatchJobState {
  return {
    jobId: input.jobId,
    articleSlug: input.articleSlug,
    sourceSnapshotId: input.sourceSnapshotId,
    sourceContentHash: input.sourceContentHash,
    qualityPolicyId: articleBatchQualityPolicy.qualityPolicyId,
    qualityPolicyVersion: articleBatchQualityPolicy.policyVersion,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    currentStage: "INPUT_READING",
    stageHistory: [],
    attemptCounts: {
      inputRead: 1,
      scriptGeneration: 0,
      scriptQa: 0,
      scriptRepair: 0,
      previewRender: 0,
      finalRender: 0,
    },
    repairHistory: [],
    finalStatus: "running",
  };
}

function rejectedReason(inputQa: InputReadingQaReport, inputIntegrity: InputIntegrityReport) {
  if (inputIntegrity.status === "rejected") return "INPUT_INTEGRITY";
  if (inputQa.status === "rejected") return "INPUT_READING_QA";
  return undefined;
}

function writeInputReadingQaSummary(outputDir: string, value: {
  inputQa: InputReadingQaReport;
  inputIntegrity: InputIntegrityReport;
  sourceSnapshotId: string;
  sourceContentHash: string;
}) {
  writeJson(path.join(outputDir, "qa-reports", "input-reading-qa-summary.json"), {
    status: value.inputQa.status === "passed" && value.inputIntegrity.status === "passed" ? "passed" : "rejected",
    sourceSnapshotId: value.sourceSnapshotId,
    sourceContentHash: value.sourceContentHash,
    inputQaStatus: value.inputQa.status,
    inputIntegrityStatus: value.inputIntegrity.status,
    inputIntegrityDefectCount: value.inputIntegrity.defects.length,
    evidenceCount: value.inputQa.evidenceCount,
    tableCount: value.inputQa.tableCount,
  });
}

function runInputReadingWithRecovery(input: { inputDir: string; outputDir: string; baseAttemptId: string }): InputReadAttemptResult {
  const maxAttempts = articleBatchQualityPolicy.retryPolicy.maxInputReadAttempts;
  const recoveryHistory: InputRecoveryHistoryEntry[] = [];
  let latest: Omit<InputReadAttemptResult, "recoveryHistory" | "reparseTriggered" | "blockedReason"> | undefined;
  let reparseTriggered = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attemptId = `${input.baseAttemptId}_${String(attempt).padStart(2, "0")}`;
    const loaded = attempt === 1 ? loadInitialInputBundle(input.inputDir) : rebuildInputBundleFromCanonicalSource(input.inputDir);
    if (!loaded) {
      if (latest) {
        recoveryHistory.push({
          attemptId,
          sourceSnapshotId: latest.sourceSnapshotId,
          sourceContentHash: latest.sourceContentHash,
          createdAt: nowIso(),
          inputQaStatus: latest.inputQa.status,
          inputIntegrityStatus: latest.inputIntegrity.status,
          result: "not_reparseable",
          rejectedReason: "SOURCE_SNAPSHOT_NOT_REPARSEABLE",
          rebuiltFromCanonicalSource: false,
        });
      }
      writeJson(path.join(input.outputDir, "input-recovery-history.json"), recoveryHistory);
      return {
        ...(latest ?? (() => {
          throw new Error("SOURCE_SNAPSHOT_NOT_REPARSEABLE");
        })()),
        recoveryHistory,
        reparseTriggered,
        blockedReason: "SOURCE_SNAPSHOT_NOT_REPARSEABLE",
      };
    }

    const sourceContentHash = sourceHash(loaded.bundle.article);
    const sourceSnapshotId = writeSnapshot(input.outputDir, loaded.bundle, sourceContentHash, attemptId);
    const { report: inputQa, structuredData } = runInputReadingGate(loaded.bundle, loaded.brief, sourceContentHash);
    const inputIntegrity = runInputIntegrityGate({
      article: loaded.bundle.article,
      evidence: loaded.bundle.evidence,
      sourceSnapshotId,
      sourceContentHash,
    });
    writeJson(path.join(input.outputDir, "qa-reports", `${sourceSnapshotId}-input-reading-qa.json`), inputQa);
    writeJson(path.join(input.outputDir, "input-integrity-attempts", `${sourceSnapshotId}-input-integrity-report.json`), inputIntegrity);
    writeJson(path.join(input.outputDir, "input-integrity-attempts", "input-integrity-report.json"), inputIntegrity);
    writeJson(path.join(input.outputDir, "input-snapshots", sourceSnapshotId, "structured-data.json"), structuredData);
    writeInputReadingQaSummary(input.outputDir, { inputQa, inputIntegrity, sourceSnapshotId, sourceContentHash });

    const result = inputQa.status === "passed" && inputIntegrity.status === "passed" ? "accepted" : "rejected";
    const historyEntry: InputRecoveryHistoryEntry = {
      attemptId,
      sourceSnapshotId,
      sourceContentHash,
      createdAt: nowIso(),
      inputQaStatus: inputQa.status,
      inputIntegrityStatus: inputIntegrity.status,
      result,
      rejectedReason: rejectedReason(inputQa, inputIntegrity),
      rebuiltFromCanonicalSource: attempt > 1,
    };
    recoveryHistory.push(historyEntry);
    writeJson(path.join(input.outputDir, "input-recovery-history.json"), recoveryHistory);

    latest = {
      bundle: loaded.bundle,
      brief: loaded.brief,
      sourceContentHash,
      sourceSnapshotId,
      inputQa,
      inputIntegrity,
      structuredData,
    };

    if (result === "accepted") {
      return { ...latest, recoveryHistory, reparseTriggered };
    }
    if (attempt < maxAttempts) {
      reparseTriggered = true;
      continue;
    }
  }

  if (!latest) {
    throw new Error("Input reading did not produce an attempt.");
  }
  return { ...latest, recoveryHistory, reparseTriggered, blockedReason: "INPUT_INTEGRITY_RETRY_EXHAUSTED" };
}

function summarizeDefects(defects: Array<{ severity: string }>) {
  return {
    blockerCount: defects.filter((item) => item.severity === "BLOCKER").length,
    repairableCount: defects.filter((item) => item.severity === "REPAIRABLE").length,
    warningCount: defects.filter((item) => item.severity === "WARNING").length,
  };
}

function semanticIssueToDefect(issue: SemanticReviewIssue, routingDecision?: SemanticIssueRoutingDecision): BatchDefect {
  const isInputIntegrity = issue.category === "INPUT_INTEGRITY";
  return {
    issueId: issue.issueId,
    severity: issue.severity,
    category: issue.category,
    sceneIds: issue.sceneIds.map((sceneId) => Number(sceneId)).filter((sceneId) => Number.isFinite(sceneId)),
    evidenceIds: issue.evidenceIds,
    tableIds: issue.tableIds,
    message: issue.message,
    detectedBy: "semanticReviewAdapter",
    repairScope: isInputIntegrity ? "re_read_input" : issue.repairScope,
    recommendedAction: isInputIntegrity ? "Route back to INPUT_READING and rebuild from canonical source." : issue.recommendedAction,
    autoRepairEligible: isInputIntegrity ? true : issue.autoRepairEligible,
    routingGuard: routingDecisionForDefect(routingDecision),
  };
}

function combineScriptQa(deterministicQa: ScriptQaReport, semanticReview: SemanticReviewResult, routingDecisions: SemanticIssueRoutingDecision[] = []): ScriptQaReport {
  const routingByIssueId = new Map(routingDecisions.map((decision) => [decision.issueId, decision]));
  const semanticDefects = semanticReview.issues.map((issue) => semanticIssueToDefect(issue, routingByIssueId.get(issue.issueId)));
  const defects = [...deterministicQa.defects, ...semanticDefects];
  const counts = summarizeDefects(defects);
  return {
    ...deterministicQa,
    semanticReviewStatus: semanticReview.reviewStatus === "passed" && semanticReview.issues.length ? "issues_found" : semanticReview.reviewStatus,
    checks: {
      ...deterministicQa.checks,
      semanticReviewExecutedByAdapter: true,
      semanticReviewSchemaValid: !["provider_unavailable", "response_invalid"].includes(semanticReview.reviewStatus),
      semanticReviewPassed: semanticReview.reviewStatus === "passed" && semanticReview.issues.length === 0,
    },
    defects,
    status: counts.blockerCount > 0 ? "blocked" : counts.repairableCount > 0 ? "repair_required" : "passed",
    ...counts,
  };
}

function isVisibleCopyDefect(defect: BatchDefect) {
  return defect.repairScope === "repair_visible_copy" || defect.category.startsWith("VISIBLE_COPY_") || defect.category === "INCOMPLETE_COPY";
}

function canDeferToVisibleCopy(defects: BatchDefect[]) {
  return defects.some((defect) => isVisibleCopyDefect(defect) && defect.autoRepairEligible) && defects.every((defect) => isVisibleCopyDefect(defect) && defect.autoRepairEligible && defect.severity !== "BLOCKER");
}

async function runScriptGate(input: {
  outputDir: string;
  attemptPrefix: string;
  article: ArticleInput;
  brief: ArticleContentBrief;
  evidence: EvidenceItem[];
  structuredData: ReturnType<typeof runInputReadingGate>["structuredData"];
  inputIntegrityReport: InputIntegrityReport;
  initialScriptPlan: ArticleScriptPlan;
}): Promise<ScriptGateResult> {
  let scriptPlan = input.initialScriptPlan;
  const scriptAttemptHistory: string[] = [];
  const scriptQaHistory: string[] = [];
  let repairAttemptCount = 0;
  let autoRepairExecuted = false;
  let lastQa: ScriptQaReport | undefined;
  let lastSemantic: SemanticReviewResult | undefined;
  let semanticProviderAvailable = false;
  let semanticModelId: string | undefined;
  let semanticRequestSummaryHash = "";
  let blockedReason: string | undefined;
  let deferredVisibleCopyDefects: BatchDefect[] = [];
  let passedWithDeferredVisibleCopyRepairs = false;

  for (let attempt = 1; attempt <= articleBatchQualityPolicy.scriptRepair.maxAttempts + 1; attempt += 1) {
    const scriptAttemptId = `${input.attemptPrefix}_${String(attempt).padStart(2, "0")}`;
    writeJson(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`), scriptPlan);
    scriptAttemptHistory.push(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`));

    const deterministicQa = runScriptQa(scriptPlan, input.structuredData);
    const semantic = await runSemanticReview({
      article: input.article,
      brief: input.brief,
      scriptPlan,
      evidenceMap: input.evidence,
      structuredDataInventory: input.structuredData,
    });
    semanticProviderAvailable = semantic.providerAvailable;
    semanticModelId = semantic.modelId;
    semanticRequestSummaryHash = semantic.requestSummaryHash;
    const routingGuard = runSemanticIssueRoutingGuard({
      semanticReview: semantic.result,
      scriptPlan,
      evidenceMap: input.evidence,
      structuredDataInventory: input.structuredData,
      inputIntegrityReport: input.inputIntegrityReport,
    });
    lastSemantic = routingGuard.result;
    writeJson(path.join(input.outputDir, "semantic-review-attempts", `semantic-review-${String(attempt).padStart(2, "0")}.json`), {
      providerAvailable: semantic.providerAvailable,
      modelId: semantic.modelId,
      requestSummaryHash: semantic.requestSummaryHash,
      validationErrors: semantic.validationErrors,
      normalizationDiagnostics: semantic.normalizationDiagnostics,
      routingGuardDiagnostics: {
        applied: routingGuard.decisions.some((decision) => decision.routingDecision !== "kept_original_route"),
        decisions: routingGuard.decisions,
      },
      result: semantic.result,
      effectiveResult: routingGuard.result,
    });

    const combinedQa = combineScriptQa(deterministicQa, routingGuard.result, routingGuard.decisions);
    lastQa = combinedQa;
    const qaPath = path.join(input.outputDir, "qa-reports", `${scriptAttemptId}-script-qa.json`);
    writeJson(qaPath, combinedQa);
    scriptQaHistory.push(qaPath);

    const repairPlan = buildScriptRepairPlan(combinedQa);
    writeJson(path.join(input.outputDir, "repair-plans", `${scriptAttemptId}-repair-plan.json`), repairPlan);

    if (combinedQa.status === "passed") {
      scriptPlan = { ...scriptPlan, scriptStatus: "qa_passed" };
      writeJson(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`), scriptPlan);
      break;
    }

    if (canDeferToVisibleCopy(combinedQa.defects)) {
      deferredVisibleCopyDefects = combinedQa.defects.filter(isVisibleCopyDefect);
      passedWithDeferredVisibleCopyRepairs = true;
      scriptPlan = { ...scriptPlan, scriptStatus: "qa_passed" };
      writeJson(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`), scriptPlan);
      break;
    }

    if (combinedQa.status === "blocked") {
      blockedReason = semantic.result.reviewStatus === "provider_unavailable" ? "SEMANTIC_REVIEW_PROVIDER_UNAVAILABLE" : semantic.result.reviewStatus === "response_invalid" ? "SEMANTIC_REVIEW_RESPONSE_INVALID" : "SCRIPT_QA_BLOCKED";
      scriptPlan = { ...scriptPlan, scriptStatus: "blocked" };
      writeJson(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`), scriptPlan);
      break;
    }

    if (attempt > articleBatchQualityPolicy.scriptRepair.maxAttempts) {
      blockedReason = "SCRIPT_REPAIR_ATTEMPTS_EXHAUSTED";
      scriptPlan = { ...scriptPlan, scriptStatus: "blocked" };
      writeJson(path.join(input.outputDir, "script-attempts", `${scriptAttemptId}.json`), scriptPlan);
      break;
    }

    const repair = runScriptRepairAdapter({ scriptPlan, defects: combinedQa.defects, repairPlan, attemptNumber: attempt, evidenceMap: input.evidence });
    writeJson(path.join(input.outputDir, "script-repair-attempts", `script-repair-${String(attempt).padStart(2, "0")}.json`), repair);
    if (!repair.repaired) {
      blockedReason = repair.blockedReason ?? "SCRIPT_REPAIR_BLOCKED";
      scriptPlan = { ...scriptPlan, scriptStatus: "blocked" };
      break;
    }
    repairAttemptCount += 1;
    autoRepairExecuted = true;
    scriptPlan = repair.newPlan;
  }

  writeJson(path.join(input.outputDir, "script-attempts", "script-attempt-history.json"), scriptAttemptHistory);
  writeJson(path.join(input.outputDir, "qa-reports", "script-qa-history.json"), scriptQaHistory);

  return {
    scriptPlan,
    scriptQa: lastQa ?? runScriptQa(scriptPlan, input.structuredData),
    semanticReview: lastSemantic ?? {
      reviewStatus: "response_invalid",
      reviewer: { reviewVersion: "article-semantic-review-v1" },
      issues: [],
    },
    semanticProviderAvailable,
    semanticModelId,
    semanticRequestSummaryHash,
    repairAttemptCount,
    autoRepairExecuted,
    blockedReason,
    scriptAttemptHistory,
    scriptQaHistory,
    deferredVisibleCopyDefects,
    passedWithDeferredVisibleCopyRepairs,
  };
}

function runVisibleCopyGate(input: {
  outputDir: string;
  article: ArticleInput;
  brief: ArticleContentBrief;
  evidence: EvidenceItem[];
  scriptPlan: ArticleScriptPlan;
  deferredDefects: BatchDefect[];
}): VisibleCopyGateResult {
  let visibleCopyPlan = buildArticleVideoJob(input.article, input.brief, input.outputDir).visibleCopyPlan ?? [];
  const visibleCopyAttemptHistory: string[] = [];
  const visibleCopyQaHistory: string[] = [];
  const visibleCopyRepairHistory = [];
  let visibleCopyBlockedReason: string | undefined;

  for (let attempt = 1; attempt <= articleBatchQualityPolicy.retryPolicy.maxScriptRepairAttempts + 1; attempt += 1) {
    const attemptId = `visible-copy-${String(attempt).padStart(2, "0")}`;
    const visibleCopyPath = path.join(input.outputDir, "visible-copy-attempts", `${attemptId}.json`);
    writeJson(visibleCopyPath, visibleCopyPlan);
    visibleCopyAttemptHistory.push(visibleCopyPath);

    const qa = runVisibleCopyQa({
      visibleCopyPlan,
      scriptPlan: input.scriptPlan,
      evidence: input.evidence,
      deferredDefects: attempt === 1 ? input.deferredDefects : [],
    });
    const qaPath = path.join(input.outputDir, "qa-reports", `visible-copy-qa-${String(attempt).padStart(2, "0")}.json`);
    writeJson(qaPath, qa);
    visibleCopyQaHistory.push(qaPath);

    if (qa.status === "passed") {
      writeJson(path.join(input.outputDir, "visible-copy-repair-history.json"), visibleCopyRepairHistory);
      return {
        visibleCopyPlan,
        visibleCopyQaStatus: "passed",
        visibleCopyRepairAttemptCount: visibleCopyRepairHistory.length,
        visibleCopyRepairHistory,
        visibleCopyAttemptHistory,
        visibleCopyQaHistory,
      };
    }

    if (qa.status === "blocked" || attempt > articleBatchQualityPolicy.retryPolicy.maxScriptRepairAttempts) {
      visibleCopyBlockedReason = qa.status === "blocked" ? "VISIBLE_COPY_QA_BLOCKED" : "VISIBLE_COPY_REPAIR_ATTEMPTS_EXHAUSTED";
      writeJson(path.join(input.outputDir, "visible-copy-repair-history.json"), visibleCopyRepairHistory);
      return {
        visibleCopyPlan,
        visibleCopyQaStatus: qa.status,
        visibleCopyRepairAttemptCount: visibleCopyRepairHistory.length,
        visibleCopyRepairHistory,
        visibleCopyBlockedReason,
        visibleCopyAttemptHistory,
        visibleCopyQaHistory,
      };
    }

    const repair = runVisibleCopyRepairAdapter({
      visibleCopyPlan,
      scriptPlan: input.scriptPlan,
      evidence: input.evidence,
      defects: qa.defects,
      attemptNumber: attempt,
    });
    writeJson(path.join(input.outputDir, "visible-copy-repair-attempts", `visible-copy-repair-${String(attempt).padStart(2, "0")}.json`), repair);
    visibleCopyRepairHistory.push(repair.history);
    if (!repair.repaired) {
      visibleCopyBlockedReason = repair.blockedReason ?? "VISIBLE_COPY_REPAIR_BLOCKED";
      break;
    }
    visibleCopyPlan = repair.newPlan;
  }

  writeJson(path.join(input.outputDir, "visible-copy-repair-history.json"), visibleCopyRepairHistory);
  return {
    visibleCopyPlan,
    visibleCopyQaStatus: "blocked",
    visibleCopyRepairAttemptCount: visibleCopyRepairHistory.length,
    visibleCopyRepairHistory,
    visibleCopyBlockedReason: visibleCopyBlockedReason ?? "VISIBLE_COPY_REPAIR_BLOCKED",
    visibleCopyAttemptHistory,
    visibleCopyQaHistory,
  };
}

async function runResumeFromCheckpoint(input: { outputDir: string; checkpointId: string; stopAfter?: ArticleBatchStage }) {
  [
    "checkpoints",
    "preview-attempts",
    "preview-qa",
    "preview-repair-plans",
    "final-render-attempts",
    "output-qa",
    "final-delivery",
  ].forEach((dir) => ensureDir(path.join(input.outputDir, dir)));

  if (input.checkpointId === "checkpoint-visible-copy-approved") {
    const created = createVisibleCopyApprovedCheckpointFromLatest(input.outputDir);
    if (!created) {
      writeJson(path.join(input.outputDir, "batch-dry-run-summary.json"), {
        status: "blocked",
        currentStage: "VISIBLE_COPY_AND_VISUAL_PLAN",
        checkpointResume: true,
        checkpointId: input.checkpointId,
        blocked: true,
        blockedReason: "CHECKPOINT_SOURCE_NOT_AVAILABLE",
      });
      console.log(`checkpointId=${input.checkpointId}`);
      console.log("blocked=true");
      console.log("blockedReason=CHECKPOINT_SOURCE_NOT_AVAILABLE");
      return;
    }
  }

  const checkpoint = loadAndValidateCheckpoint(input.outputDir, input.checkpointId);
  if (!checkpoint.valid) {
    writeJson(path.join(input.outputDir, "batch-dry-run-summary.json"), {
      status: "blocked",
      currentStage: "VISIBLE_COPY_AND_VISUAL_PLAN",
      checkpointResume: true,
      checkpointId: input.checkpointId,
      blocked: true,
      blockedReason: checkpoint.reason,
    });
    console.log(`checkpointId=${input.checkpointId}`);
    console.log("blocked=true");
    console.log(`blockedReason=${checkpoint.reason}`);
    return;
  }

  const pinnedRuntimeSelectionPlan = loadRuntimeSelectionPlanArtifact(input.outputDir, checkpoint.manifest);
  let resumeMacRuntimeSnapshot: MacRuntimePinningSnapshot | undefined;
  try {
    if (pinnedRuntimeSelectionPlan) {
      const requiredRuntime = requiredMacRuntimeSource(pinnedRuntimeSelectionPlan);
      if (requiredRuntime.requiredSourceCommit) {
        resumeMacRuntimeSnapshot = ensureMacShotRuntimeForBatch(requiredRuntime);
        validatePinnedRuntimeSelectionPlan(pinnedRuntimeSelectionPlan, resumeMacRuntimeSnapshot);
      }
    }
  } catch (error) {
    const blockedReason = error instanceof Error ? error.name : "MAC_SHOT_CHECKPOINT_RUNTIME_IDENTITY_MISMATCH";
    writeJson(path.join(input.outputDir, "batch-dry-run-summary.json"), {
      status: "blocked",
      currentStage: "VISIBLE_COPY_AND_VISUAL_PLAN",
      checkpointResume: true,
      checkpointId: input.checkpointId,
      blocked: true,
      blockedReason,
      failureCode: blockedReason,
    });
    console.log(`checkpointId=${input.checkpointId}`);
    console.log("blocked=true");
    console.log(`blockedReason=${blockedReason}`);
    return;
  }

  const { article, brief, scriptPlan } = loadCheckpointArtifacts(input.outputDir, checkpoint.manifest);
  const attemptId = `resume_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const jobState: ArticleBatchJobState = {
    jobId: `resume-${checkpoint.manifest.checkpointId}`,
    articleSlug: article.metadata.slug ?? article.articleId,
    sourceSnapshotId: checkpoint.manifest.sourceAttemptIds.sourceSnapshotId,
    sourceContentHash: checkpoint.manifest.dependencyHashes.sourceSnapshotHash,
    qualityPolicyId: articleBatchQualityPolicy.qualityPolicyId,
    qualityPolicyVersion: articleBatchQualityPolicy.policyVersion,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    currentStage: "PREVIEW_RENDER",
    stageHistory: [
      stage("VISIBLE_COPY_AND_VISUAL_PLAN", "passed", "Resumed from validated visible-copy checkpoint.", checkpoint.manifest.checkpointId),
    ],
    attemptCounts: { inputRead: 0, scriptGeneration: 0, scriptQa: 0, scriptRepair: 0, previewRender: 0, finalRender: 0 },
    repairHistory: [],
    finalStatus: "running",
    deferredVisibleCopyDefects: [],
    visibleCopyQaStatus: "passed",
    visibleCopyRepairAttemptCount: 0,
    finalDeliveryEligible: false,
  };
  if (pinnedRuntimeSelectionPlan) {
    applyMacRuntimePinning(jobState, summarizeRuntimePinning(pinnedRuntimeSelectionPlan, resumeMacRuntimeSnapshot));
  }

  jobState.stageHistory.push(stage("PREVIEW_RENDER", "running", "Rendering article preview from checkpoint.", attemptId));
  const previewRender = await runPreviewRenderGate({
    outputDir: input.outputDir,
    attemptNumber: 1,
    article,
    brief,
    scriptPlan,
    sourceSnapshotId: checkpoint.manifest.sourceAttemptIds.sourceSnapshotId,
    scriptAttemptId: checkpoint.manifest.sourceAttemptIds.scriptAttemptId,
    visibleCopyAttemptId: checkpoint.manifest.sourceAttemptIds.visibleCopyAttemptId,
    pinnedRuntimeSelectionPlan,
  });
  const previewAttemptHistory = [path.join(input.outputDir, "preview-attempts", previewRender.manifest.attemptId, "preview-attempt.json")];
  jobState.attemptCounts.previewRender = 1;
  if (previewRender.blockedReason) {
    jobState.stageHistory.push(stage("PREVIEW_RENDER", "blocked", "Preview Render preflight failed.", previewRender.manifest.attemptId));
    jobState.blockedReason = previewRender.blockedReason;
    jobState.finalStatus = "blocked";
  } else {
    jobState.stageHistory.push(stage("PREVIEW_RENDER", "passed", "Preview Render completed.", previewRender.manifest.attemptId));
    jobState.currentStage = "MEDIA_TOOLCHAIN_PREFLIGHT";
    jobState.stageHistory.push(stage("MEDIA_TOOLCHAIN_PREFLIGHT", "running", "Checking media toolchain for Frame QA.", "media-toolchain-preflight"));
    const mediaToolchainReport = runMediaToolchainPreflight();
    writeJson(path.join(input.outputDir, "media-toolchain-preflight.json"), mediaToolchainReport);
    jobState.mediaToolchainStatus = mediaToolchainReport.toolchainStatus;
    jobState.ffmpegAvailable = mediaToolchainReport.ffmpegAvailable;
    jobState.ffprobeAvailable = mediaToolchainReport.ffprobeAvailable;
    jobState.stageHistory.push(stage("MEDIA_TOOLCHAIN_PREFLIGHT", "passed", `Media toolchain preflight ${mediaToolchainReport.toolchainStatus}.`, "media-toolchain-preflight"));
    jobState.currentStage = "PREVIEW_QA";
    jobState.stageHistory.push(stage("PREVIEW_QA", "running", "Running Preview QA from checkpoint.", previewRender.manifest.attemptId));
    const previewQaReport = runPreviewQaGate({ outputDir: input.outputDir, manifest: previewRender.manifest, job: previewRender.job, article, brief, scriptPlan, mediaToolchain: mediaToolchainReport });
    const previewQaHistory = [previewRender.manifest.qaSummaryPath];
    const previewRepairPlan = buildPreviewRepairPlan({
      defects: previewQaReport.defects,
      selectedAssetIds: previewQaReport.selectedAssetIds,
      visibleCopyAttemptId: previewRender.manifest.visibleCopyAttemptId,
      scriptAttemptId: previewRender.manifest.scriptAttemptId,
    });
    writeJson(path.join(input.outputDir, "preview-repair-plans", `${previewRender.manifest.attemptId}-preview-repair-plan.json`), previewRepairPlan);
    writeJson(path.join(input.outputDir, "preview-attempt-history.json"), previewAttemptHistory);
    writeJson(path.join(input.outputDir, "preview-qa-history.json"), previewQaHistory);
    jobState.previewAttemptCount = 1;
    jobState.previewQaStatus = previewQaReport.finalPreviewStatus;
    jobState.frameQaStatus = previewQaReport.frameQa.frameQaExecuted ? (previewQaReport.frameQa.frameQaPassed ? "passed" : "failed") : "unavailable";
    jobState.frameQaFailureCategory = typeof previewQaReport.frameQa.reason === "string" ? previewQaReport.frameQa.reason : undefined;
    jobState.previewApprovedForFinalRender = previewQaReport.finalPreviewStatus === "passed" && jobState.frameQaStatus === "passed";
    jobState.finalDeliveryEligible = false;
    if (previewQaReport.finalPreviewStatus === "passed" || previewQaReport.finalPreviewStatus === "passed_with_frame_qa_unavailable") {
      jobState.stageHistory.push(stage("PREVIEW_QA", "passed", `Preview QA ${previewQaReport.finalPreviewStatus}.`, previewRender.manifest.attemptId));
    } else {
      jobState.stageHistory.push(stage("PREVIEW_QA", "blocked", "Preview QA found defects.", previewRender.manifest.attemptId));
      jobState.previewBlockedReason = "PREVIEW_QA_DEFECTS_FOUND";
      jobState.blockedReason = jobState.previewBlockedReason;
    }
    if (previewQaReport.finalPreviewStatus === "passed_with_frame_qa_unavailable") {
      jobState.previewBlockedReason = "MEDIA_TOOLCHAIN_PREFLIGHT_UNAVAILABLE";
      jobState.blockedReason = "MEDIA_TOOLCHAIN_PREFLIGHT_UNAVAILABLE";
      jobState.repairHistory.push({ repairRoute: "toolchain_configuration", issueIds: [mediaToolchainReport.sanitizedFailureCategory ?? "MEDIA_TOOLCHAIN_UNAVAILABLE"], at: nowIso(), status: "blocked" });
    }
    if (!jobState.blockedReason && previewQaReport.finalPreviewStatus === "passed") {
      const frameQaSummaryPath = path.join(input.outputDir, "preview-qa", "frame-qa-summary.json");
      const previewCheckpoint = createPreviewApprovedCheckpoint({
        outputDir: input.outputDir,
        visibleCopyCheckpoint: checkpoint.manifest,
        previewAttemptPath: previewAttemptHistory[0],
        previewQaSummaryPath: previewRender.manifest.qaSummaryPath,
        frameQaSummaryPath,
        mediaToolchainStatus: mediaToolchainReport.toolchainStatus,
      });
      const previewCheckpointValidation = previewCheckpoint ? validatePreviewApprovedCheckpoint(input.outputDir, previewCheckpoint) : { valid: false as const, reason: "CHECKPOINT_SOURCE_NOT_AVAILABLE" };
      if (!previewCheckpoint || !previewCheckpointValidation.valid) {
        jobState.blockedReason = previewCheckpointValidation.valid ? "CHECKPOINT_SOURCE_NOT_AVAILABLE" : previewCheckpointValidation.reason;
        jobState.finalStatus = "blocked";
      } else if (stopReached("PREVIEW_QA", input.stopAfter)) {
        jobState.finalStatus = "dry_run_stopped";
      } else {
        const finalPreconditionsPassed =
          previewCheckpoint.invalidated === false &&
          ["VISIBLE_COPY_AND_VISUAL_PLAN", "PREVIEW_QA"].includes(previewCheckpoint.checkpointStage) &&
          checkpoint.valid === true &&
          checkpoint.manifest.qualityStatuses.inputIntegrityStatus === "passed" &&
          checkpoint.manifest.qualityStatuses.visibleCopyQaStatus === "passed" &&
          checkpoint.manifest.qualityStatuses.strictBindingPassed === true &&
          checkpoint.manifest.qualityStatuses.runtimeSelectionPlanExists === true &&
          mediaToolchainReport.toolchainStatus === "passed" &&
          mediaToolchainReport.ffmpegAvailable === true &&
          mediaToolchainReport.ffprobeAvailable === true &&
          jobState.frameQaStatus === "passed" &&
          previewQaReport.finalPreviewStatus === "passed" &&
          jobState.previewApprovedForFinalRender === true;
        if (!finalPreconditionsPassed) {
          jobState.blockedReason = "FINAL_RENDER_PRECONDITIONS_NOT_MET";
          jobState.finalStatus = "blocked";
        } else {
          jobState.currentStage = "FINAL_RENDER";
          jobState.stageHistory.push(stage("FINAL_RENDER", "running", "Rendering final MP4 from approved preview checkpoint.", "final-01"));
          const finalRender = await runFinalRenderGate({ outputDir: input.outputDir, checkpoint: previewCheckpoint, attemptNumber: 1 });
          jobState.attemptCounts.finalRender = 1;
          jobState.finalRenderAttemptCount = 1;
          jobState.finalRenderStatus = finalRender.status;
          if (finalRender.status === "blocked") {
            jobState.stageHistory.push(stage("FINAL_RENDER", "blocked", "Final Render failed.", finalRender.finalAttemptId));
            jobState.blockedReason = finalRender.blockedReason ?? "ENCODING_FAILURE";
            jobState.repairHistory.push({ repairRoute: "rerender_output", issueIds: [jobState.blockedReason], at: nowIso(), status: "blocked" });
            jobState.finalStatus = "blocked";
          } else {
            jobState.stageHistory.push(stage("FINAL_RENDER", "passed", "Final Render completed.", finalRender.finalAttemptId));
            if (stopReached("FINAL_RENDER", input.stopAfter)) {
              jobState.finalStatus = "dry_run_stopped";
            } else {
              jobState.currentStage = "OUTPUT_QA";
              jobState.stageHistory.push(stage("OUTPUT_QA", "running", "Running final output and final frame QA.", "output-qa-01"));
              const outputQa = runOutputQaGate({ outputDir: input.outputDir, checkpoint: previewCheckpoint, finalRender, mediaToolchain: mediaToolchainReport });
              jobState.outputQaStatus = outputQa.outputQaStatus;
              jobState.finalFrameQaStatus = outputQa.finalFrameQaStatus;
              jobState.repairRoute = outputQa.repairRoute;
              if (outputQa.outputQaStatus !== "passed") {
                jobState.stageHistory.push(stage("OUTPUT_QA", "blocked", "Output QA found defects.", "output-qa-01"));
                jobState.blockedReason = outputQa.defects[0]?.issueId ?? "OUTPUT_QA_DEFECTS_FOUND";
                jobState.repairHistory.push({ repairRoute: outputQa.repairRoute === "not_needed" ? "manual_review" : outputQa.repairRoute, issueIds: outputQa.defects.map((defect) => defect.issueId), at: nowIso(), status: "blocked" });
                jobState.finalDeliveryEligible = false;
                jobState.finalStatus = "blocked";
              } else {
                jobState.stageHistory.push(stage("OUTPUT_QA", "passed", "Output QA passed.", "output-qa-01"));
                if (stopReached("OUTPUT_QA", input.stopAfter)) {
                  jobState.finalStatus = "dry_run_stopped";
                } else {
                  jobState.currentStage = "FINAL_DELIVERY";
                  jobState.stageHistory.push(stage("FINAL_DELIVERY", "running", "Creating local delivery manifest.", "delivery-01"));
                  const delivery = runFinalDeliveryGate({ outputDir: input.outputDir, checkpoint: previewCheckpoint, finalRender, outputQa, blocked: Boolean(jobState.blockedReason) });
                  jobState.finalDeliveryEligible = delivery.finalDeliveryEligible;
                  jobState.finalDeliveryStatus = delivery.finalDeliveryStatus;
                  if (delivery.finalDeliveryStatus === "delivered_local") {
                    jobState.stageHistory.push(stage("FINAL_DELIVERY", "passed", "Local delivery manifest created.", delivery.deliveryId));
                    jobState.finalStatus = "passed";
                  } else {
                    jobState.stageHistory.push(stage("FINAL_DELIVERY", "blocked", "Final Delivery preconditions were not met.", delivery.deliveryId));
                    jobState.blockedReason = delivery.blockedReason;
                    jobState.finalStatus = "blocked";
                  }
                }
              }
            }
          }
        }
      }
    }
    if (!["passed", "blocked", "dry_run_stopped"].includes(jobState.finalStatus)) {
      jobState.finalStatus = jobState.blockedReason ? "blocked" : "running";
    }
  }
  jobState.updatedAt = nowIso();
  writeJson(path.join(input.outputDir, "job-state.json"), jobState);
  writeJson(path.join(input.outputDir, "batch-dry-run-summary.json"), {
    status: jobState.finalStatus,
    currentStage: jobState.currentStage,
    checkpointResume: true,
    checkpointId: checkpoint.manifest.checkpointId,
    checkpointStage: checkpoint.manifest.checkpointStage,
    articleApiCalled: false,
    semanticReviewActuallyCalled: false,
    scriptGenerationExecuted: false,
    scriptRepairAttempts: 0,
    visibleCopyRepairAttemptCount: 0,
    previewAttemptCount: jobState.previewAttemptCount ?? 0,
    mediaToolchainStatus: jobState.mediaToolchainStatus,
    ffmpegAvailable: jobState.ffmpegAvailable,
    ffprobeAvailable: jobState.ffprobeAvailable,
    frameQaStatus: jobState.frameQaStatus,
    previewQaStatus: jobState.previewQaStatus,
    previewApprovedForFinalRender: jobState.previewApprovedForFinalRender,
    finalRenderAttemptCount: jobState.finalRenderAttemptCount ?? jobState.attemptCounts.finalRender,
    finalRenderStatus: jobState.finalRenderStatus,
    outputQaStatus: jobState.outputQaStatus,
    finalFrameQaStatus: jobState.finalFrameQaStatus,
    finalDeliveryEligible: jobState.finalDeliveryEligible,
    finalDeliveryStatus: jobState.finalDeliveryStatus,
    repairRoute: jobState.repairRoute,
    blocked: jobState.finalStatus === "blocked",
    blockedReason: jobState.blockedReason,
    failureCode: jobState.failureCode,
    macShotRuntimeStatus: jobState.macShotRuntimeStatus,
    runtimePinningStatus: jobState.runtimePinningStatus,
    runtimeSelectionPlanHash: jobState.runtimeSelectionPlanHash,
    canonicalRuntimeSelectionPlanHash: jobState.canonicalRuntimeSelectionPlanHash,
    generatedRuntimeRegistryHash: jobState.generatedRuntimeRegistryHash,
    paths: {
      checkpointManifest: path.join("checkpoints", "checkpoint-manifest.json"),
      mediaToolchainPreflight: "media-toolchain-preflight.json",
      frameQaSummary: path.join("preview-qa", "frame-qa-summary.json"),
      finalRenderManifest: path.join("final-render-attempts", "final-01", "final-render-manifest.json"),
      outputQa: path.join("output-qa", "output-qa-01.json"),
      finalDeliveryManifest: path.join("final-delivery", "delivery-manifest.json"),
      jobState: "job-state.json",
    },
  });
  console.log(`checkpointId=${checkpoint.manifest.checkpointId}`);
  console.log(`checkpointStage=${checkpoint.manifest.checkpointStage}`);
  console.log(`previewAttemptCount=${jobState.previewAttemptCount ?? 0}`);
  console.log(`mediaToolchainStatus=${jobState.mediaToolchainStatus}`);
  console.log(`frameQaStatus=${jobState.frameQaStatus}`);
  console.log(`finalRenderStatus=${jobState.finalRenderStatus}`);
  console.log(`outputQaStatus=${jobState.outputQaStatus}`);
  console.log(`finalDeliveryEligible=${jobState.finalDeliveryEligible}`);
  console.log(`finalDeliveryStatus=${jobState.finalDeliveryStatus}`);
  console.log(`blocked=${jobState.finalStatus === "blocked"}`);
}

async function run() {
  const args = readArgs();
  if (!args.output || (!args.inputJsonDir && !args.resumeFromCheckpoint)) {
    throw new Error('Use: npm run article:batch -- --input-json-dir "outputs/article-api-inspect/..." --output "outputs/article-batch-jobs/..." [--stop-after SCRIPT_QA] OR --resume-from-checkpoint <checkpoint-id> --output "outputs/article-batch-jobs/..."');
  }
  if (args.stopAfter && !articleBatchQualityPolicy.stageOrder.includes(args.stopAfter)) {
    throw new Error(`Unknown --stop-after stage: ${args.stopAfter}`);
  }

  const outputDir = path.resolve(args.output);
  ensureDir(outputDir);
  [
    "input-snapshots",
    "input-integrity-attempts",
    "script-attempts",
    "visible-copy-attempts",
    "visible-copy-repair-attempts",
    "preview-attempts",
    "preview-qa",
    "preview-repair-plans",
    "qa-reports",
    "repair-plans",
    "render-attempts",
    "final-delivery",
    "semantic-review-attempts",
    "script-repair-attempts",
    "checkpoints",
  ].forEach((dir) => ensureDir(path.join(outputDir, dir)));

  if (args.resumeFromCheckpoint) {
    await runResumeFromCheckpoint({ outputDir, checkpointId: args.resumeFromCheckpoint, stopAfter: args.stopAfter });
    return;
  }

  const inputDir = path.resolve(args.inputJsonDir!);

  const attemptId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const inputRead = runInputReadingWithRecovery({ inputDir, outputDir, baseAttemptId: attemptId });
  const { bundle, brief, sourceContentHash: hash, sourceSnapshotId, inputQa, inputIntegrity, structuredData } = inputRead;
  const { article, evidence } = bundle;
  const jobId = safeJobId(article);
  const jobState = buildInitialJobState({ jobId, articleSlug: article.metadata.slug ?? article.articleId, sourceSnapshotId, sourceContentHash: hash });
  let initialMacRuntimeSnapshot: MacRuntimePinningSnapshot;
  try {
    initialMacRuntimeSnapshot = ensureMacShotRuntimeForBatch({ requiredSourceBranch: "library/mac-approved-shots" });
    applyMacRuntimeSnapshot(jobState, initialMacRuntimeSnapshot);
    jobState.stageHistory.push(stage("INPUT_READING", "passed", "Strict Mac runtime ensure completed before planner execution.", "mac-runtime-strict-ensure"));
  } catch (error) {
    jobState.currentStage = "INPUT_READING";
    jobState.finalStatus = "blocked";
    jobState.macShotRuntimeStatus = "blocked";
    jobState.runtimePinningStatus = "blocked";
    jobState.blockedReason = error instanceof Error ? error.name : "MAC_SHOT_BATCH_STRICT_ENSURE_FAILED";
    jobState.failureCode = jobState.blockedReason;
    jobState.stageHistory.push(stage("INPUT_READING", "blocked", "Strict Mac runtime ensure failed before planner execution.", "mac-runtime-strict-ensure"));
    jobState.updatedAt = nowIso();
    writeJson(path.join(outputDir, "job-state.json"), jobState);
    writeJson(path.join(outputDir, "batch-dry-run-summary.json"), {
      status: jobState.finalStatus,
      currentStage: jobState.currentStage,
      inputQaStatus: inputQa.status,
      inputIntegrityStatus: inputIntegrity.status,
      macShotRuntimeStatus: jobState.macShotRuntimeStatus,
      runtimePinningStatus: jobState.runtimePinningStatus,
      blocked: true,
      blockedReason: jobState.blockedReason,
      failureCode: jobState.failureCode,
      strictRuntimeEnsureBeforePlanner: true,
    });
    console.log(`articleBatchJobStatePath=${path.join(outputDir, "job-state.json")}`);
    console.log("blocked=true");
    console.log(`blockedReason=${jobState.blockedReason}`);
    return;
  }
  jobState.attemptCounts.inputRead = inputRead.recoveryHistory.length;
  writeJson(path.join(outputDir, "quality-policy.json"), articleBatchQualityPolicy);

  jobState.stageHistory.push(stage("INPUT_READING", "running", "Input snapshot created and validation started.", sourceSnapshotId));

  if (inputQa.status !== "passed" || inputIntegrity.status !== "passed") {
    jobState.currentStage = "INPUT_READING";
    jobState.finalStatus = "blocked";
    jobState.blockedReason = inputRead.blockedReason ?? "INPUT_READING_QA_FAILED";
    jobState.stageHistory.push(stage("INPUT_READING", "blocked", "Input Reading or Input Integrity QA failed.", sourceSnapshotId));
    jobState.repairHistory.push({
      repairRoute: inputRead.blockedReason === "SOURCE_SNAPSHOT_NOT_REPARSEABLE" ? "manual_review" : "re_read_input",
      issueIds: [...inputQa.defects, ...inputIntegrity.defects].map((item) => item.issueId),
      at: nowIso(),
      status: "blocked",
    });
    jobState.updatedAt = nowIso();
    writeJson(path.join(outputDir, "job-state.json"), jobState);
    writeJson(path.join(outputDir, "batch-dry-run-summary.json"), {
      status: jobState.finalStatus,
      currentStage: jobState.currentStage,
      inputQaStatus: inputQa.status,
      inputIntegrityStatus: inputIntegrity.status,
      inputReadAttempts: inputRead.recoveryHistory.length,
      reparseTriggered: inputRead.reparseTriggered,
      blocked: true,
      blockedReason: jobState.blockedReason,
      repairRoute: jobState.repairHistory[jobState.repairHistory.length - 1]?.repairRoute,
      evidenceCount: inputQa.evidenceCount,
      paths: {
        jobState: path.join(outputDir, "job-state.json"),
        inputRecoveryHistory: path.join(outputDir, "input-recovery-history.json"),
        inputIntegrityReport: path.join(outputDir, "input-integrity-attempts", "input-integrity-report.json"),
        inputReadingQaSummary: path.join(outputDir, "qa-reports", "input-reading-qa-summary.json"),
      },
    });
    console.log(`articleBatchJobStatePath=${path.join(outputDir, "job-state.json")}`);
    console.log(`inputQaStatus=${inputQa.status}`);
    console.log(`inputIntegrityStatus=${inputIntegrity.status}`);
    console.log(`inputReadAttempts=${inputRead.recoveryHistory.length}`);
    console.log(`reparseTriggered=${inputRead.reparseTriggered}`);
    console.log(`blocked=true`);
    return;
  }

  jobState.stageHistory.push(stage("INPUT_READING", "passed", "Input Reading and Input Integrity QA passed.", sourceSnapshotId));
  if (stopReached("INPUT_READING", args.stopAfter)) {
    jobState.finalStatus = "dry_run_stopped";
    jobState.updatedAt = nowIso();
    writeJson(path.join(outputDir, "job-state.json"), jobState);
    writeJson(path.join(outputDir, "batch-dry-run-summary.json"), {
      status: jobState.finalStatus,
      currentStage: jobState.currentStage,
      inputQaStatus: inputQa.status,
      inputIntegrityStatus: inputIntegrity.status,
      inputReadAttempts: inputRead.recoveryHistory.length,
      reparseTriggered: inputRead.reparseTriggered,
      blocked: false,
      evidenceCount: inputQa.evidenceCount,
      paths: {
        jobState: path.join(outputDir, "job-state.json"),
        inputRecoveryHistory: path.join(outputDir, "input-recovery-history.json"),
        inputIntegrityReport: path.join(outputDir, "input-integrity-attempts", "input-integrity-report.json"),
        inputReadingQaSummary: path.join(outputDir, "qa-reports", "input-reading-qa-summary.json"),
      },
    });
    console.log(`articleBatchJobStatePath=${path.join(outputDir, "job-state.json")}`);
    console.log(`inputQaStatus=${inputQa.status}`);
    console.log(`inputIntegrityStatus=${inputIntegrity.status}`);
    console.log(`inputReadAttempts=${inputRead.recoveryHistory.length}`);
    console.log(`reparseTriggered=${inputRead.reparseTriggered}`);
    console.log(`blocked=false`);
    return;
  }

  jobState.currentStage = "SEMANTIC_PROVIDER_PREFLIGHT";
  jobState.stageHistory.push(stage("SEMANTIC_PROVIDER_PREFLIGHT", "running", "Checking semantic provider configuration and strict JSON reachability.", "semantic-provider-preflight"));
  const providerPreflight = await runSemanticProviderPreflight();
  writeJson(path.join(outputDir, "qa-reports", "semantic-provider-preflight.json"), providerPreflight);
  jobState.providerPreflightStatus = providerPreflight.status;
  jobState.providerId = providerPreflight.providerId;
  jobState.semanticReviewModel = providerPreflight.modelId;
  jobState.modelSource = providerPreflight.modelSource;
  jobState.sanitizedFailureCategory = providerPreflight.sanitizedFailureCategory;

  if (providerPreflight.status !== "passed") {
    jobState.finalStatus = "blocked";
    jobState.blockedReason = `SEMANTIC_PROVIDER_PREFLIGHT_${providerPreflight.status.toUpperCase()}`;
    jobState.stageHistory.push(stage("SEMANTIC_PROVIDER_PREFLIGHT", "blocked", "Semantic provider preflight failed; script generation is blocked.", "semantic-provider-preflight"));
    jobState.repairHistory.push({
      repairRoute: "provider_configuration",
      issueIds: ["SEMANTIC_PROVIDER_PREFLIGHT_FAILED"],
      at: nowIso(),
      status: "blocked",
    });
    jobState.updatedAt = nowIso();
    writeJson(path.join(outputDir, "job-state.json"), jobState);
    writeJson(path.join(outputDir, "batch-dry-run-summary.json"), {
      status: jobState.finalStatus,
      currentStage: jobState.currentStage,
      inputQaStatus: inputQa.status,
      providerPreflightStatus: providerPreflight.status,
      providerId: providerPreflight.providerId,
      semanticReviewModel: providerPreflight.modelId,
      modelSource: providerPreflight.modelSource,
      providerAvailable: false,
      semanticReviewActuallyCalled: false,
      sanitizedFailureCategory: providerPreflight.sanitizedFailureCategory,
      blocked: true,
      blockedReason: jobState.blockedReason,
      failureCode: jobState.failureCode,
      macShotRuntimeStatus: jobState.macShotRuntimeStatus,
      runtimePinningStatus: jobState.runtimePinningStatus,
      runtimeSelectionPlanHash: jobState.runtimeSelectionPlanHash,
      canonicalRuntimeSelectionPlanHash: jobState.canonicalRuntimeSelectionPlanHash,
      generatedRuntimeRegistryHash: jobState.generatedRuntimeRegistryHash,
      evidenceCount: inputQa.evidenceCount,
      tableCount: inputQa.tableCount,
      pricePercentageComparisonDataCount: inputQa.pricePercentageComparisonDataCount,
      dataDisplayPlanRequiredCount: inputQa.dataDisplayPlanRequiredCount,
      paths: {
        jobState: path.join(outputDir, "job-state.json"),
        qualityPolicy: path.join(outputDir, "quality-policy.json"),
        inputQa: path.join(outputDir, "qa-reports", `${sourceSnapshotId}-input-reading-qa.json`),
        providerPreflight: path.join(outputDir, "qa-reports", "semantic-provider-preflight.json"),
      },
    });
    console.log(`articleBatchJobStatePath=${path.join(outputDir, "job-state.json")}`);
    console.log(`articleBatchQualityPolicyPath=${path.join(outputDir, "quality-policy.json")}`);
    console.log(`articleBatchDryRunSummaryPath=${path.join(outputDir, "batch-dry-run-summary.json")}`);
    console.log(`inputQaStatus=${inputQa.status}`);
    console.log(`providerPreflightStatus=${providerPreflight.status}`);
    console.log(`providerAvailable=false`);
    console.log(`blocked=true`);
    return;
  }

  jobState.stageHistory.push(stage("SEMANTIC_PROVIDER_PREFLIGHT", "passed", "Semantic provider preflight passed.", "semantic-provider-preflight"));
  if (stopReached("SEMANTIC_PROVIDER_PREFLIGHT", args.stopAfter)) {
    jobState.finalStatus = "dry_run_stopped";
    jobState.updatedAt = nowIso();
    writeJson(path.join(outputDir, "job-state.json"), jobState);
    return;
  }

  jobState.currentStage = "SCRIPT_GENERATION";
  jobState.attemptCounts.scriptGeneration += 1;
  const scriptAttemptPrefix = `script_${attemptId}`;
  jobState.stageHistory.push(stage("SCRIPT_GENERATION", "running", "Building deterministic ArticleScriptPlan from ContentBrief and EvidenceMap.", scriptAttemptPrefix));
  const initialScriptPlan = buildArticleScriptPlan({ article, brief, structuredData, sourceSnapshotId, sourceContentHash: hash });
  jobState.stageHistory.push(stage("SCRIPT_GENERATION", "passed", "ArticleScriptPlan generated.", scriptAttemptPrefix));

  jobState.currentStage = "SCRIPT_QA";
  jobState.stageHistory.push(stage("SCRIPT_QA", "running", "Running deterministic Script QA, Semantic Review, and safe repair loop.", scriptAttemptPrefix));
  const gateResult = await runScriptGate({
    outputDir,
    attemptPrefix: scriptAttemptPrefix,
    article,
    brief,
    evidence,
    structuredData,
    inputIntegrityReport: inputIntegrity,
    initialScriptPlan,
  });
  jobState.attemptCounts.scriptQa = gateResult.scriptQaHistory.length;
  jobState.attemptCounts.scriptRepair = gateResult.repairAttemptCount;

  if (gateResult.repairAttemptCount > 0) {
    jobState.repairHistory.push({
      repairRoute: "repair_script",
      issueIds: gateResult.scriptQa.defects.map((item) => item.issueId),
      at: nowIso(),
      status: gateResult.scriptQa.status === "passed" ? "planned" : "blocked",
    });
  }
  jobState.deferredVisibleCopyDefects = gateResult.deferredVisibleCopyDefects;

  if (gateResult.passedWithDeferredVisibleCopyRepairs) {
    jobState.stageHistory.push(stage("SCRIPT_QA", "passed", "Script QA passed with deferred visible-copy repairs.", scriptAttemptPrefix));
  } else if (gateResult.scriptQa.status === "passed") {
    jobState.stageHistory.push(stage("SCRIPT_QA", "passed", "Deterministic Script QA and Semantic Review passed.", scriptAttemptPrefix));
  } else if (gateResult.scriptQa.status === "repair_required") {
    jobState.stageHistory.push(stage("SCRIPT_QA", "repairing", "Script QA has remaining repairable issues after repair loop.", scriptAttemptPrefix));
    jobState.blockedReason = "SCRIPT_REPAIR_ATTEMPTS_EXHAUSTED";
  } else {
    jobState.stageHistory.push(stage("SCRIPT_QA", "blocked", "Script QA blocked before Visible Copy / Runtime stages.", scriptAttemptPrefix));
    jobState.blockedReason = gateResult.blockedReason ?? "SCRIPT_QA_BLOCKED";
  }

  const previewOutputQaRouting = {
    integratedIntoBatchStateMachine: true,
    stages: ["PREVIEW_RENDER", "PREVIEW_QA", "FINAL_RENDER", "OUTPUT_QA", "FINAL_DELIVERY"],
    repairRouteMapping: articleBatchQualityPolicy.repairPolicy.routeByCategory,
    blockerRule: "Any PREVIEW_QA or OUTPUT_QA blocker prevents FINAL_DELIVERY.",
  };

  let visibleCopyGate: VisibleCopyGateResult | undefined;
  const scriptLayerPassed = gateResult.scriptQa.status === "passed" || gateResult.passedWithDeferredVisibleCopyRepairs;
  if (scriptLayerPassed && !stopReached("SCRIPT_QA", args.stopAfter)) {
    jobState.currentStage = "VISIBLE_COPY_AND_VISUAL_PLAN";
    jobState.stageHistory.push(stage("VISIBLE_COPY_AND_VISUAL_PLAN", "running", "Building Visible Copy / Visual Plan and running Visible Copy QA.", "visible-copy"));
    visibleCopyGate = runVisibleCopyGate({
      outputDir,
      article,
      brief,
      evidence,
      scriptPlan: gateResult.scriptPlan,
      deferredDefects: gateResult.deferredVisibleCopyDefects,
    });
    jobState.visibleCopyQaStatus = visibleCopyGate.visibleCopyQaStatus;
    jobState.visibleCopyRepairAttemptCount = visibleCopyGate.visibleCopyRepairAttemptCount;
    jobState.visibleCopyRepairHistory = visibleCopyGate.visibleCopyRepairHistory;
    jobState.visibleCopyBlockedReason = visibleCopyGate.visibleCopyBlockedReason;
    if (visibleCopyGate.visibleCopyQaStatus === "passed") {
      jobState.stageHistory.push(stage("VISIBLE_COPY_AND_VISUAL_PLAN", "passed", "Visible Copy QA passed after repair gate.", "visible-copy"));
    } else {
      jobState.stageHistory.push(stage("VISIBLE_COPY_AND_VISUAL_PLAN", "blocked", "Visible Copy QA blocked before Preview Render.", "visible-copy"));
      jobState.visibleCopyBlockedReason = visibleCopyGate.visibleCopyBlockedReason ?? "VISIBLE_COPY_QA_BLOCKED";
      jobState.blockedReason = jobState.visibleCopyBlockedReason;
      jobState.repairHistory.push({
        repairRoute: "repair_visible_copy",
        issueIds: gateResult.deferredVisibleCopyDefects.map((item) => item.issueId),
        at: nowIso(),
        status: "blocked",
      });
    }
  }

  let previewQaReport: ReturnType<typeof runPreviewQaGate> | undefined;
  let previewRepairPlan: ReturnType<typeof buildPreviewRepairPlan> | undefined;
  let mediaToolchainReport: ReturnType<typeof runMediaToolchainPreflight> | undefined;
  const previewAttemptHistory: string[] = [];
  const previewQaHistory: string[] = [];
  if (visibleCopyGate?.visibleCopyQaStatus === "passed" && !stopReached("VISIBLE_COPY_AND_VISUAL_PLAN", args.stopAfter)) {
    jobState.currentStage = "PREVIEW_RENDER";
    jobState.stageHistory.push(stage("PREVIEW_RENDER", "running", "Rendering article preview attempt.", "preview-01"));
    const previewRender = await runPreviewRenderGate({
      outputDir,
      attemptNumber: 1,
      article,
      brief,
      scriptPlan: gateResult.scriptPlan,
      sourceSnapshotId,
      scriptAttemptId: gateResult.scriptAttemptHistory[gateResult.scriptAttemptHistory.length - 1],
      visibleCopyAttemptId: visibleCopyGate.visibleCopyAttemptHistory[visibleCopyGate.visibleCopyAttemptHistory.length - 1],
    });
    previewAttemptHistory.push(path.join(outputDir, "preview-attempts", previewRender.manifest.attemptId, "preview-attempt.json"));
    jobState.attemptCounts.previewRender = previewAttemptHistory.length;
    applyMacRuntimePinning(jobState, summarizeRuntimePinning(previewRender.job.runtimeSelectionPlan, initialMacRuntimeSnapshot));

    if (previewRender.blockedReason) {
      jobState.stageHistory.push(stage("PREVIEW_RENDER", "blocked", "Preview Render preflight failed.", previewRender.manifest.attemptId));
      jobState.previewBlockedReason = previewRender.blockedReason;
      jobState.blockedReason = previewRender.blockedReason;
    } else {
      jobState.stageHistory.push(stage("PREVIEW_RENDER", "passed", "Preview Render completed.", previewRender.manifest.attemptId));
      jobState.currentStage = "MEDIA_TOOLCHAIN_PREFLIGHT";
      jobState.stageHistory.push(stage("MEDIA_TOOLCHAIN_PREFLIGHT", "running", "Checking media toolchain for Frame QA.", "media-toolchain-preflight"));
      mediaToolchainReport = runMediaToolchainPreflight();
      writeJson(path.join(outputDir, "media-toolchain-preflight.json"), mediaToolchainReport);
      jobState.mediaToolchainStatus = mediaToolchainReport.toolchainStatus;
      jobState.ffmpegAvailable = mediaToolchainReport.ffmpegAvailable;
      jobState.ffprobeAvailable = mediaToolchainReport.ffprobeAvailable;
      jobState.stageHistory.push(stage("MEDIA_TOOLCHAIN_PREFLIGHT", "passed", `Media toolchain preflight ${mediaToolchainReport.toolchainStatus}.`, "media-toolchain-preflight"));
      jobState.currentStage = "PREVIEW_QA";
      jobState.stageHistory.push(stage("PREVIEW_QA", "running", "Running static Preview QA and Frame QA availability check.", previewRender.manifest.attemptId));
      previewQaReport = runPreviewQaGate({
        outputDir,
        manifest: previewRender.manifest,
        job: previewRender.job,
        article,
        brief,
        scriptPlan: gateResult.scriptPlan,
        mediaToolchain: mediaToolchainReport,
      });
      previewQaHistory.push(previewRender.manifest.qaSummaryPath);
      previewRepairPlan = buildPreviewRepairPlan({
        defects: previewQaReport.defects,
        selectedAssetIds: previewQaReport.selectedAssetIds,
        visibleCopyAttemptId: previewRender.manifest.visibleCopyAttemptId,
        scriptAttemptId: previewRender.manifest.scriptAttemptId,
      });
      writeJson(path.join(outputDir, "preview-repair-plans", `${previewRender.manifest.attemptId}-preview-repair-plan.json`), previewRepairPlan);
      writeJson(path.join(outputDir, "preview-attempt-history.json"), previewAttemptHistory);
      writeJson(path.join(outputDir, "preview-qa-history.json"), previewQaHistory);
      jobState.previewAttemptCount = previewAttemptHistory.length;
      jobState.previewQaStatus = previewQaReport.finalPreviewStatus;
      jobState.frameQaStatus = previewQaReport.frameQa.frameQaExecuted ? (previewQaReport.frameQa.frameQaPassed ? "passed" : "failed") : "unavailable";
      jobState.frameQaFailureCategory = typeof previewQaReport.frameQa.reason === "string" ? previewQaReport.frameQa.reason : undefined;
      jobState.previewApprovedForFinalRender = previewQaReport.finalPreviewStatus === "passed" && jobState.frameQaStatus === "passed";
      jobState.finalDeliveryEligible = jobState.previewApprovedForFinalRender;
      jobState.previewRepairHistory = previewRepairPlan.repairs;
      if (previewQaReport.finalPreviewStatus === "passed" || previewQaReport.finalPreviewStatus === "passed_with_frame_qa_unavailable") {
        jobState.stageHistory.push(stage("PREVIEW_QA", "passed", `Preview QA ${previewQaReport.finalPreviewStatus}.`, previewRender.manifest.attemptId));
      } else {
        jobState.stageHistory.push(stage("PREVIEW_QA", "blocked", "Preview QA found defects before Final Render.", previewRender.manifest.attemptId));
        jobState.previewBlockedReason = "PREVIEW_QA_DEFECTS_FOUND";
        jobState.blockedReason = jobState.previewBlockedReason;
      }
      if (previewQaReport.finalPreviewStatus === "passed_with_frame_qa_unavailable") {
        jobState.previewBlockedReason = "MEDIA_TOOLCHAIN_PREFLIGHT_UNAVAILABLE";
        jobState.blockedReason = "MEDIA_TOOLCHAIN_PREFLIGHT_UNAVAILABLE";
        jobState.repairHistory.push({
          repairRoute: "toolchain_configuration",
          issueIds: [mediaToolchainReport.sanitizedFailureCategory ?? "MEDIA_TOOLCHAIN_UNAVAILABLE"],
          at: nowIso(),
          status: "blocked",
        });
      }
    }
  }

  const dryRunStoppedAtScriptQa = stopReached("SCRIPT_QA", args.stopAfter);
  const dryRunStoppedAtVisibleCopy = stopReached("VISIBLE_COPY_AND_VISUAL_PLAN", args.stopAfter);
  const dryRunStoppedAtPreviewQa = stopReached("PREVIEW_QA", args.stopAfter);
  if (!scriptLayerPassed) {
    jobState.finalStatus = "blocked";
  } else if (previewQaReport?.finalPreviewStatus === "passed_with_frame_qa_unavailable") {
    jobState.finalStatus = "blocked";
  } else if (previewQaReport?.finalPreviewStatus === "passed" && dryRunStoppedAtPreviewQa) {
    jobState.finalStatus = "dry_run_stopped";
  } else if (previewQaReport && !["passed", "passed_with_frame_qa_unavailable"].includes(previewQaReport.finalPreviewStatus)) {
    jobState.finalStatus = "blocked";
  } else if (dryRunStoppedAtScriptQa || (visibleCopyGate?.visibleCopyQaStatus === "passed" && dryRunStoppedAtVisibleCopy)) {
    jobState.finalStatus = "dry_run_stopped";
  } else if (visibleCopyGate && visibleCopyGate.visibleCopyQaStatus !== "passed") {
    jobState.finalStatus = "blocked";
  } else if (visibleCopyGate) {
    jobState.currentStage = "PREVIEW_RENDER";
    jobState.finalStatus = "running";
  } else {
    jobState.currentStage = "VISIBLE_COPY_AND_VISUAL_PLAN";
    jobState.finalStatus = "running";
  }
  jobState.updatedAt = nowIso();
  writeJson(path.join(outputDir, "job-state.json"), jobState);
  writeJson(path.join(outputDir, "batch-dry-run-summary.json"), {
    status: jobState.finalStatus,
    currentStage: jobState.currentStage,
    inputQaStatus: inputQa.status,
    inputIntegrityStatus: inputIntegrity.status,
    providerPreflightStatus: providerPreflight.status,
    providerId: providerPreflight.providerId,
    semanticReviewModel: providerPreflight.modelId,
    modelSource: providerPreflight.modelSource,
    providerAvailable: providerPreflight.status === "passed",
    scriptQaStatus: gateResult.passedWithDeferredVisibleCopyRepairs ? "passed_with_deferred_visible_copy_repairs" : gateResult.scriptQa.status,
    deferredVisibleCopyDefectCount: gateResult.deferredVisibleCopyDefects.length,
    semanticReviewStatus: gateResult.semanticReview.reviewStatus,
    semanticReviewActuallyCalled: providerPreflight.status === "passed",
    semanticProviderAvailable: gateResult.semanticProviderAvailable,
    semanticModelId: gateResult.semanticModelId,
    semanticRequestSummaryHash: gateResult.semanticRequestSummaryHash,
    blockerCount: gateResult.scriptQa.blockerCount,
    repairableCount: gateResult.scriptQa.repairableCount,
    warningCount: gateResult.scriptQa.warningCount,
    autoRepairExecuted: gateResult.autoRepairExecuted,
    scriptRepairAttempts: gateResult.repairAttemptCount,
    visibleCopyQaStatus: visibleCopyGate?.visibleCopyQaStatus,
    visibleCopyRepairAttemptCount: visibleCopyGate?.visibleCopyRepairAttemptCount ?? 0,
    visibleCopyBlockedReason: visibleCopyGate?.visibleCopyBlockedReason,
    previewQaStatus: previewQaReport?.finalPreviewStatus,
    previewAttemptCount: previewAttemptHistory.length,
    frameQaStatus: jobState.frameQaStatus,
    frameQaFailureCategory: jobState.frameQaFailureCategory,
    mediaToolchainStatus: jobState.mediaToolchainStatus,
    ffmpegAvailable: jobState.ffmpegAvailable,
    ffprobeAvailable: jobState.ffprobeAvailable,
    previewApprovedForFinalRender: jobState.previewApprovedForFinalRender,
    finalDeliveryEligible: jobState.finalDeliveryEligible,
    previewFile: previewQaReport?.previewPath,
    previewFileSizeBytes: previewQaReport?.fileSizeBytes,
    previewDurationFrames: previewQaReport?.durationFrames,
    previewFps: previewQaReport?.fps,
    previewWidth: previewQaReport?.width,
    previewHeight: previewQaReport?.height,
    selectedRuntimeShotIds: previewQaReport?.selectedRuntimeShotIds,
    previewDefectCount: previewQaReport?.defects.length ?? 0,
    previewRepairRoute: previewQaReport?.repairRoute,
    scriptAttempt: gateResult.scriptAttemptHistory.length,
    blocked: jobState.finalStatus === "blocked",
    blockedReason: jobState.blockedReason,
    evidenceCount: inputQa.evidenceCount,
    tableCount: inputQa.tableCount,
    pricePercentageComparisonDataCount: inputQa.pricePercentageComparisonDataCount,
    dataDisplayPlanRequiredCount: inputQa.dataDisplayPlanRequiredCount,
    previewOutputQaRouting,
    paths: {
      jobState: path.join(outputDir, "job-state.json"),
      qualityPolicy: path.join(outputDir, "quality-policy.json"),
      inputQa: path.join(outputDir, "qa-reports", `${sourceSnapshotId}-input-reading-qa.json`),
      providerPreflight: path.join(outputDir, "qa-reports", "semantic-provider-preflight.json"),
      latestScriptPlan: gateResult.scriptAttemptHistory[gateResult.scriptAttemptHistory.length - 1],
      latestScriptQa: gateResult.scriptQaHistory[gateResult.scriptQaHistory.length - 1],
      latestSemanticReview: path.join(outputDir, "semantic-review-attempts", `semantic-review-${String(gateResult.scriptAttemptHistory.length).padStart(2, "0")}.json`),
      latestVisibleCopyPlan: visibleCopyGate?.visibleCopyAttemptHistory[visibleCopyGate.visibleCopyAttemptHistory.length - 1],
      latestVisibleCopyQa: visibleCopyGate?.visibleCopyQaHistory[visibleCopyGate.visibleCopyQaHistory.length - 1],
      visibleCopyRepairHistory: path.join(outputDir, "visible-copy-repair-history.json"),
      latestPreviewQa: previewQaHistory[previewQaHistory.length - 1],
      mediaToolchainPreflight: path.join(outputDir, "media-toolchain-preflight.json"),
      frameQaSummary: path.join(outputDir, "preview-qa", "frame-qa-summary.json"),
      previewAttemptHistory: path.join(outputDir, "preview-attempt-history.json"),
      previewQaHistory: path.join(outputDir, "preview-qa-history.json"),
      scriptAttemptHistory: path.join(outputDir, "script-attempts", "script-attempt-history.json"),
      scriptQaHistory: path.join(outputDir, "qa-reports", "script-qa-history.json"),
    },
  });

  console.log(`articleBatchJobStatePath=${path.join(outputDir, "job-state.json")}`);
  console.log(`articleBatchQualityPolicyPath=${path.join(outputDir, "quality-policy.json")}`);
  console.log(`articleBatchDryRunSummaryPath=${path.join(outputDir, "batch-dry-run-summary.json")}`);
  console.log(`inputQaStatus=${inputQa.status}`);
  console.log(`scriptQaStatus=${gateResult.passedWithDeferredVisibleCopyRepairs ? "passed_with_deferred_visible_copy_repairs" : gateResult.scriptQa.status}`);
  console.log(`semanticReviewStatus=${gateResult.semanticReview.reviewStatus}`);
  console.log(`semanticProviderAvailable=${gateResult.semanticProviderAvailable}`);
  console.log(`blocked=${jobState.finalStatus === "blocked"}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
