import crypto from "crypto";
import { chatJsonStrict, getOpenAIProviderStatus } from "../../lib/openai";
import type { ArticleContentBrief, ArticleInput, EvidenceItem } from "../types";
import type { ArticleScriptPlan, StructuredDataItem } from "./articleBatchTypes";
import { articleBatchQualityPolicy } from "./articleBatchQualityPolicy";
import { normalizeSemanticReviewProviderPayload, type SemanticReviewNormalizationDiagnostics } from "./semanticReviewPayloadNormalizer";
import { type SemanticReviewResult, validateSemanticReviewResult } from "./semanticReviewSchema";

export type SemanticReviewAdapterOutput = {
  providerAvailable: boolean;
  modelId?: string;
  requestSummaryHash: string;
  result: SemanticReviewResult;
  validationErrors: string[];
  normalizationDiagnostics: SemanticReviewNormalizationDiagnostics;
};

function hash(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").toUpperCase();
}

function providerIssue(status: "provider_unavailable" | "response_invalid", modelId?: string, detail = ""): SemanticReviewResult {
  return {
    reviewStatus: status,
    reviewer: {
      providerId: "openai",
      modelId,
      reviewVersion: "article-semantic-review-v1",
    },
    issues: [
      {
        issueId: status === "provider_unavailable" ? "SEMANTIC_REVIEW_PROVIDER_UNAVAILABLE" : "SEMANTIC_REVIEW_RESPONSE_INVALID",
        severity: "BLOCKER",
        category: "NARRATIVE_LOGIC",
        sceneIds: [],
        evidenceIds: [],
        tableIds: [],
        message: status === "provider_unavailable" ? "Semantic Review Provider is not configured for this process." : "Semantic Review Provider returned an invalid response.",
        rationale: detail || "strict_production requires a schema-valid semantic review before continuing.",
        repairScope: "manual_review",
        recommendedAction: "Configure the existing OpenAI provider or perform manual review; do not proceed to video stages.",
        autoRepairEligible: false,
      },
    ],
  };
}

function emptyNormalizationDiagnostics(input?: {
  providerId?: string;
  modelId?: string;
  reviewVersion?: string;
  validationOutcome?: SemanticReviewNormalizationDiagnostics["validationOutcome"];
}): SemanticReviewNormalizationDiagnostics {
  return {
    normalizationApplied: false,
    normalizedFieldCount: 0,
    normalizedPaths: [],
    originalTypeSummary: {},
    normalizedTypeSummary: {},
    rejectedFieldPaths: [],
    validationOutcome: input?.validationOutcome ?? "not_validated",
    providerId: input?.providerId,
    modelId: input?.modelId,
    reviewVersion: input?.reviewVersion,
  };
}

function reviewPayload(input: {
  article: ArticleInput;
  brief: ArticleContentBrief;
  scriptPlan: ArticleScriptPlan;
  evidenceMap: EvidenceItem[];
  structuredDataInventory: StructuredDataItem[];
}) {
  return {
    articleType: input.scriptPlan.articleType,
    articleTitle: input.article.title,
    sourceSnapshotId: input.scriptPlan.sourceSnapshotId,
    sourceContentHash: input.scriptPlan.sourceContentHash,
    articleScriptPlan: input.scriptPlan,
    evidenceMap: input.evidenceMap.map((item) => ({
      evidenceId: item.evidenceId,
      claim: item.claim,
      sourceLocation: item.sourceLocation,
      kind: item.kind,
      valueType: item.valueType,
      videoEligible: item.videoEligible,
    })),
    structuredDataInventory: input.structuredDataInventory,
    dataDisplayPlans: input.scriptPlan.scenes.map((scene) => ({ sceneId: scene.sceneId, dataDisplayPlan: scene.dataDisplayPlan })),
    batchQualityPolicy: {
      qualityPolicyId: articleBatchQualityPolicy.qualityPolicyId,
      policyVersion: articleBatchQualityPolicy.policyVersion,
      mode: articleBatchQualityPolicy.mode,
      semanticReview: articleBatchQualityPolicy.semanticReview,
      scriptRepair: articleBatchQualityPolicy.scriptRepair,
    },
  };
}

export async function runSemanticReview(input: {
  article: ArticleInput;
  brief: ArticleContentBrief;
  scriptPlan: ArticleScriptPlan;
  evidenceMap: EvidenceItem[];
  structuredDataInventory: StructuredDataItem[];
}): Promise<SemanticReviewAdapterOutput> {
  const provider = getOpenAIProviderStatus();
  const payload = reviewPayload(input);
  const requestSummaryHash = hash({
    articleTitle: payload.articleTitle,
    sourceSnapshotId: payload.sourceSnapshotId,
    sourceContentHash: payload.sourceContentHash,
    sceneCount: payload.articleScriptPlan.scenes.length,
    evidenceCount: payload.evidenceMap.length,
    tableCount: payload.structuredDataInventory.length,
  });

  if (!provider.available) {
    return {
      providerAvailable: false,
      modelId: provider.semanticReviewModelId,
      requestSummaryHash,
      result: providerIssue("provider_unavailable", provider.semanticReviewModelId),
      validationErrors: ["SEMANTIC_REVIEW_PROVIDER_UNAVAILABLE: OPENAI_API_KEY is not available in the current process."],
      normalizationDiagnostics: emptyNormalizationDiagnostics({
        providerId: "openai",
        modelId: provider.semanticReviewModelId,
        reviewVersion: "article-semantic-review-v1",
      }),
    };
  }

  const system = [
    "You are a semantic QA reviewer for article-to-video scripts.",
    "Return strict JSON only. Do not rewrite the script. Do not invent facts, numbers, prices, ratios, or conclusions.",
    "Every issue involving facts, numbers, prices, percentages, or comparison relationships must cite existing evidenceIds.",
    "For every issue, sceneIds, evidenceIds, and tableIds must always be JSON arrays of strings, including when there is only one ID.",
    "Validate role distinction, narrative logic, generic summaries, evidence traceability, data display obligations, and incomplete copy.",
  ].join(" ");
  const user = `Review this ArticleScriptPlan against the policy. Return JSON with this exact shape: {"reviewStatus":"passed|issues_found","reviewer":{"providerId":"openai","modelId":"${provider.semanticReviewModelId}","reviewVersion":"article-semantic-review-v1"},"issues":[{"issueId":"","severity":"BLOCKER|REPAIRABLE|WARNING","category":"COPY_DUPLICATION|ROLE_REDUNDANCY|NARRATIVE_LOGIC|GENERIC_SUMMARY|DATA_DISPLAY_OMISSION|INCOMPLETE_COPY|TEXT_CAPACITY|UNSUPPORTED_CLAIM|EVIDENCE_TRACEABILITY|CONTRADICTORY_SOURCE|INPUT_INTEGRITY","sceneIds":["1"],"evidenceIds":[],"tableIds":[],"message":"","rationale":"","repairScope":"repair_script|repair_visible_copy|replan_visual|manual_review","recommendedAction":"","autoRepairEligible":false}]}. Payload: ${JSON.stringify(payload)}`;

  const response = await chatJsonStrict<SemanticReviewResult>(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    0.1,
    provider.semanticReviewModelId,
  );

  if (response.status !== "passed") {
    return {
      providerAvailable: true,
      modelId: response.modelId,
      requestSummaryHash,
      result: providerIssue("response_invalid", response.modelId, response.status === "response_invalid" ? response.errorType : "provider_unavailable"),
      validationErrors: [response.status === "response_invalid" ? response.errorType : "provider_unavailable"],
      normalizationDiagnostics: emptyNormalizationDiagnostics({
        providerId: "openai",
        modelId: response.modelId,
        reviewVersion: "article-semantic-review-v1",
      }),
    };
  }

  const normalized = normalizeSemanticReviewProviderPayload(response.value);
  const validation = validateSemanticReviewResult({
    value: normalized.value,
    scriptPlan: input.scriptPlan,
    evidenceMap: input.evidenceMap,
    structuredDataInventory: input.structuredDataInventory,
  });
  normalized.diagnostics.validationOutcome = validation.valid ? "passed" : "failed";
  normalized.diagnostics.providerId ??= "openai";
  normalized.diagnostics.modelId ??= response.modelId;
  normalized.diagnostics.reviewVersion ??= "article-semantic-review-v1";

  if (!validation.valid) {
    return {
      providerAvailable: true,
      modelId: response.modelId,
      requestSummaryHash,
      result: providerIssue("response_invalid", response.modelId, validation.errors.join("; ")),
      validationErrors: validation.errors,
      normalizationDiagnostics: normalized.diagnostics,
    };
  }

  return {
    providerAvailable: true,
    modelId: response.modelId,
    requestSummaryHash,
    result: validation.result,
    validationErrors: [],
    normalizationDiagnostics: normalized.diagnostics,
  };
}
