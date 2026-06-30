import fs from "fs";
import path from "path";
import { generatedMacShotRuntimeRegistry } from "../generated/macShotRuntimeRegistry";
import { macShotPlannerRenderIdentityMismatchCode, resolveRuntimeKeyFromLogicalId, runtimeLogicalShotIdAmbiguousCode } from "./runtimeIdentity";

const acceptancePath = path.join(".asset-sync-cache", "mac-shot-planner-acceptance-summary.json");
type RegistryEntry = {
  shotId: string;
  logicalShotId?: string;
  runtimeKey?: string;
  component?: unknown;
  choreography?: unknown;
};

type AcceptanceResult = {
  targetMacLogicalShotId: string;
  targetMacRuntimeKey: string;
  selectedRuntimeKey: string;
  selectedRuntimeSourceKind: string;
};

function loadAcceptanceResults(): AcceptanceResult[] {
  if (!fs.existsSync(acceptancePath)) return [];
  const parsed = JSON.parse(fs.readFileSync(acceptancePath, "utf8")) as { results?: AcceptanceResult[] };
  return parsed.results ?? [];
}

const registry = generatedMacShotRuntimeRegistry as Record<string, RegistryEntry>;
const allRuntimeKeys = Object.keys(registry);
const acceptance = loadAcceptanceResults().filter((item) => item.selectedRuntimeSourceKind === "mac_package_runtime").slice(0, 3);
const results = acceptance.map((item) => {
  const entry = registry[item.selectedRuntimeKey];
  const renderRuntimeKey = entry?.runtimeKey ?? item.selectedRuntimeKey;
  const componentExportResolved = Boolean(entry?.component && typeof entry.component === "object");
  const choreographyExportResolved = typeof entry?.choreography === "function";
  const identityMatch = item.selectedRuntimeKey === renderRuntimeKey;
  return {
    selectedRuntimeKey: item.selectedRuntimeKey,
    generatedRegistryUniqueEntry: allRuntimeKeys.filter((runtimeKey) => runtimeKey === item.selectedRuntimeKey).length === 1,
    staticComponentImport: true,
    staticChoreographyImport: true,
    componentExportResolved,
    choreographyExportResolved,
    renderRuntimeKey,
    identityMatch,
    failureCode: !entry
      ? "MAC_SHOT_STATIC_REGISTRY_ENTRY_MISSING"
      : !identityMatch
        ? macShotPlannerRenderIdentityMismatchCode
        : !componentExportResolved || !choreographyExportResolved
          ? "MAC_SHOT_RUNTIME_EXPORT_INCOMPATIBLE"
          : "none",
  };
});

let ambiguousLookupFailClosed = false;
try {
  resolveRuntimeKeyFromLogicalId({ logicalShotId: "shot_51", runtimeKeys: ["local:shot_51", ...allRuntimeKeys] });
} catch (error) {
  ambiguousLookupFailClosed = error instanceof Error && error.message.includes(runtimeLogicalShotIdAmbiguousCode);
}

const status = results.length >= 3 && results.every((item) => item.failureCode === "none") && ambiguousLookupFailClosed ? "passed" : "failed";
const summary = { status, ambiguousLookupFailClosed, results };
fs.mkdirSync(".asset-sync-cache", { recursive: true });
fs.writeFileSync(path.join(".asset-sync-cache", "mac-shot-runtime-identity-smoke-summary.json"), JSON.stringify(summary, null, 2));
console.log(`macShotRuntimeIdentitySmokeStatus=${status}`);
console.log(`ambiguousLookupFailClosed=${ambiguousLookupFailClosed}`);
for (const item of results) {
  console.log(`selectedRuntimeKey=${item.selectedRuntimeKey};renderRuntimeKey=${item.renderRuntimeKey};identityMatch=${item.identityMatch};componentExportResolved=${item.componentExportResolved};choreographyExportResolved=${item.choreographyExportResolved};failureCode=${item.failureCode}`);
}
if (status !== "passed") process.exitCode = 1;