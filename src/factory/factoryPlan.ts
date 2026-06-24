import "dotenv/config";
import fs from "fs";
import path from "path";
import { analyzeWebsite } from "../ai/analyzeWebsite";
import { directorBrain } from "../ai/directorBrain";
import { generateBatchStoryboard } from "../ai/generateBatchStoryboard";
import { generateBatchStrategies, type BatchStrategy } from "../ai/generateBatchStrategies";
import { captureWebsite } from "../capture/captureWebsite";
import { defaultDurationSeconds } from "../lib/config";
import { normalizeStyleProfile } from "../motion/styleProfileCompatibility";
import type { FactoryMode, StyleProfileId } from "../motion/choreographyTypes";
import { renderMotionPreview } from "../motion/preview";
import { ensureRunDirs, type FactoryState, padIndex, videoIdFor, writeFactoryState } from "./factoryState";
import { runPreviewGate } from "./previewGate";
import { generatePreviewFrames, renderPreviewFromStructure } from "./sequentialRenderer";
import { planResolvedScenesWithShots } from "./shotPlanner";
import { planVideoVariant } from "./videoVariantPlanner";

export type FactoryPlanArgs = {
  url?: string;
  count: number;
  profile: StyleProfileId;
  includeChoreographies: string[];
  excludeChoreographies: string[];
  mode: FactoryMode;
  renderFirstPreview?: boolean;
};

function listArg(value?: string) {
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

export function readFactoryPlanArgs(argv = process.argv.slice(2)): FactoryPlanArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };

  const modeValue = valueAfter("--mode");
  const mode: FactoryMode = modeValue === "restricted" || modeValue === "test" ? modeValue : "auto";

  return {
    url: valueAfter("--url") ?? argv.find((arg) => arg.startsWith("http")),
    count: Number(valueAfter("--count") ?? 10),
    profile: normalizeStyleProfile(valueAfter("--profile")),
    includeChoreographies: listArg(valueAfter("--include-choreographies")),
    excludeChoreographies: listArg(valueAfter("--exclude-choreographies")),
    mode,
    renderFirstPreview: mode !== "test",
  };
}

function ensureUrl(value: string) {
  try {
    return new URL(value).toString();
  } catch {
    return new URL(`https://${value}`).toString();
  }
}

function makeRunId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `run_${stamp}`;
}

function variantStrategy(base: BatchStrategy, index: number): BatchStrategy {
  const suffix = `variant_${padIndex(index)}`;
  return {
    ...base,
    strategyId: base.strategyId,
    hookStrength: Math.max(0.55, Math.min(0.98, base.hookStrength - (index % 4) * 0.03 + (index % 2) * 0.04)),
    angle: `${base.angle} (${suffix})`,
  };
}

export async function planFactoryRun(args: FactoryPlanArgs) {
  if (args.mode === "test") {
    const choreographyId = args.includeChoreographies[0];
    if (!choreographyId) {
      throw new Error("test mode requires --include-choreographies with one choreography id, or use npm run motion:preview -- --choreography <id>");
    }
    return {
      runId: "motion_preview_test",
      firstPreviewPath: renderMotionPreview(choreographyId),
    };
  }

  if (!args.url) {
    throw new Error('Missing URL. Use: npm run factory:plan -- --url "https://example.com" --count 10 --profile ai-tool-promo');
  }
  if (args.mode === "restricted" && args.includeChoreographies.length === 0) {
    throw new Error("restricted mode requires --include-choreographies");
  }

  const url = ensureUrl(args.url);
  const count = Math.max(1, args.count || 10);
  const runId = makeRunId();
  const runDir = ensureRunDirs(runId);

  const capture = await captureWebsite(url);
  const director = await directorBrain(capture);
  const analysis = await analyzeWebsite(capture);
  const baseStrategies = await generateBatchStrategies(analysis, director);
  const planStrategies = Array.from({ length: count }, (_, index) => variantStrategy(baseStrategies[index % baseStrategies.length], index + 1));
  const baseStoryboards = await generateBatchStoryboard(baseStrategies, analysis, capture);

  const videos = [];
  const structures = [];

  for (let i = 1; i <= count; i++) {
    const videoId = videoIdFor(i);
    const strategy = planStrategies[i - 1];
    const storyboard = baseStoryboards[(i - 1) % baseStoryboards.length];
    const plannedScenes = planVideoVariant(storyboard.scenes, strategy, {
      profile: args.profile,
      mode: args.mode,
      includeChoreographies: args.includeChoreographies,
      excludeChoreographies: args.excludeChoreographies,
      fps: 30,
    });
    const shotPlan = planResolvedScenesWithShots(plannedScenes, {
      fps: 30,
      profile: args.profile,
      narrativeId: strategy.type,
      allowedChoreographyIds: args.mode === "restricted" ? args.includeChoreographies : undefined,
      excludedChoreographyIds: args.excludeChoreographies,
    });
    const scenes = shotPlan.scenes;
    const structurePath = path.join(runDir, "structures", `${videoId}.structure.json`);
    const qaPath = path.join(runDir, "qa", `${videoId}.qa.json`);
    const previewPath = path.join(runDir, "previews", `${videoId}.preview.mp4`);
    const finalPath = path.join(runDir, "final", `${videoId}.final.mp4`);

    const structure = {
      project: { url, timestamp: new Date().toISOString(), profile: args.profile, factoryMode: args.mode },
      director,
      analysis,
      strategies: planStrategies,
      selectedStrategy: strategy.strategyId,
      scenes,
      batchVideos: [{ strategyId: strategy.strategyId, scenes }],
      assets: {
        images: capture.screenshots.map((shot) => shot.path),
        screenshots: capture.screenshots.map((shot) => shot.path),
        website: capture.assets,
      },
      renderConfig: { aspectRatio: "16:9", duration: defaultDurationSeconds },
      bgmKeywords: ["premium product ad", "clean technology", "confident pulse"],
      cover: {
        title: `${director.brand} / ${videoId}`,
        visual: capture.screenshots[0]?.path || "",
      },
      choreographySelection: {
        profile: args.profile,
        mode: args.mode,
        includeChoreographies: args.includeChoreographies,
        excludeChoreographies: args.excludeChoreographies,
      },
      shotRuntime: {
        selectedShots: shotPlan.debug.filter((scene) => scene.selectedShotId),
        resolver: "assets/index/asset-resolver.ts",
        registry: "assets/index/shot-registry.json",
      },
    };

    fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2));
    structures.push({ videoId, structurePath, narrativeId: strategy.type });
    videos.push({
      index: i,
      videoId,
      narrativeId: strategy.type,
      layoutSequence: scenes.map((scene) => scene.layoutId || scene.sceneType),
      motionSequence: scenes.flatMap((scene) => scene.motionIds ?? []),
      cameraSequence: scenes.map((scene) => scene.cameraPathId || "blocked"),
      transitionSequence: scenes.map((scene) => scene.transitionId || "blocked"),
      previewStatus: "missing" as const,
      finalStatus: "not_rendered" as const,
      qaStatus: "warning" as const,
      previewPath,
      finalPath,
      structurePath,
      qaPath,
      revisionCount: 0,
      lastUserNote: "",
    });
  }

  const state: FactoryState = {
    runId,
    url,
    count,
    currentIndex: 1,
    status: "waiting_review",
    videos,
  };

  fs.writeFileSync(path.join(runDir, "factory-plan.json"), JSON.stringify({ runId, url, count, videos: structures }, null, 2));

  if (args.renderFirstPreview) {
    const first = state.videos[0];
    const firstStructure = JSON.parse(fs.readFileSync(first.structurePath, "utf8"));
    const blockedScenes = Array.isArray(firstStructure.scenes)
      ? firstStructure.scenes.filter((scene: { choreographyBlockedReason?: unknown }) => scene.choreographyBlockedReason)
      : [];
    if (blockedScenes.length) {
      fs.writeFileSync(
        first.qaPath,
        JSON.stringify(
          {
            passed: false,
            errors: blockedScenes.map((scene: { id?: number; choreographyBlockedReason?: unknown }, index: number) => ({
              scene: scene.id ?? index + 1,
              choreographyBlockedReason: scene.choreographyBlockedReason,
            })),
            warnings: [],
            checks: { choreographySelection: "failed" },
          },
          null,
          2,
        ),
      );
      first.qaStatus = "failed";
      first.previewStatus = "rejected";
      writeFactoryState(state);
      return { runId, firstPreviewPath: first.previewPath, blockedByQaPath: first.qaPath };
    }

    const qa = runPreviewGate(firstStructure, first.qaPath);
    first.qaStatus = qa.status;
    if (qa.status === "failed") {
      first.previewStatus = "rejected";
      writeFactoryState(state);
      return { runId, firstPreviewPath: first.previewPath, blockedByQaPath: first.qaPath };
    }

    renderPreviewFromStructure(first.structurePath, first.previewPath);
    const frameWarnings = generatePreviewFrames(first.previewPath, path.join(runDir, "frames"), first.videoId);
    if (frameWarnings.length) {
      const updatedQa = { ...qa, warnings: [...qa.warnings, ...frameWarnings], status: qa.status === "passed" ? "warning" : qa.status };
      fs.writeFileSync(first.qaPath, JSON.stringify(updatedQa, null, 2));
      first.qaStatus = updatedQa.status;
    }
    first.previewStatus = "ready";
  }

  writeFactoryState(state);
  return { runId, firstPreviewPath: state.videos[0]?.previewPath };
}

async function runCli() {
  const result = await planFactoryRun(readFactoryPlanArgs());
  console.log(`runId: ${result.runId}`);
  if (result.blockedByQaPath) {
    console.log(`Preview blocked by QA: ${result.blockedByQaPath}`);
  } else if (result.firstPreviewPath) {
    console.log(`Preview path: ${result.firstPreviewPath}`);
  }
}

if (require.main === module) {
  void runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
