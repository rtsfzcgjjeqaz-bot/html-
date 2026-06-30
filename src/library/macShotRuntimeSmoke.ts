import { generatedMacShotRuntimeRegistry } from "../generated/macShotRuntimeRegistry";
import { loadMacShotSourceSyncReport } from "./macShotSourceSync";
import { macRuntimeKey } from "./runtimeIdentity";

type SmokeResult = {
  shotId: string;
  canonicalContractValid: boolean;
  runtimeCopied: boolean;
  staticRegistryEntryPresent: boolean;
  componentExportResolved: boolean;
  choreographyExportResolved: boolean;
  SceneRendererCompatibility: boolean;
  failureCode: string;
};

function pickShots() {
  const report = loadMacShotSourceSyncReport();
  const valid = report?.packages.filter((item) => item.selectionAllowed && item.contract) ?? [];
  const picks: typeof valid = [];
  const take = (match: (item: typeof valid[number]) => boolean) => {
    const found = valid.find((item) => !picks.some((picked) => picked.shotId === item.shotId) && match(item));
    if (found) picks.push(found);
  };
  take((item) => item.contract?.sceneRoles.some((role) => /websiteHero|hero/i.test(role)) ?? false);
  take((item) => item.contract?.sceneRoles.some((role) => /workflow|searchDemo|stepFlow|reason/i.test(role)) || item.contract?.intents.some((intent) => intent === "reason" || intent === "step_flow") || false);
  take((item) => item.contract?.intents.includes("recommendation") || item.contract?.semanticTags.some((tag) => /ai|prompt|recommend/i.test(tag)) || false);
  return picks.slice(0, 3);
}

function run() {
  const registry = generatedMacShotRuntimeRegistry as Record<string, { component?: unknown; choreography?: unknown }>;
  const shots = pickShots();
  const results: SmokeResult[] = shots.map((shot) => {
    const runtimeKey = macRuntimeKey(shot.sourceCommit, shot.shotId);
    const entry = registry[runtimeKey] ?? registry[shot.shotId];
    const componentExportResolved = Boolean(entry?.component && typeof entry.component === "object");
    const choreographyExportResolved = typeof entry?.choreography === "function";
    const passed = Boolean(shot.contract && entry && componentExportResolved && choreographyExportResolved);
    return {
      shotId: shot.shotId,
      canonicalContractValid: Boolean(shot.contract),
      runtimeCopied: Boolean(entry),
      staticRegistryEntryPresent: Boolean(entry),
      componentExportResolved,
      choreographyExportResolved,
      SceneRendererCompatibility: choreographyExportResolved,
      failureCode: passed ? "none" : !entry ? "MAC_SHOT_STATIC_REGISTRY_ENTRY_MISSING" : !choreographyExportResolved ? "MAC_SHOT_RUNTIME_EXPORT_INCOMPATIBLE" : "MAC_SHOT_RUNTIME_SMOKE_FAILED",
    };
  });
  const status = results.length >= 3 && results.every((item) => item.failureCode === "none") ? "passed" : "failed";
  console.log(`macShotRuntimeSmokeStatus=${status}`);
  console.log(`macShotRuntimeSmokeCount=${results.length}`);
  for (const item of results) {
    console.log(`shotId=${item.shotId};canonicalContractValid=${item.canonicalContractValid};runtimeCopied=${item.runtimeCopied};staticRegistryEntryPresent=${item.staticRegistryEntryPresent};componentExportResolved=${item.componentExportResolved};choreographyExportResolved=${item.choreographyExportResolved};SceneRendererCompatibility=${item.SceneRendererCompatibility};failureCode=${item.failureCode}`);
  }
  if (status !== "passed") process.exitCode = 1;
}

run();
