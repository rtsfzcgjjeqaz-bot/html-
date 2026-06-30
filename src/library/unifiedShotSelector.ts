import fs from "fs";
import path from "path";
import crypto from "crypto";
import { listAssetLibraryEntries, listUnifiedShotSelectionContracts } from "./assetLibraryCatalog";
import { durationCompatible, evidenceCompatible, matchedSemanticTags, scoreShotCandidate, textCapacityCompatible } from "./shotSelectionScorer";
import type { ShotSelectionDecision, ShotSelectionFixture, ShotSelectionPlan, ShotSelectionSceneInput, UnifiedShotSelectionContract } from "./shotSelectionTypes";

const debugDir = ".asset-sync-cache";

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

export function listUnifiedShotCandidates(contracts = listUnifiedShotSelectionContracts()) {
  const selectable = contracts.filter((contract) => contract.selectionAllowed && contract.runtimeReadiness === "runtime_validated");
  const rejected = listAssetLibraryEntries()
    .filter((entry) => entry.assetKind === "shot" && !entry.selectionAllowed)
    .map((entry) => ({
      assetId: entry.assetId,
      shotId: entry.runtimeShotId ?? entry.sourceShotId,
      sourceEnvironment: entry.sourceEnvironment,
      sourceLibrary: entry.sourceLibrary,
    }));
  return { selectable, rejected };
}

function hardFilterReason(candidate: UnifiedShotSelectionContract, scene: ShotSelectionSceneInput, alreadySelectedRuntimeKeys: string[]) {
  if (!candidate.selectionAllowed) return "selection_not_allowed";
  if (candidate.runtimeReadiness !== "runtime_validated") return "runtime_not_validated";
  if (candidate.excludedIntents.includes(scene.visualIntent)) return "excluded_intent";
  if (!candidate.intents.includes(scene.visualIntent)) return "intent_mismatch";
  if (!evidenceCompatible(candidate, scene)) return "evidence_type_mismatch";
  if (!textCapacityCompatible(candidate, scene)) return "text_capacity_mismatch";
  if (!durationCompatible(candidate, scene)) return "duration_mismatch";
  if (candidate.aspectRatio !== scene.aspectRatio) return "aspect_ratio_mismatch";
  if (!candidate.runtimeEntry || !candidate.choreographyEntry) return "runtime_or_choreography_missing";
  if (candidate.runtimeSourceKind === "local_runtime" && !candidate.requiredAssets.length) return "required_assets_missing";
  if (candidate.duplicateUsePolicy !== "allow_repeat" && alreadySelectedRuntimeKeys.includes(candidate.runtimeKey)) return "duplicate_not_allowed";
  return undefined;
}

export function selectShotsForScenes(
  scenes: ShotSelectionSceneInput[],
  fixture?: ShotSelectionFixture,
  options: { contracts?: UnifiedShotSelectionContract[]; recentShotIds?: string[] } = {},
): ShotSelectionPlan {
  const { selectable, rejected } = listUnifiedShotCandidates(options.contracts);
  const decisions: ShotSelectionDecision[] = [];
  const alreadySelectedRuntimeKeys: string[] = [];
  let previousShot: UnifiedShotSelectionContract | undefined;

  for (const scene of scenes) {
    const candidates = selectable.filter((candidate) => candidate.intents.includes(scene.visualIntent));
    const hardFiltered = selectable.filter((candidate) => hardFilterReason(candidate, scene, alreadySelectedRuntimeKeys));
    const ranked = candidates
      .filter((candidate) => !hardFilterReason(candidate, scene, alreadySelectedRuntimeKeys))
      .map((candidate) => ({
        candidate,
        score: scoreShotCandidate({ candidate, scene, alreadySelectedShotIds: alreadySelectedRuntimeKeys, recentShotIds: options.recentShotIds, previousShot }),
      }))
      .sort((a, b) => b.score.total - a.score.total || b.candidate.selectionPriority - a.candidate.selectionPriority);
    const selected = ranked[0];
    if (selected) {
      alreadySelectedRuntimeKeys.push(selected.candidate.runtimeKey);
      previousShot = selected.candidate;
    }
    const sceneRequiredness = scene.sceneRequiredness ?? "required";
    const fallbackUsed = Boolean(selected && selected.score.semanticTagMatch === 0 && scene.semanticKeywords.length);
    const selectionStatus = selected ? "selected" : sceneRequiredness === "optional" ? "optional_skipped" : "blocked";
    const blockedCode = selected ? undefined : sceneRequiredness === "optional" ? "OPTIONAL_SCENE_SKIPPED" : "REQUIRED_SCENE_NO_RUNTIME_SHOT";
    const decision: ShotSelectionDecision = {
      sceneId: scene.sceneId,
      visualIntent: scene.visualIntent,
      sceneRole: scene.sceneRole,
      semanticKeywords: [...scene.semanticKeywords],
      evidenceTypes: [...scene.sourceEvidenceTypes],
      candidateShotIds: candidates.map((candidate) => candidate.shotId),
      candidateRuntimeKeys: candidates.map((candidate) => candidate.runtimeKey),
      hardFilteredOutShotIds: hardFiltered.map((candidate) => candidate.shotId),
      hardFilteredOutRuntimeKeys: hardFiltered.map((candidate) => candidate.runtimeKey),
      topRankedShotIds: ranked.slice(0, 5).map((item) => item.candidate.shotId),
      topRankedRuntimeKeys: ranked.slice(0, 5).map((item) => item.candidate.runtimeKey),
      selectionStatus,
      sceneRequiredness,
      selectedShotId: selected?.candidate.shotId,
      logicalShotId: selected?.candidate.logicalShotId ?? selected?.candidate.shotId,
      selectedRuntimeKey: selected?.candidate.runtimeKey,
      runtimeSourceKind: selected?.candidate.runtimeSourceKind,
      selectedAssetId: selected?.candidate.assetId,
      selectedChoreographyId: selected?.candidate.choreographyEntry,
      scoreBreakdown: selected?.score,
      matchedTags: selected ? matchedSemanticTags(selected.candidate, scene) : [],
      fallbackUsed,
      fallbackType: selected ? "none" : "explicit_scene_skip",
      fallbackReason: selected ? (fallbackUsed ? "ASSET_SEMANTIC_MATCH_FALLBACK" : undefined) : blockedCode,
      blockedCode,
      selectedSourceEnvironment: selected?.candidate.sourceEnvironment,
      selectedShotScore: selected?.score.total,
      selectionContractHash: selected?.candidate.provenance.selectionContractHash ?? selected?.candidate.contractHash,
      selectionCatalogVersion: selected?.candidate.selectionCatalogVersion,
      macShotSourceBranch: selected?.candidate.provenance.macShotSourceBranch,
      macShotSourceCommit: selected?.candidate.provenance.macShotSourceCommit,
      macShotPackageHash: selected?.candidate.provenance.macShotPackageHash,
      libraryEntryHash: selected?.candidate.provenance.libraryEntryHash,
      generatedRuntimeRegistryHash: selected?.candidate.provenance.generatedRuntimeRegistryHash,
    };
    decisions.push(decision);
  }

  const selectionCatalogVersion = [...new Set(decisions.map((decision) => decision.selectionCatalogVersion).filter(Boolean))].join("|") || "unified-shot-selection-contract-v1";
  const runtimeSelectionPlanHash = crypto.createHash("sha256").update(JSON.stringify({ fixture, selectionCatalogVersion, decisions })).digest("hex");
  return {
    fixture,
    runtimeSelectionPlanHash,
    selectionCatalogVersion,
    selectorCallCount: 1,
    decisions,
    debug: {
      sourceEnvironmentNeutral: true,
      rejectedMacShotIdsExcluded: rejected.filter((candidate) => candidate.sourceEnvironment === "mac_source").map((candidate) => candidate.shotId),
      referenceShotIdsExcluded: rejected.filter((candidate) => candidate.sourceLibrary === "mac_dropbox").map((candidate) => candidate.shotId),
    },
  };
}

export function fixtureScenes(fixture: ShotSelectionFixture): ShotSelectionSceneInput[] {
  if (fixture === "ai-recommendation") {
    return [{
      sceneId: 1,
      visualIntent: "recommendation",
      sceneRole: "product_demo",
      sourceEvidenceTypes: ["fact", "text"],
      semanticKeywords: ["ai_recommendation", "prompt_composer", "code_canvas", "dark_ui", "feature_demo"],
      requiredTextFields: ["headline", "supportingText"],
      targetDurationFrames: 140,
      aspectRatio: "16:9",
    }];
  }
  if (fixture === "price-comparison") {
    return [{
      sceneId: 1,
      visualIntent: "price_comparison",
      sceneRole: "comparison",
      sourceEvidenceTypes: ["currency", "percentage"],
      semanticKeywords: ["price", "currency", "table", "dashboard", "comparison"],
      requiredTextFields: ["headline", "structuredItems"],
      targetDurationFrames: 120,
      aspectRatio: "16:9",
    }];
  }
  return [{
    sceneId: 1,
    visualIntent: "step_flow",
    sceneRole: "workflow",
    sourceEvidenceTypes: ["step", "text"],
    semanticKeywords: ["workflow", "cursor_interaction", "website_ui"],
    requiredTextFields: ["headline", "structuredItems"],
    targetDurationFrames: 120,
    aspectRatio: "16:9",
  }];
}

export function writeShotSelectionDebug(plan: ShotSelectionPlan) {
  const filePath = path.join(debugDir, "asset-selection-debug.json");
  writeJson(filePath, plan);
  return filePath;
}
