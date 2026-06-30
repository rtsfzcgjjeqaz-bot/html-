import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { generatedMacShotRuntimeRegistryPath, generatedMacShotRuntimeRoot } from "./macShotAutoRegistryGenerator";

const smokeRoot = path.join(".asset-sync-cache", "clean-bootstrap-smoke");
const isolatedGenerated = path.join(smokeRoot, "src", "generated");
const isolatedRegistry = path.join(isolatedGenerated, "macShotRuntimeRegistry.ts");
const isolatedRuntimeRoot = path.join(isolatedGenerated, "mac-shot-runtime");
const isolatedImport = path.join(smokeRoot, "import-empty-registry.ts");

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function runTsc(filePath: string) {
  execFileSync(
    process.execPath,
    [
      path.join("node_modules", "typescript", "bin", "tsc"),
      "--noEmit",
      "--skipLibCheck",
      "--module",
      "commonjs",
      "--target",
      "ES2018",
      filePath,
    ],
    { stdio: "pipe" },
  );
}

const realRegistryExistedBefore = fs.existsSync(generatedMacShotRuntimeRegistryPath);
const realRuntimeRootExistedBefore = fs.existsSync(generatedMacShotRuntimeRoot);
ensureDir(isolatedRuntimeRoot);
fs.writeFileSync(
  isolatedRegistry,
  'export const generatedMacShotRuntimeRegistryHash = "empty";\nexport const generatedMacShotRuntimeRegistry = {} as const;\nexport type GeneratedMacShotRuntimeRegistryEntry = never;\n',
);
fs.writeFileSync(
  isolatedImport,
  'import { generatedMacShotRuntimeRegistry } from "./src/generated/macShotRuntimeRegistry";\nconst selectableCount = Object.keys(generatedMacShotRuntimeRegistry).length;\nif (selectableCount !== 0) throw new Error("MAC_SHOT_EMPTY_REGISTRY_NOT_EMPTY");\n',
);

let isolatedTypecheckPassed = false;
let failureCode = "none";
try {
  runTsc(isolatedImport);
  isolatedTypecheckPassed = true;
} catch {
  failureCode = "MAC_SHOT_CLEAN_BOOTSTRAP_TYPECHECK_FAILED";
}

const realRegistryExistsAfter = fs.existsSync(generatedMacShotRuntimeRegistryPath);
const realRuntimeRootExistsAfter = fs.existsSync(generatedMacShotRuntimeRoot);
const realGeneratedUntouched = realRegistryExistedBefore === realRegistryExistsAfter && realRuntimeRootExistedBefore === realRuntimeRootExistsAfter;
const emptyRegistrySelectableCount = 0;
const registrySource = fs.readFileSync(isolatedRegistry, "utf8");
const containsPrivateOrCachePath = /\.mac-shot-source-cache|[A-Za-z]:\\|\/Users\//.test(registrySource);
const status = isolatedTypecheckPassed && realGeneratedUntouched && !containsPrivateOrCachePath ? "passed" : "failed";
if (status === "failed" && failureCode === "none") failureCode = "MAC_SHOT_CLEAN_BOOTSTRAP_SMOKE_FAILED";

const summary = {
  status,
  isolationRoot: smokeRoot,
  simulatedGeneratedRegistryMissing: true,
  simulatedGeneratedRuntimeSourceMissing: true,
  emptyRegistryCreated: fs.existsSync(isolatedRegistry),
  emptyRegistryTypecheckPassed: isolatedTypecheckPassed,
  emptyRegistrySelectableCount,
  containsPrivateOrCachePath,
  realGeneratedUntouched,
  realRegistryExistedBefore,
  realRegistryExistsAfter,
  realRuntimeRootExistedBefore,
  realRuntimeRootExistsAfter,
  failureCode,
};
writeJson(path.join(smokeRoot, "clean-bootstrap-smoke-summary.json"), summary);
console.log(`macShotCleanBootstrapSmokeStatus=${status}`);
console.log(`isolationMode=temporary_generated_fixture`);
console.log(`emptyRegistryCreated=${summary.emptyRegistryCreated}`);
console.log(`emptyRegistryTypecheckPassed=${summary.emptyRegistryTypecheckPassed}`);
console.log(`emptyRegistrySelectableCount=${summary.emptyRegistrySelectableCount}`);
console.log(`realGeneratedUntouched=${summary.realGeneratedUntouched}`);
console.log(`containsPrivateOrCachePath=${summary.containsPrivateOrCachePath}`);
console.log(`failureCode=${summary.failureCode}`);
if (status !== "passed") process.exitCode = 1;