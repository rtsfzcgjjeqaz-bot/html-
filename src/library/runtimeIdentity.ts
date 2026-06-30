export type RuntimeSourceKind = "local_runtime" | "mac_package_runtime";

export type RuntimeKey = `local:${string}` | `mac:${string}:${string}`;

export const runtimeLogicalShotIdAmbiguousCode = "RUNTIME_LOGICAL_SHOT_ID_AMBIGUOUS";
export const macShotPlannerRenderIdentityMismatchCode = "MAC_SHOT_PLANNER_RENDER_IDENTITY_MISMATCH";
export const macShotPinnedRuntimeUnavailableCode = "MAC_SHOT_PINNED_RUNTIME_UNAVAILABLE";

export function localRuntimeKey(logicalShotId: string): RuntimeKey {
  return `local:${logicalShotId}`;
}

export function macRuntimeKey(sourceCommit: string, logicalShotId: string): RuntimeKey {
  return `mac:${sourceCommit}:${logicalShotId}`;
}

export function logicalShotIdFromRuntimeKey(runtimeKey: string): string {
  if (runtimeKey.startsWith("local:")) return runtimeKey.slice("local:".length);
  if (runtimeKey.startsWith("mac:")) {
    const parts = runtimeKey.split(":");
    return parts.slice(2).join(":");
  }
  return runtimeKey;
}

export function runtimeSourceKindFromRuntimeKey(runtimeKey: string): RuntimeSourceKind {
  return runtimeKey.startsWith("mac:") ? "mac_package_runtime" : "local_runtime";
}

export function resolveRuntimeKeyFromLogicalId(input: {
  logicalShotId: string;
  runtimeKeys: string[];
}): string | undefined {
  const matches = input.runtimeKeys.filter((runtimeKey) => logicalShotIdFromRuntimeKey(runtimeKey) === input.logicalShotId);
  if (matches.length > 1) {
    throw new Error(`${runtimeLogicalShotIdAmbiguousCode}:${input.logicalShotId}`);
  }
  return matches[0];
}
