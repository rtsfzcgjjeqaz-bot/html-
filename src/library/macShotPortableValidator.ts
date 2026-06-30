import crypto from "crypto";
import path from "path";
import { execFileSync } from "child_process";
import type { AssetLibraryEntry } from "./assetLibraryTypes";
import { normalizeMacShotSelectionContract } from "./macShotSelectionContractNormalizer";
import type { CanonicalMacShotSelectionContract, MacShotContractGap } from "./macShotPackageContract";

export type MacShotPackageStatus = "runtime_validated" | "rejected";

export type MacShotPackageIssue =
  | "MAC_SHOT_MANIFEST_MISSING"
  | "MAC_SHOT_MANIFEST_INVALID"
  | "MAC_SHOT_LIBRARY_ENTRY_MISSING"
  | "MAC_SHOT_SELECTION_CONTRACT_MISSING"
  | "MAC_SHOT_SELECTION_CONTRACT_INVALID"
  | "MAC_SHOT_RUNTIME_ENTRY_MISSING"
  | "MAC_SHOT_EXPORT_UNRESOLVED"
  | "MAC_SHOT_ABSOLUTE_IMPORT_FORBIDDEN"
  | "MAC_SHOT_CHOREOGRAPHY_MISSING"
  | "MAC_SHOT_REQUIRED_ASSET_MISSING"
  | "MAC_SHOT_TEXT_CAPACITY_MISSING"
  | "MAC_SHOT_FORBIDDEN_PRIVATE_PATH"
  | "MAC_SHOT_LIBRARY_ENTRY_INCOMPLETE";

export type MacShotLibraryEntryContract = CanonicalMacShotSelectionContract;

export type MacShotValidationResult = {
  shotId: string;
  packagePath: string;
  sourceBranch: string;
  sourceCommit: string;
  packageHash: string;
  libraryEntryHash?: string;
  selectionContractHash?: string;
  generatedRuntimeRegistryHash?: string;
  contractGaps?: MacShotContractGap[];
  status: MacShotPackageStatus;
  selectionAllowed: boolean;
  issues: MacShotPackageIssue[];
  requiredFiles: string[];
  libraryEntryPath?: string;
  choreographyPath?: string;
  registryEntryPath?: string;
  contract?: MacShotLibraryEntryContract;
};

const privatePathPattern = /(?:[A-Za-z]:\\|\/Users\/|\\Users\\|jewelry-video)/i;
const importPattern = /^\s*import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/gm;

function git(args: string[]) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function gitShow(ref: string, filePath: string) {
  return git(["show", `${ref}:${filePath}`]);
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function importsPortable(source: string) {
  const imports = [...source.matchAll(importPattern)].map((match) => match[1]);
  return imports.every((specifier) => specifier.startsWith(".") || specifier === "react" || specifier === "remotion");
}

function fileExists(ref: string, filePath: string) {
  try {
    git(["cat-file", "-e", `${ref}:${filePath}`]);
    return true;
  } catch {
    return false;
  }
}

export function listMacShotPackagePaths(ref = "origin/library/mac-approved-shots") {
  const files = git(["ls-tree", "-r", "--name-only", ref]).split(/\r?\n/).filter(Boolean);
  return unique(files.map((file) => file.match(/^(library\/mac-shot-library\/[^/]+)\//)?.[1]).filter((value): value is string => Boolean(value))).sort();
}

export function validateMacShotPackage(input: { ref?: string; sourceBranch?: string; packagePath: string }): MacShotValidationResult {
  const ref = input.ref ?? "origin/library/mac-approved-shots";
  const sourceBranch = input.sourceBranch ?? "library/mac-approved-shots";
  const sourceCommit = git(["rev-parse", ref]);
  const shotId = path.posix.basename(input.packagePath);
  const manifestPath = `${input.packagePath}/manifest.json`;
  const issues: MacShotPackageIssue[] = [];
  let manifest: Record<string, unknown> = {};
  let manifestSource = "";

  if (!fileExists(ref, manifestPath)) issues.push("MAC_SHOT_MANIFEST_MISSING");
  else {
    manifestSource = gitShow(ref, manifestPath);
    try {
      manifest = JSON.parse(manifestSource) as Record<string, unknown>;
    } catch {
      issues.push("MAC_SHOT_MANIFEST_INVALID");
    }
  }

  const requiredFiles = Array.isArray(manifest.requiredFiles) ? (manifest.requiredFiles as string[]).map((item) => `${input.packagePath}/${item}`) : [];
  if (requiredFiles.some((filePath) => !fileExists(ref, filePath))) issues.push("MAC_SHOT_REQUIRED_ASSET_MISSING");

  const treeFiles = git(["ls-tree", "-r", "--name-only", ref, input.packagePath]).split(/\r?\n/).filter(Boolean);
  const libraryEntryPath = treeFiles.find((file) => file.endsWith(".library-entry.ts"));
  const selectionContractPath = treeFiles.find((file) => file.endsWith("selection-contract.json"));
  const choreographyPath = treeFiles.find((file) => /runtime\/choreography\/.*\.tsx$/.test(file));
  const registryEntryPath = treeFiles.find((file) => /integration\/registry-entry\.ts$/.test(file));

  if (!libraryEntryPath) issues.push("MAC_SHOT_LIBRARY_ENTRY_MISSING");
  if (!selectionContractPath) issues.push("MAC_SHOT_SELECTION_CONTRACT_MISSING");
  if (!choreographyPath) issues.push("MAC_SHOT_CHOREOGRAPHY_MISSING");
  if (!registryEntryPath) issues.push("MAC_SHOT_RUNTIME_ENTRY_MISSING");

  const libraryEntrySource = libraryEntryPath ? gitShow(ref, libraryEntryPath) : "";
  const selectionContractSource = selectionContractPath ? gitShow(ref, selectionContractPath) : "";
  const choreographySource = choreographyPath ? gitShow(ref, choreographyPath) : "";
  const registrySource = registryEntryPath ? gitShow(ref, registryEntryPath) : "";
  const packageText = [manifestSource, libraryEntrySource, selectionContractSource, choreographySource, registrySource].join("\n");
  if (privatePathPattern.test(packageText)) issues.push("MAC_SHOT_FORBIDDEN_PRIVATE_PATH");
  if (![libraryEntrySource, choreographySource, registrySource].every(importsPortable)) issues.push("MAC_SHOT_ABSOLUTE_IMPORT_FORBIDDEN");
  if (registrySource && choreographyPath && !registrySource.includes(path.posix.basename(choreographyPath, ".tsx"))) issues.push("MAC_SHOT_EXPORT_UNRESOLVED");

  const libraryEntryHash = libraryEntrySource ? sha256(libraryEntrySource) : undefined;
  let contract: MacShotLibraryEntryContract | undefined;
  let selectionContractHash: string | undefined;
  let contractGaps: MacShotContractGap[] = [];
  if (selectionContractSource) {
    try {
      const normalization = normalizeMacShotSelectionContract({
        shotId,
        rawContract: JSON.parse(selectionContractSource),
        libraryEntryHash,
      });
      contractGaps = normalization.gaps;
      if (normalization.ok) {
        contract = normalization.contract;
        selectionContractHash = normalization.selectionContractHash;
      } else {
        issues.push("MAC_SHOT_SELECTION_CONTRACT_INVALID");
        if (normalization.missingFields.includes("textCapacityContract")) issues.push("MAC_SHOT_TEXT_CAPACITY_MISSING");
      }
    } catch {
      issues.push("MAC_SHOT_SELECTION_CONTRACT_INVALID");
    }
  }
  if (!contract?.choreographyEntry || !contract?.intents.length) issues.push("MAC_SHOT_LIBRARY_ENTRY_INCOMPLETE");
  if (!contract?.textCapacityContract) issues.push("MAC_SHOT_TEXT_CAPACITY_MISSING");

  const packageHash = sha256([manifestSource, libraryEntrySource, selectionContractSource, choreographySource, registrySource].join("\\n---\\n"));
  const selectionAllowed = issues.length === 0 && Boolean(contract?.selectionAllowed);
  return {
    shotId,
    packagePath: input.packagePath,
    sourceBranch,
    sourceCommit,
    packageHash,
    libraryEntryHash,
    selectionContractHash,
    contractGaps,
    status: selectionAllowed ? "runtime_validated" : "rejected",
    selectionAllowed,
    issues: unique(issues),
    requiredFiles,
    libraryEntryPath,
    choreographyPath,
    registryEntryPath,
    contract,
  };
}

export function macShotValidationToAssetEntry(result: MacShotValidationResult): AssetLibraryEntry {
  const contract = result.contract;
  const selectionAllowed = result.selectionAllowed && Boolean(contract);
  return {
    assetId: `mac-shot:${result.shotId}`,
    assetKind: "shot",
    availability: selectionAllowed ? "runtime_callable" : "candidate_only",
    packageStatus: selectionAllowed ? "runtime_validated" : "runtime_incompatible",
    selectionAllowed,
    validationResults: {
      sourceReadable: true,
      sourcePathExists: true,
      metadataValid: Boolean(contract),
      componentEntryResolvable: selectionAllowed,
      choreographyResolvable: selectionAllowed,
      propsContractValid: selectionAllowed,
      aspectRatioCompatible: contract?.aspectRatio === "16:9",
      chineseTextCapacityValid: selectionAllowed,
      evidenceRequirementsValid: selectionAllowed,
      dependencyResolvable: selectionAllowed,
      previewOrTestAvailable: true,
    },
    displayName: contract?.displayName ?? result.shotId,
    sourceEnvironment: "mac_source",
    sourceLibrary: "mac_approved_shots",
    sourceBranch: result.sourceBranch,
    sourcePath: result.packagePath,
    sourceShotId: result.shotId,
    runtimeShotId: selectionAllowed ? result.shotId : undefined,
    choreographyId: contract?.choreographyEntry ?? result.shotId,
    supportedVisualIntents: contract?.intents ?? [],
    allowedAspectRatios: contract?.aspectRatio ? [contract.aspectRatio] : ["unverified"],
    recommendedDurationRange: contract?.durationRangeFrames ?? { minFrames: 1, preferredFrames: 1, maxFrames: 1 },
    chineseTextRisk: selectionAllowed ? "medium" : "unverified",
    evidenceRequirements: {
      requiresTraceableEvidence: contract?.intents.includes("evidence") ?? false,
      allowedValueTypes: contract?.supportedEvidenceTypes,
      notes: [`macShotSourceCommit=${result.sourceCommit}`, `packageHash=${result.packageHash}`],
    },
    componentPropsContract: { required: [], optional: [] },
    dependencyStatus: selectionAllowed ? "verified" : "not_integrated",
    previewStatus: "not_required",
    approvedInFactory: selectionAllowed,
    suitableForArticle: selectionAllowed,
    selectionPriority: contract?.selectionPriority ?? 0,
    adaptationDifficulty: selectionAllowed ? "low" : "high",
    notDirectlyCallableReason: selectionAllowed ? undefined : result.issues.join(","),
    notes: [
      "Portable Mac advanced shot package entry.",
      `macShotSourceBranch=${result.sourceBranch}`,
      `macShotSourceCommit=${result.sourceCommit}`,
      `libraryEntryHash=${result.libraryEntryHash ?? "missing"}`,
    ],
  };
}
