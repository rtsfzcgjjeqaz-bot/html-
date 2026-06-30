import fs from "fs";
import path from "path";
import crypto from "crypto";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { listUnifiedShotSelectionContracts } from "./assetLibraryCatalog";
import { generatedMacShotRuntimeRegistryPath, generatedMacShotRuntimeRoot } from "./macShotAutoRegistryGenerator";
import { syncMacShotSource } from "./macShotSourceSync";
import { selectShotsForScenes } from "./unifiedShotSelector";
import type { ShotSelectionSceneInput, UnifiedShotSelectionContract } from "./shotSelectionTypes";
import { resolveSceneRuntime } from "../remotion/runtime/resolveSceneRuntime";

const outputDir = path.join("outputs", "mac-shot-visual-regression");
const reviewDir = path.join(outputDir, "review");
const fps = 30;
const width = 1920;
const height = 1080;
const durationFrames = 90;

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function safeHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 8);
}

function runEnsureRuntime() {
  if (!fs.existsSync(generatedMacShotRuntimeRegistryPath) || !fs.existsSync(generatedMacShotRuntimeRoot)) {
    syncMacShotSource({ branch: "library/mac-approved-shots" });
  }
}

function sceneFromContract(contract: UnifiedShotSelectionContract): ShotSelectionSceneInput {
  return {
    sceneId: 1,
    visualIntent: contract.intents[0],
    sceneRole: contract.sceneRoles[0] ?? contract.intents[0],
    sourceEvidenceTypes: [],
    semanticKeywords: contract.semanticTags,
    requiredTextFields: [],
    targetDurationFrames: contract.durationRangeFrames.preferredFrames,
    aspectRatio: "16:9",
    sceneRequiredness: "required",
  };
}

function pickMacContract(contracts: UnifiedShotSelectionContract[]) {
  return contracts.find((item) => item.runtimeSourceKind === "mac_package_runtime" && item.selectionAllowed);
}

async function run() {
  runEnsureRuntime();
  ensureDir(outputDir);
  ensureDir(reviewDir);

  const contracts = listUnifiedShotSelectionContracts();
  const target = pickMacContract(contracts);
  if (!target) throw new Error("MAC_SHOT_VISUAL_REGRESSION_SELECTION_NOT_PROVEN:no_mac_contract");
  const syntheticScene = sceneFromContract(target);
  const plan = selectShotsForScenes([syntheticScene], undefined, { contracts });
  const decision = plan.decisions[0];
  writeJson(path.join(outputDir, "planner-decision.json"), { syntheticScene, decision, runtimeSelectionPlanHash: plan.runtimeSelectionPlanHash });

  if (!decision?.selectedRuntimeKey || decision.runtimeSourceKind !== "mac_package_runtime") {
    throw new Error("MAC_SHOT_VISUAL_REGRESSION_SELECTION_NOT_PROVEN");
  }

  const runtime = resolveSceneRuntime({
    selectedRuntimeKey: decision.selectedRuntimeKey,
    logicalShotId: decision.logicalShotId ?? decision.selectedShotId,
    choreographyId: decision.selectedChoreographyId,
  });
  if (!runtime || runtime.runtimeKey !== decision.selectedRuntimeKey) {
    throw new Error("MAC_SHOT_VISUAL_REGRESSION_IDENTITY_MISMATCH");
  }

  const scene = {
    id: 1,
    duration: durationFrames / fps,
    durationInFrames: durationFrames,
    hookType: "curiosity",
    camera: { shot: "medium", motion: "static" },
    visualIntent: syntheticScene.visualIntent,
    textOverlay: ["Mac Runtime Preview", target.displayName],
    sceneType: syntheticScene.sceneRole,
    visualType: target.compositionType,
    visualTemplate: target.compositionType,
    assets: { image: [], fallback: "synthetic" },
    audioCue: "none",
    sourceType: "synthetic",
    dataFocus: target.semanticTags,
    headline: "Mac Runtime Preview",
    supportingText: target.displayName,
    selectedShotId: decision.logicalShotId ?? decision.selectedShotId,
    selectedRuntimeKey: decision.selectedRuntimeKey,
    selectedRuntimeSourceKind: decision.runtimeSourceKind,
    choreographyId: decision.selectedChoreographyId,
    motionPresetIds: [],
    visualAssetRefs: [],
    selectedEvidenceIds: [],
    componentProps: {
      selectedRuntimeKey: decision.selectedRuntimeKey,
      runtimeSourceKind: decision.runtimeSourceKind,
      renderRuntimeKey: runtime.runtimeKey,
    },
  };

  const inputProps = {
    withAudio: false,
    structure: {
      meta: { fps, width, height, durationFrames },
      renderConfig: { duration: durationFrames / fps },
      scenes: [scene],
      articleJob: {
        jobId: "mac-shot-visual-regression",
        articleId: "synthetic-mac-shot-visual-regression",
        selectedEvidenceIds: [],
        selectedShotIds: [String(scene.selectedShotId)],
        selectedRuntimeKeys: [decision.selectedRuntimeKey],
        selectedChoreographyIds: [String(scene.choreographyId)],
        runtimeSelectionPlan: plan,
      },
    },
  };

  const registryRuntimeKey = runtime.runtimeKey;
  const identityMatch = decision.selectedRuntimeKey === registryRuntimeKey && runtime.runtimeKey === decision.selectedRuntimeKey;
  const trace = {
    selectedLogicalShotId: decision.logicalShotId ?? decision.selectedShotId,
    selectedRuntimeKey: decision.selectedRuntimeKey,
    selectedRuntimeSourceKind: decision.runtimeSourceKind,
    selectedMacShotSourceCommit: decision.macShotSourceCommit,
    selectedMacShotPackageHash: decision.macShotPackageHash,
    selectedGeneratedRuntimeRegistryHash: decision.generatedRuntimeRegistryHash,
    runtimeSelectionPlanHash: plan.runtimeSelectionPlanHash,
    runtimeSelectionPlanSelectedRuntimeKey: plan.decisions[0]?.selectedRuntimeKey,
    renderRuntimeKey: runtime.runtimeKey,
    componentIdentity: runtime.componentIdentity,
    choreographyIdentity: runtime.choreographyIdentity,
    registrySource: runtime.registrySource,
    registryRuntimeKey,
    identityMatch,
  };
  writeJson(path.join(outputDir, "runtime-trace.json"), trace);
  if (!identityMatch) throw new Error("MAC_SHOT_VISUAL_REGRESSION_IDENTITY_MISMATCH");

  const sourceCommitTag = decision.macShotSourceCommit ? decision.macShotSourceCommit.slice(0, 7) : "unknown";
  const outputName = `mac-${String(trace.selectedLogicalShotId).replace("_", "-")}-${safeHash(decision.selectedRuntimeKey)}-${sourceCommitTag}-preview.mp4`;
  const previewPath = path.join(outputDir, outputName);
  const bundleLocation = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public"), onProgress: () => undefined, enableCaching: true });
  const composition = await selectComposition({ serveUrl: bundleLocation, id: "WebsiteAdPreview", inputProps });
  await renderMedia({ serveUrl: bundleLocation, composition, codec: "h264", outputLocation: previewPath, inputProps, overwrite: true, audioCodec: null, concurrency: 1 });

  const framePaths = [
    { label: "first", frame: 0, file: path.join(reviewDir, "first-frame.png") },
    { label: "middle", frame: Math.floor(durationFrames / 2), file: path.join(reviewDir, "middle-frame.png") },
    { label: "last", frame: durationFrames - 1, file: path.join(reviewDir, "last-frame.png") },
  ];
  for (const frame of framePaths) {
    await renderStill({ serveUrl: bundleLocation, composition, inputProps, output: frame.file, frame: frame.frame, imageFormat: "png" });
  }

  const previewStats = fs.statSync(previewPath);
  const summary = {
    status: "passed",
    syntheticScene,
    candidateCount: decision.candidateRuntimeKeys.length,
    previewPath,
    previewRelativePath: previewPath.replace(/\\/g, "/"),
    previewBytes: previewStats.size,
    durationSeconds: durationFrames / fps,
    durationFrames,
    width,
    height,
    fps,
    runtimeTracePath: path.join(outputDir, "runtime-trace.json").replace(/\\/g, "/"),
    plannerDecisionPath: path.join(outputDir, "planner-decision.json").replace(/\\/g, "/"),
    reviewFrames: framePaths.map((item) => item.file.replace(/\\/g, "/")),
    trace,
  };
  writeJson(path.join(outputDir, "visual-regression-summary.json"), summary);

  console.log(`macShotVisualRegressionStatus=${summary.status}`);
  console.log(`selectedLogicalShotId=${trace.selectedLogicalShotId}`);
  console.log(`selectedRuntimeKey=${trace.selectedRuntimeKey}`);
  console.log(`selectedRuntimeSourceKind=${trace.selectedRuntimeSourceKind}`);
  console.log(`selectedMacShotSourceCommit=${trace.selectedMacShotSourceCommit}`);
  console.log(`candidateCount=${summary.candidateCount}`);
  console.log(`identityMatch=${trace.identityMatch}`);
  console.log(`previewPath=${summary.previewRelativePath}`);
  console.log(`previewBytes=${summary.previewBytes}`);
  console.log(`durationSeconds=${summary.durationSeconds}`);
  console.log(`resolution=${width}x${height}`);
  console.log(`fps=${fps}`);
  console.log(`runtimeTracePath=${summary.runtimeTracePath}`);
  console.log(`reviewFrames=${summary.reviewFrames.join(",")}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
