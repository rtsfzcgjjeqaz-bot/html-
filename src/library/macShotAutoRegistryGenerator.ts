import crypto from "crypto";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import type { MacShotValidationResult } from "./macShotPortableValidator";
import { macRuntimeKey } from "./runtimeIdentity";

export const generatedMacShotRuntimeRoot = path.join("src", "generated", "mac-shot-runtime");
export const generatedMacShotRuntimeRegistryPath = path.join("src", "generated", "macShotRuntimeRegistry.ts");


function git(args: string[]) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function gitBytes(ref: string, filePath: string) {
  return execFileSync("git", ["show", `${ref}:${filePath}`]);
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function emptyDir(target: string) {
  fs.rmSync(target, { recursive: true, force: true });
  ensureDir(target);
}

function posixJoin(...parts: string[]) {
  return parts.join("/").replace(/\\/g, "/").replace(/\/+/g, "/");
}

function importPathFor(filePath: string) {
  return `./${filePath.replace(/\\/g, "/").replace(/\.(tsx|ts)$/, "")}`;
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateMacShotRuntimeRegistry(input: { ref: string; packages: MacShotValidationResult[] }) {
  const validPackages = input.packages.filter((item) => item.selectionAllowed && item.contract);
  emptyDir(generatedMacShotRuntimeRoot);

  const copiedFiles: string[] = [];
  for (const item of validPackages) {
    const files = git(["ls-tree", "-r", "--name-only", input.ref, item.packagePath]).split(/\r?\n/).filter(Boolean);
    for (const file of files) {
      const relative = file.slice(`${item.packagePath}/`.length);
      if (!relative.startsWith("runtime/") && !relative.startsWith("integration/")) continue;
      const target = path.join(generatedMacShotRuntimeRoot, item.shotId, relative);
      ensureDir(path.dirname(target));
      fs.writeFileSync(target, gitBytes(input.ref, file));
      copiedFiles.push(posixJoin(item.shotId, relative));
    }
  }

  const seed = hash(JSON.stringify(validPackages.map((item) => ({ shotId: item.shotId, packageHash: item.packageHash, libraryEntryHash: item.libraryEntryHash, selectionContractHash: item.selectionContractHash, copiedFiles: copiedFiles.filter((file) => file.startsWith(`${item.shotId}/`)) }))));
  for (const item of validPackages) {
    item.generatedRuntimeRegistryHash = seed;
  }

  const imports: string[] = [];
  const entries: string[] = [];
  validPackages.forEach((item, index) => {
    const contract = item.contract!;
    const runtimeKey = macRuntimeKey(item.sourceCommit, item.shotId);
    const runtimeVar = `runtimeEntry${index}`;
    const choreographyVar = `choreography${index}`;
    imports.push(`import { ${contract.runtimeExport} as ${runtimeVar} } from "${importPathFor(path.posix.join("mac-shot-runtime", item.shotId, contract.runtimeEntry))}";`);
    imports.push(`import { ${contract.choreographyExport} as ${choreographyVar} } from "${importPathFor(path.posix.join("mac-shot-runtime", item.shotId, contract.choreographyEntry))}";`);
    entries.push(`  ${JSON.stringify(runtimeKey)}: {\n    shotId: ${JSON.stringify(item.shotId)},\n    logicalShotId: ${JSON.stringify(item.shotId)},\n    runtimeKey: ${JSON.stringify(runtimeKey)},\n    runtimeSourceKind: "mac_package_runtime",\n    sourceEnvironment: "mac_source",\n    runtimeEntry: ${JSON.stringify(contract.runtimeEntry)},\n    runtimeExport: ${JSON.stringify(contract.runtimeExport)},\n    choreographyEntry: ${JSON.stringify(contract.choreographyEntry)},\n    choreographyExport: ${JSON.stringify(contract.choreographyExport)},\n    packageHash: ${JSON.stringify(item.packageHash)},\n    libraryEntryHash: ${JSON.stringify(item.libraryEntryHash)},\n    selectionContractHash: ${JSON.stringify(item.selectionContractHash)},\n    generatedRuntimeRegistryHash: ${JSON.stringify(seed)},\n    component: ${runtimeVar},\n    choreography: ${choreographyVar},\n  }`);
  });

  ensureDir(path.dirname(generatedMacShotRuntimeRegistryPath));
  const registrySource = `${imports.join("\n")}\n\nexport const generatedMacShotRuntimeRegistryHash = ${JSON.stringify(seed)};\n\nexport const generatedMacShotRuntimeRegistry = {\n${entries.join(",\n")}\n} as const;\n\nexport type GeneratedMacShotRuntimeRegistryEntry = (typeof generatedMacShotRuntimeRegistry)[keyof typeof generatedMacShotRuntimeRegistry];\n`;
  fs.writeFileSync(generatedMacShotRuntimeRegistryPath, registrySource);

  return {
    generatedRuntimeRegistryHash: seed,
    generatedRuntimeRegistryPath: generatedMacShotRuntimeRegistryPath,
    generatedRuntimeRoot: generatedMacShotRuntimeRoot,
    entriesGenerated: validPackages.length,
    copiedFiles: copiedFiles.length,
  };
}

export type MacShotRuntimeRegistryGenerationResult = ReturnType<typeof generateMacShotRuntimeRegistry>;
