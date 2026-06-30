import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { generateMacShotRuntimeRegistry, type MacShotRuntimeRegistryGenerationResult } from "./macShotAutoRegistryGenerator";
import { listMacShotPackagePaths, macShotValidationToAssetEntry, validateMacShotPackage, type MacShotValidationResult } from "./macShotPortableValidator";
import { mergeContractGaps } from "./macShotSelectionContractNormalizer";

export const macShotSourceCacheRoot = ".mac-shot-source-cache";
export const macShotRuntimeCatalogVersion = "mac-advanced-shot-package-v1";

export type MacShotSourceSyncReport = {
  macShotSourceBranch: string;
  macShotSourceCommit: string;
  macShotPackagesDiscovered: number;
  macShotPackagesValidated: number;
  macShotPackagesRejected: number;
  macShotRuntimeCatalogVersion: string;
  generatedRuntimeRegistryHash?: string;
  runtimeRegistry?: MacShotRuntimeRegistryGenerationResult;
  dryRun: boolean;
  packages: MacShotValidationResult[];
};

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function git(args: string[]) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

export function syncMacShotSource(input: { branch?: string; dryRun?: boolean; shot?: string } = {}): MacShotSourceSyncReport {
  const branch = input.branch ?? "library/mac-approved-shots";
  const ref = `origin/${branch}`;
  git(["fetch", "origin", branch]);
  const commit = git(["rev-parse", ref]);
  const packagePaths = listMacShotPackagePaths(ref).filter((packagePath) => !input.shot || packagePath.endsWith(`/${input.shot}`));
  const packages = packagePaths.map((packagePath) => validateMacShotPackage({ ref, sourceBranch: branch, packagePath }));
  const runtimeRegistry = input.dryRun ? undefined : generateMacShotRuntimeRegistry({ ref, packages });
  const report: MacShotSourceSyncReport = {
    macShotSourceBranch: branch,
    macShotSourceCommit: commit,
    macShotPackagesDiscovered: packages.length,
    macShotPackagesValidated: packages.filter((item) => item.selectionAllowed).length,
    macShotPackagesRejected: packages.filter((item) => !item.selectionAllowed).length,
    macShotRuntimeCatalogVersion,
    generatedRuntimeRegistryHash: runtimeRegistry?.generatedRuntimeRegistryHash,
    runtimeRegistry,
    dryRun: Boolean(input.dryRun),
    packages,
  };
  ensureDir(macShotSourceCacheRoot);
  writeJson(path.join(macShotSourceCacheRoot, "mac-shot-source-sync-report.json"), report);
  writeJson(path.join(macShotSourceCacheRoot, "mac-shot-runtime-catalog.json"), {
    version: macShotRuntimeCatalogVersion,
    sourceBranch: branch,
    sourceCommit: commit,
    entries: packages.filter((item) => item.selectionAllowed).map(macShotValidationToAssetEntry),
  });
  writeJson(path.join("reports", "local", "mac-shot-contract-gap-report.json"), {
    sourceBranch: branch,
    sourceCommit: commit,
    packagesDiscovered: packages.length,
    packagesValidated: packages.filter((item) => item.selectionAllowed).length,
    packagesRejected: packages.filter((item) => !item.selectionAllowed).length,
    gaps: mergeContractGaps(packages.flatMap((item) => item.contractGaps ?? [])),
  });
  return report;
}

export function loadMacShotSourceSyncReport() {
  const reportPath = path.join(macShotSourceCacheRoot, "mac-shot-source-sync-report.json");
  if (!fs.existsSync(reportPath)) return undefined;
  return JSON.parse(fs.readFileSync(reportPath, "utf8")) as MacShotSourceSyncReport;
}

export function listMacShotAssetLibraryEntries() {
  const report = loadMacShotSourceSyncReport();
  return report ? report.packages.map(macShotValidationToAssetEntry) : [];
}
