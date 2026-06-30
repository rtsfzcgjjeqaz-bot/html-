import type { ArticleBatchRepairRoute, ArticleBatchStage, ArticleBatchStageStatus } from "./articleBatchQualityPolicy";
import type { ArticleInput, ArticleSourceLocation, ArticleVisibleCopyScenePlan, EvidenceItem, EvidenceValueType } from "../types";
import type { VisibleCopyRepairHistoryEntry } from "./visibleCopyRepairSchema";

export type ArticleScriptClaimType = "fact" | "instruction" | "comparison" | "recommendation" | "summary";
export type ArticleScriptStatus = "draft" | "qa_passed" | "repair_required" | "blocked";
export type ScriptIssueSeverity = "BLOCKER" | "REPAIRABLE" | "WARNING";
export type ScriptRepairScope = "re_read_input" | "repair_script" | "repair_visible_copy" | "replan_visual" | "manual_review" | "rerender_output";

export type BatchDefect = {
  issueId: string;
  severity: ScriptIssueSeverity;
  category: string;
  sceneIds: number[];
  evidenceIds: string[];
  tableIds: string[];
  message: string;
  detectedBy: string;
  repairScope: ScriptRepairScope;
  recommendedAction: string;
  autoRepairEligible: boolean;
  routingGuard?: {
    originalCategory: string;
    originalSeverity: ScriptIssueSeverity;
    originalRepairScope: ScriptRepairScope;
    effectiveCategory: string;
    effectiveSeverity: ScriptIssueSeverity;
    effectiveRepairScope: ScriptRepairScope;
    routingDecision: string;
    routingEvidence: Record<string, boolean | string | number>;
  };
};

export type DataDisplayPlan = {
  displayType: "evidence_card" | "step_list" | "comparison_panel" | "not_displayed";
  evidenceIds: string[];
  tableIds: string[];
  readableScope: string;
  reasonIfNotDisplayed?: "decorative_table" | "duplicate_of_stronger_evidence" | "insufficient_readability_for_target_format" | "non_actionable_metadata";
};

export type ArticleScriptScenePlan = {
  sceneId: number;
  narrativeRole: "hook" | "step_flow" | "recommendation" | "evidence";
  visualIntent: string;
  narrativeGoal: string;
  coreClaim: string;
  claimType: ArticleScriptClaimType;
  sourceEvidenceIds: string[];
  requiredFacts: string[];
  recommendationType?: "decision" | "avoidance" | "next_step";
  copyDraft: {
    headline: string;
    shortLabel?: string;
    supportingText?: string;
    items: string[];
  };
  dataDisplayPlan?: DataDisplayPlan;
  textCapacityTarget: {
    headlineMaxChars: number;
    itemMaxChars: number;
    maxItems: number;
  };
  dependsOnSceneIds: number[];
};

export type ArticleScriptPlan = {
  articleSlug: string;
  articleType: string;
  sourceSnapshotId: string;
  sourceContentHash: string;
  narrativeTemplate: "guide_comparison_three_scene" | "article_three_scene";
  scriptStatus: ArticleScriptStatus;
  scenes: ArticleScriptScenePlan[];
};

export type StructuredDataItem = {
  tableId: string;
  kind: "html_table" | "numeric_comparison_segment" | "multi_item_numeric_list";
  headers: string[];
  rowCount: number;
  columnCount: number;
  containsNumericData: boolean;
  containsComparativeData: boolean;
  containsPriceOrPercentage: boolean;
  importanceLevel: "critical" | "supporting" | "decorative";
  sourceLocation: ArticleSourceLocation & { sectionId?: string };
  sourceEvidenceIds: string[];
  requiresDataDisplayPlan: boolean;
};

export type InputReadingQaReport = {
  status: "passed" | "rejected";
  checks: Record<string, boolean | number | string>;
  defects: BatchDefect[];
  evidenceCount: number;
  tableCount: number;
  pricePercentageComparisonDataCount: number;
  dataDisplayPlanRequiredCount: number;
};

export type ScriptQaReport = {
  status: "passed" | "blocked" | "repair_required";
  semanticReviewStatus: "not_run" | "passed" | "issues_found" | "provider_unavailable" | "response_invalid";
  checks: Record<string, boolean | number | string>;
  defects: BatchDefect[];
  blockerCount: number;
  repairableCount: number;
  warningCount: number;
};

export type ScriptRepairPlan = {
  status: "not_needed" | "planned" | "blocked_manual_review";
  repairRoute: ArticleBatchRepairRoute;
  repairs: Array<{
    repairId: string;
    issueIds: string[];
    repairScope: ScriptRepairScope;
    targetSceneIds: number[];
    preserveEvidenceIds: string[];
    preserveDataDisplayRequirements: string[];
    forbiddenChanges: string[];
    requiredOutcome: string;
    recommendedAction: string;
    maxAttempts: number;
  }>;
};

export type ArticleBatchJobState = {
  jobId: string;
  articleSlug: string;
  sourceSnapshotId: string;
  sourceContentHash: string;
  qualityPolicyId: string;
  qualityPolicyVersion: string;
  createdAt: string;
  updatedAt: string;
  currentStage: ArticleBatchStage;
  stageHistory: Array<{
    stage: ArticleBatchStage;
    status: ArticleBatchStageStatus;
    at: string;
    attemptId?: string;
    summary?: string;
  }>;
  attemptCounts: {
    inputRead: number;
    scriptGeneration: number;
    scriptQa: number;
    scriptRepair: number;
  previewRender: number;
  finalRender: number;
  };
  repairHistory: Array<{
    repairRoute: ArticleBatchRepairRoute;
    issueIds: string[];
    at: string;
    status: "planned" | "not_run" | "blocked";
  }>;
  finalStatus: "running" | "passed" | "blocked" | "rejected" | "dry_run_stopped";
  blockedReason?: string;
  failureCode?: string;
  providerPreflightStatus?: string;
  macShotSourceBranch?: string;
  macShotSourceCommit?: string;
  macShotPackagesDiscovered?: number;
  macShotPackagesValidated?: number;
  macShotPackagesRejected?: number;
  macShotRuntimeCatalogVersion?: string;
  macShotRuntimeStatus?: "strict_ready" | "blocked";
  runtimePinningStatus?: "pinned" | "legacy_local_only" | "blocked";
  generatedRuntimeRegistryHash?: string;
  runtimeSelectionPlanHash?: string;
  canonicalRuntimeSelectionPlanHash?: string;
  macShotSourceSyncStatus?: "passed" | "failed_non_blocking";
  providerId?: string;
  semanticReviewModel?: string;
  modelSource?: string;
  sanitizedFailureCategory?: string;
  deferredVisibleCopyDefects?: BatchDefect[];
  visibleCopyQaStatus?: "passed" | "repair_required" | "blocked";
  visibleCopyRepairAttemptCount?: number;
  visibleCopyRepairHistory?: VisibleCopyRepairHistoryEntry[];
  visibleCopyBlockedReason?: string;
  previewAttemptCount?: number;
  previewQaStatus?: "passed" | "passed_with_frame_qa_unavailable" | "repairable" | "blocked";
  previewRepairHistory?: unknown[];
  previewBlockedReason?: string;
  frameQaStatus?: "passed" | "unavailable" | "failed";
  frameQaFailureCategory?: string;
  mediaToolchainStatus?: "passed" | "unavailable" | "invalid";
  ffmpegAvailable?: boolean;
  ffprobeAvailable?: boolean;
  previewApprovedForFinalRender?: boolean;
  outputQaStatus?: "passed" | "blocked";
  finalFrameQaStatus?: "passed" | "unavailable" | "failed";
  finalRenderStatus?: "passed" | "blocked";
  finalRenderAttemptCount?: number;
  finalDeliveryStatus?: "delivered_local" | "blocked";
  repairRoute?: ArticleBatchRepairRoute | "not_needed";
  finalDeliveryEligible?: boolean;
};

export type ArticleBatchInputBundle = {
  article: ArticleInput;
  evidence: EvidenceItem[];
  sourceInputDir: string;
};

export type InputRecoveryHistoryEntry = {
  attemptId: string;
  sourceSnapshotId: string;
  sourceContentHash: string;
  createdAt: string;
  inputQaStatus: "passed" | "rejected";
  inputIntegrityStatus: "passed" | "rejected";
  result: "accepted" | "rejected" | "not_reparseable";
  rejectedReason?: string;
  rebuiltFromCanonicalSource: boolean;
};

export type VisibleCopyGateResult = {
  visibleCopyPlan: ArticleVisibleCopyScenePlan[];
  visibleCopyQaStatus: "passed" | "repair_required" | "blocked";
  visibleCopyRepairAttemptCount: number;
  visibleCopyRepairHistory: VisibleCopyRepairHistoryEntry[];
  visibleCopyBlockedReason?: string;
  visibleCopyAttemptHistory: string[];
  visibleCopyQaHistory: string[];
};

export const evidenceValueTypesNeedingDisplay: EvidenceValueType[] = ["currency", "percentage", "count", "duration"];
