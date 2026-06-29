import fs from "fs";
import path from "path";
import {
  listAssetLibraryEntries,
  listCandidateAssetLibraryEntries,
  listRuntimeAssetLibraryEntries,
  listUnifiedRuntimeSelectionPool,
} from "./assetLibraryCatalog";
import { validateAssetLibrary } from "./validateAssetLibrary";
import type { RuntimeVisualIntent } from "../factory/runtimeShotCatalog";
import type { AssetLibraryEntry, VisualIntentCoverage } from "./assetLibraryTypes";

const outputDir = path.resolve("outputs/asset-library-inspect");
const visualIntents: RuntimeVisualIntent[] = [
  "hook",
  "reason",
  "step_flow",
  "checklist",
  "recommendation",
  "price_comparison",
  "result_metric",
  "evidence",
  "cta",
  "safe_end",
  "brief_summary",
];

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(fileName: string, value: unknown) {
  ensureDir(outputDir);
  fs.writeFileSync(path.join(outputDir, fileName), JSON.stringify(value, null, 2));
}

function failedTechnicalItems(entry: AssetLibraryEntry) {
  return Object.entries(entry.validationResults)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
}

function buildCoverage(): VisualIntentCoverage[] {
  const entries = listAssetLibraryEntries();
  return visualIntents.map((visualIntent) => {
    const matchingEntries = entries.filter((entry) => entry.supportedVisualIntents.includes(visualIntent));
    const selectableAssets = matchingEntries
      .filter((entry) => entry.selectionAllowed && entry.packageStatus === "runtime_validated")
      .sort((a, b) => b.selectionPriority - a.selectionPriority)
      .map((entry) => ({
        assetId: entry.assetId,
        sourceEnvironment: entry.sourceEnvironment,
        selectionPriority: entry.selectionPriority,
        allowedAspectRatios: entry.allowedAspectRatios,
        chineseTextRisk: entry.chineseTextRisk,
        evidenceRequirements: entry.evidenceRequirements,
      }));
    const rejectedAssets = matchingEntries
      .filter((entry) => !entry.selectionAllowed || entry.packageStatus !== "runtime_validated")
      .map((entry) => ({
        assetId: entry.assetId,
        sourceEnvironment: entry.sourceEnvironment,
        packageStatus: entry.packageStatus,
        failedTechnicalItems: failedTechnicalItems(entry),
        reason: entry.notDirectlyCallableReason ?? "Package is not runtime validated.",
      }));
    return {
      visualIntent,
      selectableAssets,
      rejectedAssets,
      hasRuntimeValidatedCoverage: selectableAssets.length > 0,
      hasCandidateCoverage: rejectedAssets.length > 0,
      status: selectableAssets.length > 0 ? "runtime_validated" : rejectedAssets.length > 0 ? "candidate_only" : "gap",
    };
  });
}

function recommendedCandidateIds() {
  const priorities = ["candidate:transfer_shot_28", "candidate:transfer_shot_24", "candidate:transfer_shot_31"];
  const candidates = new Set(listCandidateAssetLibraryEntries().map((entry) => entry.assetId));
  return priorities.filter((assetId) => candidates.has(assetId));
}

export function inspectAssetLibrary() {
  const entries = listAssetLibraryEntries();
  const runtimeAssets = listRuntimeAssetLibraryEntries();
  const candidateAssets = listCandidateAssetLibraryEntries();
  const unifiedRuntimeSelectionPool = listUnifiedRuntimeSelectionPool();
  const visualIntentCoverage = buildCoverage();
  const validation = validateAssetLibrary(entries);
  const capabilityGaps = visualIntentCoverage.filter((item) => !item.hasRuntimeValidatedCoverage).map((item) => item.visualIntent);
  const candidateOnlyCapabilities = visualIntentCoverage
    .filter((item) => !item.hasRuntimeValidatedCoverage && item.hasCandidateCoverage)
    .map((item) => item.visualIntent);

  const packageStatusCounts = entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.packageStatus] = (counts[entry.packageStatus] ?? 0) + 1;
    return counts;
  }, {});

  const summary = {
    status: validation.status,
    runtimeValidatedSelectionAllowedCount: unifiedRuntimeSelectionPool.length,
    runtimeCallableShotCount: runtimeAssets.length,
    needsAdaptationCandidateCount: candidateAssets.filter((entry) => entry.availability === "needs_adaptation").length,
    packageStatusCounts,
    runtimeCoveredVisualIntents: visualIntentCoverage.filter((item) => item.hasRuntimeValidatedCoverage).map((item) => item.visualIntent),
    candidateOnlyCapabilities,
    capabilityGaps,
    recommendedFutureCandidates: recommendedCandidateIds(),
    selectionRule:
      "selectionAllowed is derived from packageStatus === runtime_validated plus source-neutral package validation results, not from sourceEnvironment.",
  };

  writeJson("asset-library-summary.json", summary);
  writeJson("runtime-shot-inventory.json", runtimeAssets);
  writeJson("candidate-shot-inventory.json", candidateAssets);
  writeJson("unified-runtime-selection-pool.json", unifiedRuntimeSelectionPool);
  writeJson("visual-intent-coverage.json", visualIntentCoverage);
  writeJson("asset-library-validation.json", validation);

  console.log(`assetLibrarySummaryPath=${path.join(outputDir, "asset-library-summary.json")}`);
  console.log(`runtimeValidatedSelectionAllowedCount=${summary.runtimeValidatedSelectionAllowedCount}`);
  console.log(`runtimeValidationPendingCount=${summary.packageStatusCounts.runtime_validation_pending ?? 0}`);
  console.log(`assetLibraryValidationStatus=${validation.status}`);
}

void Promise.resolve()
  .then(() => inspectAssetLibrary())
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });