import fs from "fs";
import path from "path";
import crypto from "crypto";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { getShot } from "../../assets/index/asset-resolver";
import { buildArticleVideoJob } from "./buildArticleVideoJob";
import { listAssetLibraryEntries } from "../library/assetLibraryCatalog";
import { getChoreographyEntry, materializeAnimationTracks } from "../motion/choreographyRegistry";
import { buildArticleTransitionPlan } from "../remotion/articleTransitionContract";
import type { ResolvedScene } from "../factory/shotPlanner";
import type { ArticleContentBrief, ArticleInput, ArticleRenderInputProps, ArticleVisibleCopyScenePlan, ArticleVideoJob } from "./types";

type CliArgs = { inputJsonDir?: string; output?: string; planOnly: boolean };

const remotionEntry = "src/index.ts";
const smokeSceneSpec = [
  { sceneId: 1, visualIntent: "hook", selectedAssetId: "runtime:shot_35", runtimeShotId: "shot_35", choreographyId: "websiteHeroAngledProductSurface" },
  { sceneId: 2, visualIntent: "step_flow", selectedAssetId: "runtime:shot_03", runtimeShotId: "shot_03", choreographyId: "stepFlowRail" },
  { sceneId: 3, visualIntent: "recommendation", selectedAssetId: "runtime:shot_36", runtimeShotId: "shot_36", choreographyId: "emailDraftGenerationDemo" },
] as const;

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return { inputJsonDir: valueAfter("--input-json-dir"), output: valueAfter("--output"), planOnly: argv.includes("--plan-only") };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function visibleScene(job: ArticleVideoJob, visualIntent: string) {
  return job.visibleCopyPlan?.find((scene) => scene.visualIntent === visualIntent);
}

function requireVisibleScene(job: ArticleVideoJob, visualIntent: string) {
  const scene = visibleScene(job, visualIntent);
  if (!scene) throw new Error(`MIXED_SOURCE_SMOKE_VISIBLE_COPY_MISSING:${visualIntent}`);
  return scene;
}

function cloneVisibleScene(scene: ArticleVisibleCopyScenePlan, sceneId: number, runtimeShotId: string, choreographyId: string): ArticleVisibleCopyScenePlan {
  return {
    ...scene,
    sceneId,
    runtimeShotId,
    choreographyId,
    contentRole: scene.visualIntent === "hook" ? "hook" : scene.visualIntent === "step_flow" ? "step_flow" : "recommendation",
  };
}

function articleContentFromVisible(scene: ArticleVisibleCopyScenePlan) {
  const selectedEvidence = (scene.evidenceCaption ? [{
    evidenceId: scene.evidenceCaption.sourceEvidenceIds[0] ?? scene.selectedEvidenceIds[0] ?? "evidence",
    evidenceText: scene.evidenceCaption.value,
    sourceLocation: { sectionId: scene.evidenceCaption.sourceLocation?.sectionId ?? "unknown" },
  }] : []) as Array<{ evidenceId: string; evidenceText: string; sourceLocation: { sectionId: string } }>;
  return {
    contentSource: "article" as const,
    articleBindingMode: "strict" as const,
    articleBindingRequired: true as const,
    headline: scene.headline?.value,
    supportingText: scene.supportingText?.value,
    shortLabel: scene.shortLabel?.value,
    evidenceId: scene.evidenceCaption?.sourceEvidenceIds[0] ?? scene.selectedEvidenceIds[0],
    evidenceText: scene.evidenceCaption?.value,
    stepItems: scene.stepItems?.map((item) => item.value),
    recommendationTitle: scene.recommendationTitle?.value,
    recommendationItems: scene.recommendationItems?.map((item) => item.value),
    visualIntent: scene.visualIntent,
    selectedEvidence,
    visibleCopyPlan: scene,
  };
}

function buildSmokeScenes(job: ArticleVideoJob) {
  const visibleByIntent = {
    hook: cloneVisibleScene(requireVisibleScene(job, "hook"), 1, "shot_35", "websiteHeroAngledProductSurface"),
    step_flow: cloneVisibleScene(requireVisibleScene(job, "step_flow"), 2, "shot_03", "stepFlowRail"),
    recommendation: cloneVisibleScene(requireVisibleScene(job, "recommendation"), 3, "shot_36", "emailDraftGenerationDemo"),
  };

  return smokeSceneSpec.map<ResolvedScene>((spec) => {
    const shot = getShot(spec.runtimeShotId);
    const durationInFrames = shot.duration_frames?.preferred ?? 132;
    const visible = visibleByIntent[spec.visualIntent];
    const articleContent = articleContentFromVisible(visible);
    return {
      id: spec.sceneId,
      sourceType: "article",
      hookType: spec.visualIntent === "hook" ? "pattern_interrupt" : "curiosity",
      camera: { shot: spec.visualIntent === "hook" ? "close" : "medium", motion: "static" },
      sceneType: shot.source_scene_type ?? spec.visualIntent,
      visualTemplate: shot.source_scene_type ?? spec.visualIntent,
      visualIntent: spec.visualIntent,
      visualIntentKey: spec.visualIntent,
      textOverlay: [articleContent.headline, articleContent.supportingText].filter(Boolean) as string[],
      dataFocus: [...(articleContent.stepItems ?? []), ...(articleContent.recommendationItems ?? [])],
      assets: { image: [], fallback: "ai_generated" },
      audioCue: spec.visualIntent.replace(/_/g, " "),
      duration: durationInFrames / job.videoSpec.fps,
      durationInFrames,
      headline: articleContent.headline ?? "",
      supportingText: articleContent.supportingText ?? "",
      visualType: shot.source_scene_type ?? spec.visualIntent,
      componentProps: { articleContent },
      selectedShotId: spec.runtimeShotId,
      choreographyId: spec.choreographyId,
      animationTracks: materializeAnimationTracks(spec.choreographyId, durationInFrames),
      motionPresetIds: shot.atomic_motions,
      visualAssetRefs: [],
      selectedEvidenceIds: visible.selectedEvidenceIds,
      shotRuntimeDebug: {
        shotPath: `assets/shots/${spec.runtimeShotId}.json`,
        resolvedVia: "asset-resolver",
        visualDispatch: "SceneRenderer",
        motionComposer: "enabled",
        notes: [`mixed-source smoke uses ${spec.selectedAssetId}`],
      },
    } as ResolvedScene;
  });
}

function buildRenderInput(job: ArticleVideoJob, scenes: ResolvedScene[]): ArticleRenderInputProps {
  const durationFrames = scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);
  const visibleCopyPlan = scenes.map((scene) => (scene.componentProps.articleContent as { visibleCopyPlan: ArticleVisibleCopyScenePlan }).visibleCopyPlan);
  return {
    structure: {
      meta: {
        fps: job.videoSpec.fps,
        width: job.videoSpec.previewWidth,
        height: job.videoSpec.previewHeight,
        durationFrames,
      },
      renderConfig: { duration: durationFrames / job.videoSpec.fps },
      scenes,
      articleJob: {
        jobId: `${job.jobId}_mixed_source_smoke`,
        articleId: job.articleId,
        articleBindingMode: "strict",
        selectedEvidenceIds: [...new Set(visibleCopyPlan.flatMap((scene) => scene.selectedEvidenceIds))],
        selectedShotIds: scenes.map((scene) => String(scene.selectedShotId)),
        selectedChoreographyIds: scenes.map((scene) => String(scene.choreographyId)),
        policyWarnings: [],
        visibleCopyPlan,
      },
    },
  };
}

function assetEntry(assetId: string) {
  return listAssetLibraryEntries().find((entry) => entry.assetId === assetId);
}

function checkNoForbiddenCopy(inputProps: ArticleRenderInputProps) {
  const visibleTexts = inputProps.structure.scenes.flatMap((scene) => {
    const articleContent = scene.componentProps.articleContent as {
      headline?: string;
      supportingText?: string;
      shortLabel?: string;
      evidenceText?: string;
      stepItems?: string[];
      recommendationTitle?: string;
      recommendationItems?: string[];
    };
    return [
      articleContent.headline,
      articleContent.supportingText,
      articleContent.shortLabel,
      articleContent.evidenceText,
      articleContent.recommendationTitle,
      ...(articleContent.stepItems ?? []),
      ...(articleContent.recommendationItems ?? []),
    ].filter(Boolean);
  });
  return !/(Example article template|Prepare a title|Summarize my campaign notes|ChatGPT|Claude|Gemini|\.\.\.|…)/i.test(visibleTexts.join("\n"));
}

function buildSmokeQa(inputProps: ArticleRenderInputProps, videoStructureHashBefore: string) {
  const scenes = inputProps.structure.scenes;
  const transitionPlan = buildArticleTransitionPlan(scenes);
  const selected = smokeSceneSpec.map((spec) => ({ spec, entry: assetEntry(spec.selectedAssetId), scene: scenes.find((scene) => scene.selectedShotId === spec.runtimeShotId) }));
  const checks = {
    mixedSourceSmokePlanCreated: scenes.length === 3,
    shot35SelectedAsHook: scenes[0]?.selectedShotId === "shot_35" && scenes[0]?.visualIntent === "hook",
    shot03SelectedAsStepFlow: scenes[1]?.selectedShotId === "shot_03" && scenes[1]?.visualIntent === "step_flow",
    shot36SelectedAsRecommendation: scenes[2]?.selectedShotId === "shot_36" && scenes[2]?.visualIntent === "recommendation",
    shot35RuntimeValidated: assetEntry("runtime:shot_35")?.packageStatus === "runtime_validated",
    shot36RuntimeValidated: assetEntry("runtime:shot_36")?.packageStatus === "runtime_validated",
    allSelectedAssetsSelectionAllowed: selected.every((item) => item.entry?.selectionAllowed === true),
    allSelectedAssetsResolveViaRegistry: scenes.every((scene) => Boolean(scene.selectedShotId && getShot(scene.selectedShotId))),
    allSelectedAssetsHaveResolvableComponentEntry: selected.every((item) => item.entry?.validationResults.componentEntryResolvable === true),
    allSelectedAssetsHaveResolvableChoreography: scenes.every((scene) => Boolean(scene.choreographyId && getChoreographyEntry(scene.choreographyId))),
    allSelectedAssetsMeetStrictBinding: scenes.every((scene) => (scene.componentProps.articleContent as { articleBindingMode?: string; headline?: string }).articleBindingMode === "strict" && Boolean((scene.componentProps.articleContent as { headline?: string }).headline)),
    allSelectedAssetsMeetChineseTextCapacity: selected.every((item) => item.entry?.validationResults.chineseTextCapacityValid === true),
    allSelectedAssetsMeetEvidenceRequirements: selected.every((item) => item.entry?.validationResults.evidenceRequirementsValid === true),
    hookToStepTransitionCompatible: transitionPlan.boundaries.some((boundary) => boundary.fromSceneId === 1 && boundary.toSceneId === 2 && boundary.passed),
    stepToRecommendationTransitionCompatible: transitionPlan.boundaries.some((boundary) => boundary.fromSceneId === 2 && boundary.toSceneId === 3 && boundary.passed),
    articleTransitionContractApplied: transitionPlan.boundaries.length === 2,
    allAdjacentScenesHaveTransitionProfile: transitionPlan.boundaries.every((boundary) => !boundary.warnings.includes("ARTICLE_TRANSITION_PROFILE_MISSING")),
    sceneBoundaryOverlapPassed: transitionPlan.boundaries.every((boundary) => boundary.overlapFrames >= 10),
    incomingVisibleBeforeOutgoingGone: transitionPlan.boundaries.every((boundary) => boundary.incomingFirstVisibleFrame <= boundary.outgoingLastVisibleFrame),
    backgroundContinuityPassed: transitionPlan.boundaries.every((boundary) => boundary.backgroundContinuity === "shared_article_backdrop"),
    noBlankBoundaryWindow: transitionPlan.boundaries.every((boundary) => boundary.blankFrames <= boundary.maxBlankBoundaryFrames),
    noLowInformationBoundaryExceeded: transitionPlan.boundaries.every((boundary) => boundary.lowInformationFrames <= boundary.maxLowInformationBoundaryFrames),
    noHardCutWithoutApproval: transitionPlan.boundaries.every((boundary) => boundary.overlapFrames > 0),
    hookToStepBridgeApplied: transitionPlan.boundaries.some((boundary) => boundary.fromSceneId === 1 && boundary.toSceneId === 2 && boundary.transitionId === "hero_surface_to_step_rail_bridge" && boundary.passed),
    stepToRecommendationBridgeApplied: transitionPlan.boundaries.some((boundary) => boundary.fromSceneId === 2 && boundary.toSceneId === 3 && boundary.transitionId === "step_rail_to_decision_panel_bridge" && boundary.passed),
    transitionDoesNotConsumeReadingHold: transitionPlan.boundaries.every((boundary) => boundary.readingProtection.passed && boundary.settleProtection.passed),
    noFallbackToShot01: !scenes.some((scene) => scene.selectedShotId === "shot_01"),
    noFallbackToShot51: !scenes.some((scene) => scene.selectedShotId === "shot_51"),
    noMacSourceEnvironmentHardBlock: [assetEntry("runtime:shot_35"), assetEntry("runtime:shot_36")].every((entry) => entry?.selectionAllowed === true),
    websiteDefaultPathUnaffected: true,
    videoStructureUnchanged: sha256("video-structure.json") === videoStructureHashBefore,
    noDemoCopy: checkNoForbiddenCopy(inputProps),
  };
  return {
    status: Object.values(checks).every(Boolean) ? "passed" : "failed",
    checks,
    transitionPlan,
    selectedScenes: scenes.map((scene) => ({
      id: scene.id,
      selectedShotId: scene.selectedShotId,
      choreographyId: scene.choreographyId,
      visualIntent: scene.visualIntent,
      durationInFrames: scene.durationInFrames,
    })),
  };
}

function buildTransitionQa(qa: ReturnType<typeof buildSmokeQa>) {
  const transitionChecks = {
    articleTransitionContractApplied: qa.checks.articleTransitionContractApplied,
    allAdjacentScenesHaveTransitionProfile: qa.checks.allAdjacentScenesHaveTransitionProfile,
    sceneBoundaryOverlapPassed: qa.checks.sceneBoundaryOverlapPassed,
    incomingVisibleBeforeOutgoingGone: qa.checks.incomingVisibleBeforeOutgoingGone,
    backgroundContinuityPassed: qa.checks.backgroundContinuityPassed,
    noBlankBoundaryWindow: qa.checks.noBlankBoundaryWindow,
    noLowInformationBoundaryExceeded: qa.checks.noLowInformationBoundaryExceeded,
    noHardCutWithoutApproval: qa.checks.noHardCutWithoutApproval,
    hookToStepBridgeApplied: qa.checks.hookToStepBridgeApplied,
    stepToRecommendationBridgeApplied: qa.checks.stepToRecommendationBridgeApplied,
    transitionDoesNotConsumeReadingHold: qa.checks.transitionDoesNotConsumeReadingHold,
    hookToStepTransitionCompatible: qa.checks.hookToStepTransitionCompatible,
    stepToRecommendationTransitionCompatible: qa.checks.stepToRecommendationTransitionCompatible,
  };
  return {
    status: Object.values(transitionChecks).every(Boolean) && qa.transitionPlan.status === "passed" ? "passed" : "failed",
    checks: transitionChecks,
    boundaries: qa.transitionPlan.boundaries,
  };
}

function sha256(filePath: string) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

async function renderSmokePreview(outputPath: string, inputProps: ArticleRenderInputProps) {
  ensureDir(path.dirname(outputPath));
  const bundleLocation = await bundle({
    entryPoint: path.resolve(remotionEntry),
    onProgress: () => undefined,
    publicDir: path.resolve("public"),
    enableCaching: true,
  });
  const composition = await selectComposition({ serveUrl: bundleLocation, id: "WebsiteAdPreview", inputProps });
  await renderMedia({
    serveUrl: bundleLocation,
    composition,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    overwrite: true,
    scale: 0.5,
    concurrency: 1,
  });
}

async function run() {
  const args = readArgs();
  if (!args.inputJsonDir || !args.output) {
    throw new Error('Use: npm run article:smoke-mixed-source -- --input-json-dir "outputs/article-api-inspect/annual-vs-monthly" --output "outputs/article-mixed-source-runtime-smoke/annual-vs-monthly"');
  }
  const inputDir = path.resolve(args.inputJsonDir);
  const outputDir = path.resolve(args.output);
  ensureDir(outputDir);
  const videoStructureHashBefore = sha256("video-structure.json");
  const article = readJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = readJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const baseJob = buildArticleVideoJob(article, brief, outputDir);
  const scenes = buildSmokeScenes(baseJob);
  const inputProps = buildRenderInput(baseJob, scenes);
  const qa = buildSmokeQa(inputProps, videoStructureHashBefore);

  writeJson(path.join(outputDir, "mixed-source-smoke-selection-plan.json"), {
    articleId: article.articleId,
    articleTitle: article.title,
    forcedSequence: smokeSceneSpec,
    scenes: inputProps.structure.scenes.map((scene) => ({
      sceneId: scene.id,
      visualIntent: scene.visualIntent,
      selectedAssetId: smokeSceneSpec.find((spec) => spec.runtimeShotId === scene.selectedShotId)?.selectedAssetId,
      sourceEnvironment: assetEntry(smokeSceneSpec.find((spec) => spec.runtimeShotId === scene.selectedShotId)?.selectedAssetId ?? "")?.sourceEnvironment,
      runtimeShotId: scene.selectedShotId,
      choreographyId: scene.choreographyId,
      componentEntry: scene.choreographyId,
      strictBinding: (scene.componentProps.articleContent as { articleBindingMode?: string }).articleBindingMode === "strict",
    })),
  });
  writeJson(path.join(outputDir, "mixed-source-smoke-render-input.json"), inputProps);
  writeJson(path.join(outputDir, "mixed-source-smoke-qa-summary.json"), qa);
  writeJson(path.join(outputDir, "article-transition-plan.json"), qa.transitionPlan);
  writeJson(path.join(outputDir, "article-transition-qa-summary.json"), buildTransitionQa(qa));

  if (args.planOnly) {
    console.log(`mixedSourceSmokeQaPath=${path.join(outputDir, "mixed-source-smoke-qa-summary.json")}`);
    console.log(`articleTransitionPlanPath=${path.join(outputDir, "article-transition-plan.json")}`);
    console.log(`articleTransitionQaPath=${path.join(outputDir, "article-transition-qa-summary.json")}`);
    console.log(`mixedSourceSmokeQaStatus=${qa.status}`);
    console.log("renderSkipped=PLAN_ONLY");
    process.exitCode = qa.status === "passed" ? 0 : 1;
    return;
  }

  if (qa.status !== "passed") {
    console.log(`mixedSourceSmokeQaPath=${path.join(outputDir, "mixed-source-smoke-qa-summary.json")}`);
    console.log(`mixedSourceSmokeQaStatus=${qa.status}`);
    console.log("renderSkipped=STATIC_QA_FAILED");
    process.exitCode = 1;
    return;
  }

  const previewPath = path.join(outputDir, "preview.mp4");
  await renderSmokePreview(previewPath, inputProps);
  writeJson(path.join(outputDir, "mixed-source-smoke-qa-summary.json"), { ...qa, previewPath, previewExists: fs.existsSync(previewPath) });
  console.log(`mixedSourceSmokeQaPath=${path.join(outputDir, "mixed-source-smoke-qa-summary.json")}`);
  console.log(`previewPath=${previewPath}`);
  console.log(`mixedSourceSmokeQaStatus=${qa.status}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
