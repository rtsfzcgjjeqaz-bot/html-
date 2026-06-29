import { getShot } from "../../assets/index/asset-resolver";
import { auditRuntimeShotCatalog, listRuntimeShotCatalog } from "../factory/runtimeShotCatalog";
import { candidateShotCatalog } from "./candidateShotCatalog";
import type { AssetLibraryEntry, ChineseTextRisk, PackageValidationResults, SourceEnvironment } from "./assetLibraryTypes";

function deriveChineseTextRisk(entry: ReturnType<typeof listRuntimeShotCatalog>[number]): ChineseTextRisk {
  if (entry.textCapacity.structuredItems === "low" || entry.textCapacity.headline === "low") return "high";
  if (entry.textCapacity.supportingText === "low") return "medium";
  return "low";
}

function runtimeValidationResults(runtimeCallable: boolean): PackageValidationResults {
  return {
    sourceReadable: true,
    sourcePathExists: true,
    metadataValid: true,
    componentEntryResolvable: runtimeCallable,
    choreographyResolvable: runtimeCallable,
    propsContractValid: runtimeCallable,
    aspectRatioCompatible: runtimeCallable,
    chineseTextCapacityValid: runtimeCallable,
    evidenceRequirementsValid: runtimeCallable,
    dependencyResolvable: runtimeCallable,
    previewOrTestAvailable: runtimeCallable,
  };
}

function sourceEnvironmentFor(sourceLibrary?: string): SourceEnvironment {
  if (sourceLibrary === "mac_approved_shots") return "mac_source";
  if (sourceLibrary === "transfer_mac_motion_library_v1") return "transfer_library";
  return "windows_runtime";
}

function sourcePathFor(runtimeShotId: string, sourceShotId?: string, sourceLibrary?: string) {
  if (sourceLibrary === "mac_approved_shots" && sourceShotId === "mac_shot_35") return "library/mac-shot-library/shot_35";
  if (sourceLibrary === "mac_approved_shots" && sourceShotId === "mac_shot_36") return "library/mac-shot-library/shot_36";
  return `assets/shots/${runtimeShotId}.json`;
}

export function listRuntimeAssetLibraryEntries(): AssetLibraryEntry[] {
  const auditByShotId = new Map(auditRuntimeShotCatalog().map((entry) => [entry.runtimeShotId, entry]));
  return listRuntimeShotCatalog().map((entry) => {
    const audit = auditByShotId.get(entry.runtimeShotId);
    const runtimeCallable = Boolean(audit?.runtimeCallable);
    const shot = getShot(entry.runtimeShotId);
    return {
      assetId: `runtime:${entry.runtimeShotId}`,
      assetKind: "shot",
      availability: "runtime_callable",
      packageStatus: runtimeCallable ? "runtime_validated" : "runtime_incompatible",
      selectionAllowed: runtimeCallable,
      validationResults: runtimeValidationResults(runtimeCallable),
      displayName: `${entry.runtimeShotId} - ${entry.visualType}`,
      sourceEnvironment: sourceEnvironmentFor(shot.sourceLibrary),
      sourceLibrary: shot.sourceLibrary === "mac_approved_shots" ? "mac_approved_shots" : "windows_runtime_catalog",
      sourceBranch: shot.sourceBranch ?? "feat/runtime-catalog-mac-shot-adapter",
      sourcePath: sourcePathFor(entry.runtimeShotId, shot.sourceShotId, shot.sourceLibrary),
      sourceShotId: shot.sourceShotId ?? entry.runtimeShotId,
      runtimeShotId: entry.runtimeShotId,
      choreographyId: entry.choreographyId,
      supportedVisualIntents: [...entry.supportedVisualIntents],
      allowedAspectRatios: [...entry.allowedAspectRatios],
      recommendedDurationRange: { ...entry.recommendedDurationRange },
      chineseTextRisk: deriveChineseTextRisk(entry),
      evidenceRequirements: {
        requiresTraceableEvidence: entry.evidenceRequirements.requiresTraceableEvidence,
        allowedValueTypes: entry.evidenceRequirements.allowedValueTypes
          ? [...entry.evidenceRequirements.allowedValueTypes]
          : undefined,
        minimumEvidenceCount: entry.evidenceRequirements.minimumEvidenceCount,
        notes: [...entry.evidenceRequirements.notes],
      },
      componentPropsContract: {
        required: [...entry.componentPropsContract.required],
        optional: [...entry.componentPropsContract.optional],
      },
      dependencyStatus: runtimeCallable ? "verified" : "missing",
      previewStatus: runtimeCallable ? "passed" : "pending",
      approvedInFactory: entry.approvedInFactory,
      suitableForArticle: true,
      selectionPriority: entry.selectionPriority,
      notDirectlyCallableReason: runtimeCallable ? undefined : "Runtime package validation failed for this shot.",
      notes: [
        ...entry.notes,
        "Aggregated from src/factory/runtimeShotCatalog.ts; this entry is not a second runtime registry.",
      ],
    };
  });
}

export function listCandidateAssetLibraryEntries(): AssetLibraryEntry[] {
  return candidateShotCatalog.filter((entry) => entry.sourceShotId !== "mac_shot_35" && entry.sourceShotId !== "mac_shot_36").map((entry) => ({
    ...entry,
    supportedVisualIntents: [...entry.supportedVisualIntents],
    allowedAspectRatios: [...entry.allowedAspectRatios],
    recommendedDurationRange: { ...entry.recommendedDurationRange },
    validationResults: { ...entry.validationResults },
    evidenceRequirements: {
      ...entry.evidenceRequirements,
      allowedValueTypes: entry.evidenceRequirements.allowedValueTypes
        ? [...entry.evidenceRequirements.allowedValueTypes]
        : undefined,
      notes: [...entry.evidenceRequirements.notes],
    },
    componentPropsContract: {
      required: [...entry.componentPropsContract.required],
      optional: [...entry.componentPropsContract.optional],
    },
    notes: [...entry.notes],
  }));
}

export function listAssetLibraryEntries(): AssetLibraryEntry[] {
  return [...listRuntimeAssetLibraryEntries(), ...listCandidateAssetLibraryEntries()];
}

export function listUnifiedRuntimeSelectionPool(): AssetLibraryEntry[] {
  return listAssetLibraryEntries()
    .filter((entry) => entry.packageStatus === "runtime_validated" && entry.selectionAllowed)
    .sort((a, b) => b.selectionPriority - a.selectionPriority);
}