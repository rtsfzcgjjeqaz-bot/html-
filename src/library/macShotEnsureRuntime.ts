import fs from "fs";
import path from "path";
import { generatedMacShotRuntimeRegistryPath, generatedMacShotRuntimeRoot } from "./macShotAutoRegistryGenerator";
import { syncMacShotSource, loadMacShotSourceSyncReport } from "./macShotSourceSync";

function hasRegistry() {
  return fs.existsSync(generatedMacShotRuntimeRegistryPath) && fs.existsSync(generatedMacShotRuntimeRoot);
}

function writeEmptyRegistry() {
  fs.mkdirSync(path.dirname(generatedMacShotRuntimeRegistryPath), { recursive: true });
  fs.mkdirSync(generatedMacShotRuntimeRoot, { recursive: true });
  fs.writeFileSync(
    generatedMacShotRuntimeRegistryPath,
    'export const generatedMacShotRuntimeRegistryHash = "empty";\nexport const generatedMacShotRuntimeRegistry = {} as const;\nexport type GeneratedMacShotRuntimeRegistryEntry = never;\n',
  );
}

const branchArg = process.argv.indexOf("--branch");
const branch = branchArg >= 0 ? process.argv[branchArg + 1] : "library/mac-approved-shots";
const forceEmpty = process.argv.includes("--force-empty") || process.env.MAC_SHOT_FORCE_EMPTY_REGISTRY === "1";
let cacheFallbackUsed = false;
let emptyRegistryFallbackUsed = false;
let generatedRegistryRecreated = false;
let generatedRuntimeSourcesRecreated = false;
let warningCode = "none";
let failureCode = "none";

try {
  if (forceEmpty && !hasRegistry()) {
    writeEmptyRegistry();
    emptyRegistryFallbackUsed = true;
  } else if (!hasRegistry()) {
    syncMacShotSource({ branch });
    generatedRegistryRecreated = fs.existsSync(generatedMacShotRuntimeRegistryPath);
    generatedRuntimeSourcesRecreated = fs.existsSync(generatedMacShotRuntimeRoot);
  }
} catch {
  const report = loadMacShotSourceSyncReport();
  cacheFallbackUsed = Boolean(report?.packages?.length);
  if (cacheFallbackUsed && hasRegistry()) {
    warningCode = "MAC_SHOT_REMOTE_UNAVAILABLE_USING_EXISTING_GENERATED_RUNTIME";
  } else if (!hasRegistry()) {
    if (cacheFallbackUsed) {
      warningCode = "MAC_SHOT_CACHE_METADATA_PRESENT_BUT_RUNTIME_SOURCE_UNAVAILABLE_USING_EMPTY_REGISTRY";
    }
    writeEmptyRegistry();
    emptyRegistryFallbackUsed = true;
  }
  if (!hasRegistry()) failureCode = "MAC_SHOT_GENERATED_REGISTRY_BOOTSTRAP_INCOMPLETE";
}

const status = failureCode === "none" ? "passed" : "failed";
console.log(`macShotEnsureRuntimeStatus=${status}`);
console.log(`generatedRegistryPresent=${fs.existsSync(generatedMacShotRuntimeRegistryPath)}`);
console.log(`generatedRuntimeSourcesPresent=${fs.existsSync(generatedMacShotRuntimeRoot)}`);
console.log(`generatedRegistryRecreated=${generatedRegistryRecreated}`);
console.log(`generatedRuntimeSourcesRecreated=${generatedRuntimeSourcesRecreated}`);
console.log(`cacheFallbackUsed=${cacheFallbackUsed}`);
console.log(`emptyRegistryFallbackUsed=${emptyRegistryFallbackUsed}`);
console.log(`warningCode=${warningCode}`);
console.log(`failureCode=${failureCode}`);
if (status !== "passed") process.exitCode = 1;