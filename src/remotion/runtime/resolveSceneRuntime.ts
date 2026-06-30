import React from "react";
import { getChoreographyEntry } from "../../motion/choreographyRegistry";
import { generatedMacShotRuntimeRegistry } from "../../generated/macShotRuntimeRegistry";
import { logicalShotIdFromRuntimeKey, runtimeLogicalShotIdAmbiguousCode, runtimeSourceKindFromRuntimeKey } from "../../library/runtimeIdentity";

export type SceneRuntimeResolutionInput = {
  selectedRuntimeKey?: string;
  logicalShotId?: string;
  choreographyId?: string;
};

export type SceneRuntimeResolution = {
  runtimeKey: string;
  logicalShotId: string;
  runtimeSourceKind: "local_runtime" | "mac_package_runtime";
  sourceEnvironment: "windows_runtime" | "mac_source";
  component?: unknown;
  componentIdentity: string;
  choreography?: React.ComponentType;
  choreographyIdentity: string;
  registrySource: string;
};

type MacRegistryEntry = {
  shotId: string;
  logicalShotId?: string;
  runtimeKey?: string;
  runtimeSourceKind?: "mac_package_runtime";
  sourceEnvironment?: "mac_source";
  runtimeEntry: string;
  runtimeExport: string;
  choreographyEntry: string;
  choreographyExport: string;
  component?: unknown;
  choreography?: React.ComponentType;
};

const macRegistry = generatedMacShotRuntimeRegistry as Record<string, MacRegistryEntry>;

function assertMacIdentity(input: SceneRuntimeResolutionInput, entry: MacRegistryEntry, runtimeKey: string) {
  const logicalShotId = input.logicalShotId ?? logicalShotIdFromRuntimeKey(runtimeKey);
  if ((entry.runtimeKey ?? runtimeKey) !== runtimeKey || (entry.logicalShotId ?? entry.shotId) !== logicalShotId) {
    throw new Error(`MAC_SHOT_PLANNER_RENDER_IDENTITY_MISMATCH:${runtimeKey}`);
  }
  if (input.choreographyId && input.choreographyId !== entry.choreographyEntry && input.choreographyId !== entry.choreographyExport) {
    throw new Error(`MAC_SHOT_PLANNER_RENDER_IDENTITY_MISMATCH:${runtimeKey}:${input.choreographyId}`);
  }
}

export function resolveSceneRuntime(input: SceneRuntimeResolutionInput): SceneRuntimeResolution | undefined {
  if (input.selectedRuntimeKey?.startsWith("mac:")) {
    const entry = macRegistry[input.selectedRuntimeKey];
    if (!entry) throw new Error(`MAC_SHOT_PINNED_RUNTIME_UNAVAILABLE:${input.selectedRuntimeKey}`);
    assertMacIdentity(input, entry, input.selectedRuntimeKey);
    return {
      runtimeKey: input.selectedRuntimeKey,
      logicalShotId: entry.logicalShotId ?? entry.shotId,
      runtimeSourceKind: "mac_package_runtime",
      sourceEnvironment: "mac_source",
      component: entry.component,
      componentIdentity: `src/generated/mac-shot-runtime/${entry.shotId}/${entry.runtimeEntry}#${entry.runtimeExport}`,
      choreography: entry.choreography,
      choreographyIdentity: `src/generated/mac-shot-runtime/${entry.shotId}/${entry.choreographyEntry}#${entry.choreographyExport}`,
      registrySource: "src/generated/macShotRuntimeRegistry.ts",
    };
  }

  if (input.selectedRuntimeKey?.startsWith("local:")) {
    const logicalShotId = input.logicalShotId ?? logicalShotIdFromRuntimeKey(input.selectedRuntimeKey);
    if (input.logicalShotId && input.logicalShotId !== logicalShotId) {
      throw new Error(`MAC_SHOT_PLANNER_RENDER_IDENTITY_MISMATCH:${input.selectedRuntimeKey}`);
    }
    const choreography = input.choreographyId ? getChoreographyEntry(input.choreographyId) : undefined;
    return {
      runtimeKey: input.selectedRuntimeKey,
      logicalShotId,
      runtimeSourceKind: runtimeSourceKindFromRuntimeKey(input.selectedRuntimeKey),
      sourceEnvironment: "windows_runtime",
      componentIdentity: `windows-runtime:${logicalShotId}`,
      choreographyIdentity: choreography ? `src/motion/choreographyRegistry.ts#${input.choreographyId}` : "none",
      registrySource: "src/factory/runtimeShotCatalog.ts",
    };
  }

  if (input.logicalShotId) {
    const matches = Object.keys(macRegistry).filter((runtimeKey) => logicalShotIdFromRuntimeKey(runtimeKey) === input.logicalShotId);
    if (matches.length) {
      throw new Error(`${runtimeLogicalShotIdAmbiguousCode}:${input.logicalShotId}`);
    }
  }

  return undefined;
}