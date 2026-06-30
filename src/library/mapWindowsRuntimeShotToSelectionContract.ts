import crypto from "crypto";
import { getShot } from "../../assets/index/asset-resolver";
import { getChoreographyEntry } from "../motion/choreographyRegistry";
import type { RuntimeShotCatalogEntry } from "../factory/runtimeShotCatalog";
import type { SourceEnvironment } from "./assetLibraryTypes";
import type { UnifiedShotSelectionContract } from "./shotSelectionTypes";
import { localRuntimeKey } from "./runtimeIdentity";

export const unifiedShotSelectionCatalogVersion = "unified-shot-selection-contract-v1";

function hashContract(value: Omit<UnifiedShotSelectionContract, "contractHash">) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function splitTokens(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function sourceEnvironmentFor(sourceLibrary?: string): SourceEnvironment {
  if (sourceLibrary === "mac_approved_shots") return "mac_source";
  if (sourceLibrary === "transfer_mac_motion_library_v1") return "transfer_library";
  return "windows_runtime";
}

function semanticTags(entry: RuntimeShotCatalogEntry, shot: ReturnType<typeof getShot>) {
  const choreography = getChoreographyEntry(entry.choreographyId);
  return unique([
    ...splitTokens(entry.sceneType),
    ...splitTokens(entry.visualType),
    ...entry.supportedVisualIntents.flatMap(splitTokens),
    ...(shot.motion_tags ?? []),
    ...(choreography?.visualStyle ?? []),
  ]);
}

function sceneRoles(entry: RuntimeShotCatalogEntry, shot: ReturnType<typeof getShot>) {
  const trackRoles = shot.choreography?.animationTracks?.flatMap((track) => {
    if (!track || typeof track !== "object" || !("role" in track)) return [];
    return [String((track as { role?: unknown }).role)];
  }) ?? [];
  return unique([entry.sceneType, entry.visualType, ...entry.supportedVisualIntents, ...trackRoles]);
}

function visualEnergy(entry: RuntimeShotCatalogEntry): "low" | "medium" | "high" {
  if (entry.selectionPriority >= 95) return "high";
  if (entry.selectionPriority >= 70) return "medium";
  return "low";
}

export function mapWindowsRuntimeShotToSelectionContract(input: {
  entry: RuntimeShotCatalogEntry;
  runtimeCallable: boolean;
}): UnifiedShotSelectionContract {
  const { entry, runtimeCallable } = input;
  const shot = getShot(entry.runtimeShotId);
  const choreography = getChoreographyEntry(entry.choreographyId);
  const supportedEvidenceTypes = entry.evidenceRequirements.allowedValueTypes ?? ["fact", "claim", "step", "currency", "percentage", "text"];
  const base: Omit<UnifiedShotSelectionContract, "contractHash"> = {
    assetId: `runtime:${entry.runtimeShotId}`,
    shotId: entry.runtimeShotId,
    logicalShotId: entry.runtimeShotId,
    runtimeKey: localRuntimeKey(entry.runtimeShotId),
    runtimeSourceKind: "local_runtime",
    displayName: `${entry.runtimeShotId} - ${entry.visualType}`,
    sourceEnvironment: sourceEnvironmentFor(shot.sourceLibrary),
    sourceLibrary: shot.sourceLibrary === "mac_approved_shots" ? "mac_approved_shots" : "windows_runtime_catalog",
    runtimeReadiness: runtimeCallable ? "runtime_validated" : "runtime_incompatible",
    selectionAllowed: runtimeCallable,
    intents: [...entry.supportedVisualIntents],
    excludedIntents: [],
    semanticTags: semanticTags(entry, shot),
    sceneRoles: sceneRoles(entry, shot),
    supportedEvidenceTypes,
    durationRangeFrames: { ...entry.recommendedDurationRange },
    aspectRatio: entry.allowedAspectRatios[0] ?? "16:9",
    textCapacityContract: { ...entry.textCapacity },
    selectionPriority: entry.selectionPriority,
    duplicateUsePolicy: "avoid_repeat",
    transitionCompatibility: {
      compatible: Boolean(entry.transitionProfile),
      profileId: entry.transitionProfile?.profileId,
      supportedTransitionPairs: entry.transitionProfile?.supportedTransitionPairs ?? [],
      supportsOverlap: entry.transitionProfile?.supportsOverlap ?? false,
    },
    runtimeEntry: entry.runtimeShotId,
    runtimeExport: entry.runtimeShotId,
    choreographyEntry: entry.choreographyId,
    choreographyExport: entry.choreographyId,
    requiredAssets: [...(shot.atomic_motions ?? []), ...(choreography?.atomicMotions ?? [])],
    visualEnergy: visualEnergy(entry),
    compositionType: entry.sceneType,
    motionLanguage: unique([...(shot.atomic_motions ?? []), ...(shot.motion_tags ?? []), ...(choreography?.visualStyle ?? [])]),
    provenance: {
      sourceBranch: shot.sourceBranch,
      sourcePath: `assets/shots/${entry.runtimeShotId}.json`,
      sourceShotId: shot.sourceShotId ?? entry.runtimeShotId,
    },
    selectionCatalogVersion: unifiedShotSelectionCatalogVersion,
    rejectionReason: runtimeCallable ? undefined : "Runtime package validation failed for this shot.",
  };
  return { ...base, contractHash: hashContract(base) };
}
