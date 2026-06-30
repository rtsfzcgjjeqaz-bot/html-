import fs from "fs";
import path from "path";
import { fixtureScenes, selectShotsForScenes, writeShotSelectionDebug } from "./unifiedShotSelector";
import { listUnifiedShotCandidates } from "./unifiedShotSelector";
import type { ShotSelectionFixture, ShotSelectionPlan, ShotSelectionQaSummary } from "./shotSelectionTypes";

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

export function runShotSelectionQa(plan: ShotSelectionPlan): ShotSelectionQaSummary {
  const { selectable, rejected } = listUnifiedShotCandidates();
  const selectedRuntimeKeys = plan.decisions.map((decision) => decision.selectedRuntimeKey).filter((value): value is string => Boolean(value));
  const selected = selectedRuntimeKeys.map((runtimeKey) => selectable.find((candidate) => candidate.runtimeKey === runtimeKey));
  const failures: string[] = [];
  const rejectedMacAssetIds = new Set(rejected.filter((candidate) => candidate.sourceEnvironment === "mac_source").map((candidate) => candidate.assetId));
  const seen = new Set<string>();

  const checks = {
    allSelectedShotsAreRuntimeValidated: selected.every((candidate) => candidate?.runtimeReadiness === "runtime_validated"),
    allSelectedShotsSelectionAllowed: selected.every((candidate) => candidate?.selectionAllowed === true),
    allSelectedShotsMatchSceneIntent: plan.decisions.every((decision) => {
      const candidate = selectable.find((item) => item.runtimeKey === decision.selectedRuntimeKey);
      return !candidate || candidate.intents.includes(decision.visualIntent);
    }),
    noExcludedIntentSelected: plan.decisions.every((decision) => {
      const candidate = selectable.find((item) => item.runtimeKey === decision.selectedRuntimeKey);
      return !candidate || !candidate.excludedIntents.includes(decision.visualIntent);
    }),
    noRejectedMacShotSelected: plan.decisions.every((decision) => !decision.selectedAssetId || !rejectedMacAssetIds.has(decision.selectedAssetId)),
    noReferenceOnlyShotSelected: selected.every((candidate) => candidate?.sourceLibrary !== "mac_dropbox"),
    noUnauthorizedDuplicateUse: selectedRuntimeKeys.every((id) => {
      const duplicate = seen.has(id);
      seen.add(id);
      const candidate = selectable.find((item) => item.runtimeKey === id);
      return !duplicate || candidate?.duplicateUsePolicy === "allow_repeat";
    }),
    textCapacityCompatible: plan.decisions.every((decision) => !decision.selectedShotId || Boolean(decision.scoreBreakdown?.textCapacityCompatibility)),
    durationCompatible: plan.decisions.every((decision) => !decision.selectedShotId || Boolean(decision.scoreBreakdown?.durationCompatibility)),
    sourceEnvironmentNeutral: plan.debug.sourceEnvironmentNeutral,
    selectionDecisionAuditable: plan.decisions.every((decision) => Boolean(decision.candidateShotIds && decision.hardFilteredOutShotIds && decision.topRankedShotIds && (decision.selectedShotId ? decision.scoreBreakdown : true))),
    fallbackReasonPresentWhenUsed: plan.decisions.every((decision) => !decision.fallbackUsed || Boolean(decision.fallbackReason)),
    completionStatusPresent: plan.decisions.every((decision) => Boolean(decision.selectionStatus && decision.sceneRequiredness && decision.fallbackType)),
    selectedOrSafeFallbackHasShot: plan.decisions.every((decision) => (decision.selectionStatus !== "selected" && decision.selectionStatus !== "safe_fallback") || Boolean(decision.selectedShotId)),
    skippedOrBlockedHasReason: plan.decisions.every((decision) => (decision.selectionStatus !== "optional_skipped" && decision.selectionStatus !== "blocked" && decision.selectionStatus !== "safe_fallback") || Boolean(decision.fallbackReason)),
    requiredMissingShotBlocked: plan.decisions.every((decision) => decision.sceneRequiredness !== "required" || Boolean(decision.selectedShotId) || (decision.selectionStatus === "blocked" && decision.blockedCode === "REQUIRED_SCENE_NO_RUNTIME_SHOT")),
    optionalMissingShotSkipped: plan.decisions.every((decision) => decision.sceneRequiredness !== "optional" || Boolean(decision.selectedShotId) || (decision.selectionStatus === "optional_skipped" && decision.blockedCode === "OPTIONAL_SCENE_SKIPPED")),
  };

  for (const [checkId, passed] of Object.entries(checks)) {
    if (!passed) failures.push(checkId);
  }

  return { status: failures.length ? "failed" : "passed", checks, failures };
}

export function runFixtureSelectionQa(fixtures: ShotSelectionFixture[]) {
  const plans = fixtures.map((fixture) => {
    const plan = selectShotsForScenes(fixtureScenes(fixture), fixture);
    writeShotSelectionDebug(plan);
    return plan;
  });
  const summaries = plans.map(runShotSelectionQa);
  const summary = {
    status: summaries.every((item) => item.status === "passed") ? "passed" : "failed",
    fixtures: plans.map((plan, index) => ({
      fixture: plan.fixture,
      selectedShotIds: plan.decisions.map((decision) => decision.selectedShotId ?? "none"),
      qaStatus: summaries[index].status,
      failures: summaries[index].failures,
    })),
  };
  const filePath = path.join(".asset-sync-cache", "shot-selection-qa-summary.json");
  writeJson(filePath, summary);
  return { summary, filePath };
}
