import crypto from "crypto";
import { execFileSync } from "child_process";
import { generatedMacShotRuntimeRegistryPath } from "../../library/macShotAutoRegistryGenerator";
import { generateMacShotRuntimeRegistry } from "../../library/macShotAutoRegistryGenerator";
import { macShotRuntimeCatalogVersion, syncMacShotSource } from "../../library/macShotSourceSync";
import { listMacShotPackagePaths, validateMacShotPackage, type MacShotValidationResult } from "../../library/macShotPortableValidator";
import { macRuntimeKey } from "../../library/runtimeIdentity";
import type { ShotSelectionPlan } from "../../library/shotSelectionTypes";

export const macShotBatchStrictEnsureFailedCode = "MAC_SHOT_BATCH_STRICT_ENSURE_FAILED";
export const macShotPinnedRuntimeUnavailableCode = "MAC_SHOT_PINNED_RUNTIME_UNAVAILABLE";
export const macShotCheckpointRuntimeIdentityMismatchCode = "MAC_SHOT_CHECKPOINT_RUNTIME_IDENTITY_MISMATCH";
export const macShotBatchPinningIncompleteCode = "MAC_SHOT_BATCH_PINNING_INCOMPLETE";

export type MacRuntimePinningSnapshot = {
  macShotRuntimeStatus: "strict_ready";
  macShotSourceBranch: string;
  macShotSourceCommit: string;
  macShotRuntimeCatalogVersion: string;
  generatedRuntimeRegistryHash: string;
  macShotPackagesDiscovered: number;
  macShotPackagesValidated: number;
  macShotPackagesRejected: number;
  packageIdentities: Array<{
    runtimeKey: string;
    shotId: string;
    macShotPackageHash?: string;
    libraryEntryHash?: string;
    selectionContractHash?: string;
    generatedRuntimeRegistryHash?: string;
  }>;
};

function hashRuntimePlanPayload(plan: Pick<ShotSelectionPlan, "fixture" | "selectionCatalogVersion" | "decisions">) {
  return crypto.createHash("sha256").update(JSON.stringify({
    fixture: plan.fixture,
    selectionCatalogVersion: plan.selectionCatalogVersion,
    decisions: plan.decisions,
  })).digest("hex");
}

function macDecisions(plan: ShotSelectionPlan) {
  return plan.decisions.filter((decision) => decision.runtimeSourceKind === "mac_package_runtime" || decision.selectedRuntimeKey?.startsWith("mac:"));
}

function hasMacRuntime(plan: ShotSelectionPlan) {
  return macDecisions(plan).length > 0;
}

function hasIncompleteMacPinning(plan: ShotSelectionPlan) {
  return macDecisions(plan).some((decision) => !decision.selectedRuntimeKey || !decision.macShotSourceCommit || !decision.macShotPackageHash || !decision.libraryEntryHash || !decision.selectionContractHash || !decision.generatedRuntimeRegistryHash);
}

function git(args: string[]) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function strictFailure(code: string, message: string, cause?: unknown) {
  const detail = cause instanceof Error ? cause.message : cause ? String(cause) : message;
  const error = new Error(`${code}:${detail}`);
  error.name = code;
  return error;
}

function snapshotFromPackages(input: {
  sourceBranch: string;
  sourceCommit: string;
  runtimeRegistry?: { generatedRuntimeRegistryHash?: string };
  packages: MacShotValidationResult[];
}): MacRuntimePinningSnapshot {
  const generatedRuntimeRegistryHash = input.runtimeRegistry?.generatedRuntimeRegistryHash;
  const validPackages = input.packages.filter((item) => item.selectionAllowed && item.contract);
  if (!generatedRuntimeRegistryHash || validPackages.length === 0) {
    throw strictFailure(macShotBatchStrictEnsureFailedCode, "Mac strict batch mode requires a non-empty generated runtime registry.");
  }
  return {
    macShotRuntimeStatus: "strict_ready",
    macShotSourceBranch: input.sourceBranch,
    macShotSourceCommit: input.sourceCommit,
    macShotRuntimeCatalogVersion: macShotRuntimeCatalogVersion,
    generatedRuntimeRegistryHash,
    macShotPackagesDiscovered: input.packages.length,
    macShotPackagesValidated: input.packages.filter((item) => item.selectionAllowed).length,
    macShotPackagesRejected: input.packages.filter((item) => !item.selectionAllowed).length,
    packageIdentities: validPackages.map((item) => ({
      runtimeKey: macRuntimeKey(input.sourceCommit, item.shotId),
      shotId: item.shotId,
      macShotPackageHash: item.packageHash,
      libraryEntryHash: item.libraryEntryHash,
      selectionContractHash: item.selectionContractHash,
      generatedRuntimeRegistryHash: item.generatedRuntimeRegistryHash ?? generatedRuntimeRegistryHash,
    })),
  };
}

export function computeRuntimeSelectionPlanHash(plan: ShotSelectionPlan) {
  return hashRuntimePlanPayload(plan);
}

export function assertRuntimeSelectionPlanHash(plan: ShotSelectionPlan) {
  const recomputed = computeRuntimeSelectionPlanHash(plan);
  if (plan.runtimeSelectionPlanHash !== recomputed) {
    throw strictFailure(macShotCheckpointRuntimeIdentityMismatchCode, "runtimeSelectionPlanHash mismatch");
  }
  return recomputed;
}

export function ensureMacShotRuntimeForBatch(input: { requiredSourceBranch?: string; requiredSourceCommit?: string } = {}): MacRuntimePinningSnapshot {
  const sourceBranch = input.requiredSourceBranch ?? "library/mac-approved-shots";
  try {
    if (input.requiredSourceCommit) {
      git(["cat-file", "-e", `${input.requiredSourceCommit}^{commit}`]);
      const ref = input.requiredSourceCommit;
      const packages = listMacShotPackagePaths(ref).map((packagePath) => validateMacShotPackage({ ref, sourceBranch, packagePath }));
      const runtimeRegistry = generateMacShotRuntimeRegistry({ ref, packages });
      return snapshotFromPackages({ sourceBranch, sourceCommit: input.requiredSourceCommit, runtimeRegistry, packages });
    }
    const report = syncMacShotSource({ branch: sourceBranch });
    return snapshotFromPackages({
      sourceBranch: report.macShotSourceBranch,
      sourceCommit: report.macShotSourceCommit,
      runtimeRegistry: report.runtimeRegistry,
      packages: report.packages,
    });
  } catch (error) {
    if (input.requiredSourceCommit) {
      throw strictFailure(macShotPinnedRuntimeUnavailableCode, `Unable to restore pinned Mac runtime ${input.requiredSourceCommit}`, error);
    }
    throw strictFailure(macShotBatchStrictEnsureFailedCode, "Strict Mac runtime ensure failed before planner execution.", error);
  }
}

export function assertCheckpointRuntimePinningComplete(plan: ShotSelectionPlan) {
  assertRuntimeSelectionPlanHash(plan);
  if (hasMacRuntime(plan) && hasIncompleteMacPinning(plan)) {
    throw strictFailure(macShotBatchPinningIncompleteCode, "Mac runtime checkpoint is missing complete provenance.");
  }
  return { hasMacRuntime: hasMacRuntime(plan), legacyLocalOnly: !hasMacRuntime(plan) };
}

export function requiredMacRuntimeSource(plan: ShotSelectionPlan) {
  const commits = [...new Set(macDecisions(plan).map((decision) => decision.macShotSourceCommit).filter((value): value is string => Boolean(value)))];
  const branches = [...new Set(macDecisions(plan).map((decision) => decision.macShotSourceBranch).filter((value): value is string => Boolean(value)))];
  if (commits.length > 1) throw strictFailure(macShotCheckpointRuntimeIdentityMismatchCode, "Multiple Mac source commits in one pinned runtime plan.");
  return { requiredSourceCommit: commits[0], requiredSourceBranch: branches[0] };
}

export function validatePinnedRuntimeSelectionPlan(plan: ShotSelectionPlan, snapshot: MacRuntimePinningSnapshot) {
  assertCheckpointRuntimePinningComplete(plan);
  const identities = new Map(snapshot.packageIdentities.map((item) => [item.runtimeKey, item]));
  for (const decision of macDecisions(plan)) {
    const runtimeKey = decision.selectedRuntimeKey;
    if (!runtimeKey) throw strictFailure(macShotBatchPinningIncompleteCode, "Mac decision missing selectedRuntimeKey.");
    const identity = identities.get(runtimeKey);
    if (!identity) throw strictFailure(macShotPinnedRuntimeUnavailableCode, runtimeKey);
    if (
      decision.macShotSourceCommit !== snapshot.macShotSourceCommit ||
      decision.generatedRuntimeRegistryHash !== snapshot.generatedRuntimeRegistryHash ||
      decision.macShotPackageHash !== identity.macShotPackageHash ||
      decision.libraryEntryHash !== identity.libraryEntryHash ||
      decision.selectionContractHash !== identity.selectionContractHash ||
      identity.generatedRuntimeRegistryHash !== snapshot.generatedRuntimeRegistryHash
    ) {
      throw strictFailure(macShotCheckpointRuntimeIdentityMismatchCode, runtimeKey);
    }
  }
  return true;
}

export function summarizeRuntimePinning(plan: ShotSelectionPlan, snapshot?: MacRuntimePinningSnapshot) {
  return {
    runtimeSelectionPlanHash: plan.runtimeSelectionPlanHash,
    canonicalRuntimeSelectionPlanHash: computeRuntimeSelectionPlanHash(plan),
    runtimePinningStatus: "pinned" as const,
    hasMacRuntime: hasMacRuntime(plan),
    macRuntimeDecisionCount: macDecisions(plan).length,
    macShotRuntimeStatus: snapshot?.macShotRuntimeStatus,
    macShotSourceBranch: snapshot?.macShotSourceBranch,
    macShotSourceCommit: snapshot?.macShotSourceCommit,
    macShotRuntimeCatalogVersion: snapshot?.macShotRuntimeCatalogVersion,
    generatedRuntimeRegistryHash: snapshot?.generatedRuntimeRegistryHash,
  };
}

export function generatedRegistryPathForDiagnostics() {
  return generatedMacShotRuntimeRegistryPath;
}
