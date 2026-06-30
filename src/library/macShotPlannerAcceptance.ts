import fs from "fs";
import path from "path";
import { listUnifiedShotSelectionContracts } from "./assetLibraryCatalog";
import { selectShotsForScenes } from "./unifiedShotSelector";
import type { ShotSelectionSceneInput, UnifiedShotSelectionContract } from "./shotSelectionTypes";

const outDir = ".asset-sync-cache";

function sceneFromContract(contract: UnifiedShotSelectionContract, sceneId: number): ShotSelectionSceneInput {
  const intent = contract.intents[0];
  return {
    sceneId,
    visualIntent: intent,
    sceneRole: contract.sceneRoles[0] ?? intent,
    sourceEvidenceTypes: [],
    semanticKeywords: contract.semanticTags.slice(0, 8),
    requiredTextFields: [],
    targetDurationFrames: contract.durationRangeFrames.preferredFrames,
    aspectRatio: "16:9",
    sceneRequiredness: "required",
  };
}

function pickContracts(contracts: UnifiedShotSelectionContract[]) {
  const mac = contracts.filter((item) => item.runtimeSourceKind === "mac_package_runtime");
  const picks: UnifiedShotSelectionContract[] = [];
  const take = (match: (contract: UnifiedShotSelectionContract) => boolean) => {
    const found = mac.find((item) => !picks.some((picked) => picked.runtimeKey === item.runtimeKey) && match(item));
    if (found) picks.push(found);
  };
  take((item) => item.sceneRoles.concat(item.semanticTags).some((value) => /website|hero|ui/i.test(value)));
  take((item) => item.intents.some((value) => /reason|step_flow/i.test(value)) || item.sceneRoles.concat(item.semanticTags).some((value) => /workflow|step|reason/i.test(value)));
  take((item) => item.intents.includes("recommendation") || item.semanticTags.some((value) => /ai|prompt|recommend/i.test(value)));
  for (const item of mac) {
    if (picks.length >= 3) break;
    if (!picks.some((picked) => picked.runtimeKey === item.runtimeKey)) picks.push(item);
  }
  return picks.slice(0, 3);
}

const contracts = listUnifiedShotSelectionContracts();
const picks = pickContracts(contracts);
const results = picks.map((target, index) => {
  const plan = selectShotsForScenes([sceneFromContract(target, index + 1)], undefined, { contracts });
  const decision = plan.decisions[0];
  const passed = decision?.selectedRuntimeKey === target.runtimeKey && decision.runtimeSourceKind === "mac_package_runtime";
  return {
    targetMacLogicalShotId: target.logicalShotId,
    targetMacRuntimeKey: target.runtimeKey,
    selectedLogicalShotId: decision?.logicalShotId ?? decision?.selectedShotId ?? "none",
    selectedRuntimeKey: decision?.selectedRuntimeKey ?? "none",
    selectedRuntimeSourceKind: decision?.runtimeSourceKind ?? "none",
    selectedSourceEnvironment: decision?.selectedSourceEnvironment ?? "none",
    selectedMacShotSourceCommit: decision?.macShotSourceCommit ?? "none",
    candidateRuntimeKeys: decision?.candidateRuntimeKeys ?? [],
    matchedTags: decision?.matchedTags ?? [],
    scoreBreakdown: decision?.scoreBreakdown,
    duplicatePenalty: decision?.scoreBreakdown?.duplicateUsePenalty ?? 0,
    fallbackUsed: decision?.fallbackUsed ?? false,
    fallbackReason: decision?.fallbackReason ?? "none",
    passed,
  };
});

const status = results.length >= 3 && results.every((item) => item.passed) ? "passed" : "failed";
const summary = {
  status,
  failureCode: status === "passed" ? "none" : "MAC_SHOT_PLANNER_SELECTION_NOT_PROVEN",
  results,
};
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "mac-shot-planner-acceptance-summary.json"), JSON.stringify(summary, null, 2));
console.log(`macShotPlannerAcceptanceStatus=${status}`);
console.log(`failureCode=${summary.failureCode}`);
for (const item of results) {
  console.log(`targetMacLogicalShotId=${item.targetMacLogicalShotId};targetMacRuntimeKey=${item.targetMacRuntimeKey};selectedLogicalShotId=${item.selectedLogicalShotId};selectedRuntimeKey=${item.selectedRuntimeKey};selectedRuntimeSourceKind=${item.selectedRuntimeSourceKind};fallbackUsed=${item.fallbackUsed};fallbackReason=${item.fallbackReason};passed=${item.passed}`);
}
if (status !== "passed") process.exitCode = 1;
