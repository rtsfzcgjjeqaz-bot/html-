import crypto from "crypto";
import type { MacShotValidationResult } from "./macShotPortableValidator";
import type { UnifiedShotSelectionContract } from "./shotSelectionTypes";
import { unifiedShotSelectionCatalogVersion } from "./mapWindowsRuntimeShotToSelectionContract";
import { macRuntimeKey } from "./runtimeIdentity";

function hashContract(value: Omit<UnifiedShotSelectionContract, "contractHash">) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function mapMacShotToSelectionContract(result: MacShotValidationResult): UnifiedShotSelectionContract | undefined {
  const contract = result.contract;
  if (!result.selectionAllowed || result.status !== "runtime_validated" || !contract) return undefined;
  const base: Omit<UnifiedShotSelectionContract, "contractHash"> = {
    assetId: `mac-shot:${result.shotId}`,
    shotId: contract.shotId,
    logicalShotId: contract.shotId,
    runtimeKey: macRuntimeKey(result.sourceCommit, contract.shotId),
    runtimeSourceKind: "mac_package_runtime",
    displayName: contract.displayName,
    sourceEnvironment: "mac_source",
    sourceLibrary: "mac_approved_shots",
    runtimeReadiness: "runtime_validated",
    selectionAllowed: true,
    intents: [...contract.intents],
    excludedIntents: [...contract.excludedIntents],
    semanticTags: [...contract.semanticTags],
    sceneRoles: [...contract.sceneRoles],
    supportedEvidenceTypes: [...contract.supportedEvidenceTypes],
    durationRangeFrames: { ...contract.durationRangeFrames },
    aspectRatio: contract.aspectRatio,
    textCapacityContract: { ...contract.textCapacityContract },
    selectionPriority: contract.selectionPriority,
    duplicateUsePolicy: contract.duplicateUsePolicy,
    transitionCompatibility: { compatible: true, supportedTransitionPairs: [], supportsOverlap: false },
    runtimeEntry: contract.runtimeEntry,
    runtimeExport: contract.runtimeExport,
    choreographyEntry: contract.choreographyEntry,
    choreographyExport: contract.choreographyExport,
    requiredAssets: [...contract.requiredAssets],
    visualEnergy: contract.visualEnergy,
    compositionType: contract.sceneRoles[0] ?? contract.choreographyEntry,
    motionLanguage: [...contract.semanticTags, contract.choreographyEntry],
    provenance: {
      sourcePath: result.packagePath,
      sourceShotId: result.shotId,
      macShotSourceBranch: result.sourceBranch,
      macShotSourceCommit: result.sourceCommit,
      macShotPackageHash: result.packageHash,
      libraryEntryHash: result.libraryEntryHash,
      selectionContractHash: result.selectionContractHash,
      generatedRuntimeRegistryHash: result.generatedRuntimeRegistryHash,
    },
    selectionCatalogVersion: unifiedShotSelectionCatalogVersion,
  };
  return { ...base, contractHash: hashContract(base) };
}
