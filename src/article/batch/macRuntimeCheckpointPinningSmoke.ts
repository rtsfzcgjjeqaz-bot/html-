import { buildArticleRuntimeSelectionPlan } from "../articleRuntimeAdapter";
import type { ArticleContentBrief, ArticleVideoSpec } from "../types";
import type { ArticlePolicyPlan } from "../articleVisualPolicy";
import type { ShotSelectionDecision, ShotSelectionPlan } from "../../library/shotSelectionTypes";
import {
  assertCheckpointRuntimePinningComplete,
  computeRuntimeSelectionPlanHash,
  macShotBatchPinningIncompleteCode,
  macShotCheckpointRuntimeIdentityMismatchCode,
  macShotPinnedRuntimeUnavailableCode,
  validatePinnedRuntimeSelectionPlan,
  type MacRuntimePinningSnapshot,
} from "./macRuntimeCheckpointPinning";

function decision(input: Partial<ShotSelectionDecision>): ShotSelectionDecision {
  return {
    sceneId: 1,
    visualIntent: "recommendation",
    sceneRole: "product_demo",
    semanticKeywords: ["recommendation"],
    evidenceTypes: ["text"],
    candidateShotIds: [],
    candidateRuntimeKeys: [],
    hardFilteredOutShotIds: [],
    hardFilteredOutRuntimeKeys: [],
    topRankedShotIds: [],
    topRankedRuntimeKeys: [],
    selectionStatus: "selected",
    sceneRequiredness: "required",
    selectedShotId: "shot_51",
    logicalShotId: "shot_51",
    selectedRuntimeKey: "local:shot_51",
    runtimeSourceKind: "local_runtime",
    selectedAssetId: "runtime:shot_51",
    selectedChoreographyId: "aiRecommendationCursorPanelReveal",
    matchedTags: [],
    fallbackUsed: false,
    fallbackType: "none",
    selectionCatalogVersion: "smoke-selection-v1",
    selectionContractHash: "local-contract",
    ...input,
  } as ShotSelectionDecision;
}

function plan(decisions: ShotSelectionDecision[]): ShotSelectionPlan {
  const candidate: ShotSelectionPlan = {
    runtimeSelectionPlanHash: "",
    selectionCatalogVersion: "smoke-selection-v1",
    selectorCallCount: 1,
    decisions,
    debug: { sourceEnvironmentNeutral: true, rejectedMacShotIdsExcluded: [], referenceShotIdsExcluded: [] },
  };
  return { ...candidate, runtimeSelectionPlanHash: computeRuntimeSelectionPlanHash(candidate) };
}

const commitA = "6a33711e7b80d8ae4573b7abcead7e7db7897608";
const commitB = "1111111111111111111111111111111111111111";
const macRuntimeKey = `mac:${commitA}:shot_46`;
const secondMacRuntimeKey = `mac:${commitA}:shot_47`;

function macPlan(overrides: Partial<ShotSelectionDecision> = {}) {
  return plan([decision({
    selectedShotId: "shot_46",
    logicalShotId: "shot_46",
    selectedRuntimeKey: macRuntimeKey,
    runtimeSourceKind: "mac_package_runtime",
    selectedAssetId: "mac:shot_46",
    selectedChoreographyId: "runtime/choreography/darkProductEngineCover.tsx",
    macShotSourceBranch: "library/mac-approved-shots",
    macShotSourceCommit: commitA,
    macShotPackageHash: "package-a",
    libraryEntryHash: "library-a",
    selectionContractHash: "contract-a",
    generatedRuntimeRegistryHash: "registry-a",
    ...overrides,
  })]);
}

function snapshot(overrides: Partial<MacRuntimePinningSnapshot> = {}): MacRuntimePinningSnapshot {
  return {
    macShotRuntimeStatus: "strict_ready",
    macShotSourceBranch: "library/mac-approved-shots",
    macShotSourceCommit: commitA,
    macShotRuntimeCatalogVersion: "mac-advanced-shot-package-v1",
    generatedRuntimeRegistryHash: "registry-a",
    macShotPackagesDiscovered: 1,
    macShotPackagesValidated: 1,
    macShotPackagesRejected: 0,
    packageIdentities: [{
      runtimeKey: macRuntimeKey,
      shotId: "shot_46",
      macShotPackageHash: "package-a",
      libraryEntryHash: "library-a",
      selectionContractHash: "contract-a",
      generatedRuntimeRegistryHash: "registry-a",
    }],
    ...overrides,
  };
}

function expectThrows(code: string, fn: () => unknown) {
  try {
    fn();
  } catch (error) {
    if (error instanceof Error && error.name === code) return true;
    throw error;
  }
  throw new Error(`Expected ${code}`);
}

function multiMacPlan(secondOverrides: Partial<ShotSelectionDecision> = {}) {
  return plan([
    macPlan().decisions[0],
    decision({
      sceneId: 2,
      selectedShotId: "shot_47",
      logicalShotId: "shot_47",
      selectedRuntimeKey: secondMacRuntimeKey,
      runtimeSourceKind: "mac_package_runtime",
      selectedAssetId: "mac:shot_47",
      selectedChoreographyId: "runtime/choreography/second.tsx",
      macShotSourceBranch: "library/mac-approved-shots",
      macShotSourceCommit: commitA,
      macShotPackageHash: "package-47",
      libraryEntryHash: "library-47",
      selectionContractHash: "contract-47",
      generatedRuntimeRegistryHash: "registry-a",
      ...secondOverrides,
    }),
  ]);
}

function multiMacSnapshot(): MacRuntimePinningSnapshot {
  const base = snapshot();
  return {
    ...base,
    macShotPackagesDiscovered: 2,
    macShotPackagesValidated: 2,
    packageIdentities: [
      ...base.packageIdentities,
      {
        runtimeKey: secondMacRuntimeKey,
        shotId: "shot_47",
        macShotPackageHash: "package-47",
        libraryEntryHash: "library-47",
        selectionContractHash: "contract-47",
        generatedRuntimeRegistryHash: "registry-a",
      },
    ],
  };
}

function simulateStrictEnsureFailure() {
  const calls = { planner: 0, provider: 0, buildArticleVideoJob: 0 };
  try {
    const error = new Error("strict ensure failed");
    error.name = "MAC_SHOT_BATCH_STRICT_ENSURE_FAILED";
    throw error;
  } catch (error) {
    return {
      terminalBlocked: true,
      failureCode: error instanceof Error ? error.name : "UNKNOWN",
      calls,
    };
  }
}

const results: Record<string, boolean> = {};

const localPlan = plan([decision({ selectedRuntimeKey: "local:shot_51", runtimeSourceKind: "local_runtime" })]);
const macShot51Plan = plan([decision({
  selectedRuntimeKey: `mac:${commitA}:shot_51`,
  runtimeSourceKind: "mac_package_runtime",
  macShotSourceBranch: "library/mac-approved-shots",
  macShotSourceCommit: commitA,
  macShotPackageHash: "package-51",
  libraryEntryHash: "library-51",
  selectionContractHash: "contract-51",
  generatedRuntimeRegistryHash: "registry-51",
})]);
results.A_runtimeKeyHashDiffers = localPlan.runtimeSelectionPlanHash !== macShot51Plan.runtimeSelectionPlanHash;

results.B_commitChangeFails = expectThrows(macShotCheckpointRuntimeIdentityMismatchCode, () => validatePinnedRuntimeSelectionPlan(macPlan(), snapshot({ macShotSourceCommit: commitB })));
for (const [key, value] of [
  ["macShotPackageHash", "package-b"],
  ["libraryEntryHash", "library-b"],
  ["selectionContractHash", "contract-b"],
  ["generatedRuntimeRegistryHash", "registry-b"],
] as const) {
  results[`C_${key}_changeFails`] = expectThrows(macShotCheckpointRuntimeIdentityMismatchCode, () => validatePinnedRuntimeSelectionPlan(macPlan({ [key]: value } as Partial<ShotSelectionDecision>), snapshot()));
}
results.D_missingPinnedRuntimeFails = expectThrows(macShotPinnedRuntimeUnavailableCode, () => validatePinnedRuntimeSelectionPlan(macPlan(), snapshot({ packageIdentities: [] })));

const strictFailure = simulateStrictEnsureFailure();
results.F_strictEnsureStopsBeforeDownstream = strictFailure.terminalBlocked && strictFailure.failureCode === "MAC_SHOT_BATCH_STRICT_ENSURE_FAILED" && strictFailure.calls.planner === 0 && strictFailure.calls.provider === 0 && strictFailure.calls.buildArticleVideoJob === 0;
results.H_allMacDecisionsValidated = expectThrows(macShotCheckpointRuntimeIdentityMismatchCode, () => validatePinnedRuntimeSelectionPlan(multiMacPlan({ libraryEntryHash: "library-47-mismatch" }), multiMacSnapshot()));

const policyPlan: ArticlePolicyPlan = {
  scenes: [{ sceneId: 1, visualIntent: "recommendation", selectedEvidenceIds: [], rejectedEvidenceIds: [], warnings: [], headline: { value: "Pinned", sourceField: "smoke", sourceExcerpt: "Pinned", compacted: false, originalCharacters: 6, finalCharacters: 6 } }],
  debug: { articleId: "pinning-smoke", policyVersion: "article-visual-policy-v2", selectedVisualIntents: ["recommendation"], rejectedVisualIntents: [], selectedEvidenceIds: [], rejectedEvidenceIds: [], evidenceDecisions: [], textShorteningActions: [], stepSelection: { canonicalOrderedSteps: [], selectedSteps: [] }, duplicatePreventionActions: [], policyWarnings: [], qaChecks: {} as never, scenes: [] },
};
const brief: ArticleContentBrief = { articleId: "pinning-smoke", title: "Pinning smoke", coreMessage: "Pinning", summary: "Pinning", keyPoints: [], evidence: [], factConstraints: [], recommendedVisualIntents: ["recommendation"], sourceMetadata: { sourceType: "text", titleSource: "fallback", summarySource: "fallback" } };
const spec: ArticleVideoSpec = { profileId: "article-landscape-preview-v1", purpose: "article preview smoke" as ArticleVideoSpec["purpose"], aspectRatio: "16:9", previewWidth: 1920, previewHeight: 1080, fps: 30, targetDurationSeconds: 12, minDurationSeconds: 10, maxDurationSeconds: 14, audioMode: "none", autoTts: false, autoBgm: false, outputMode: "preview" };
const injected = macPlan();
const runtimeSelection = buildArticleRuntimeSelectionPlan(policyPlan, brief, spec, { pinnedRuntimeSelectionPlan: injected });
results.E_pinnedPlanReused = runtimeSelection.runtimeSelectionPlan === injected && runtimeSelection.scenes[0]?.selectedRuntimeKey === macRuntimeKey;
results.G_legacyLocalOnlyAllowed = assertCheckpointRuntimePinningComplete(localPlan).legacyLocalOnly === true;
results.incompleteMacPinningFails = expectThrows(macShotBatchPinningIncompleteCode, () => assertCheckpointRuntimePinningComplete(macPlan({ macShotPackageHash: undefined })));

const failed = Object.entries(results).filter(([, passed]) => !passed).map(([key]) => key);
console.log(`macRuntimeCheckpointPinningSmokeStatus=${failed.length ? "failed" : "passed"}`);
for (const [key, passed] of Object.entries(results)) console.log(`${key}=${passed}`);
if (failed.length) {
  console.log(`failures=${failed.join(",")}`);
  process.exitCode = 1;
}
