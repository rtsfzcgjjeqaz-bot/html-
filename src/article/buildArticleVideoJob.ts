import path from "path";
import type { StoryboardScene } from "../ai/generateStoryboard";
import { getShot } from "../../assets/index/asset-resolver";
import { planResolvedScenesWithShots, type ResolvedScene } from "../factory/shotPlanner";
import { getRuntimeShotCatalogEntry, type RuntimeShotId } from "../factory/runtimeShotCatalog";
import type { PlannedScene } from "../factory/videoVariantPlanner";
import { getDefaultCompositionSpec } from "../remotion/runtimeStructure";
import {
  bindPolicyText,
  planArticleVisualPolicy,
  type ArticlePolicyScenePlan,
  type ArticlePolicyTextBinding,
  type ArticlePolicyWarning,
} from "./articleVisualPolicy";
import {
  buildArticleRuntimeSelectionPlan,
  type ArticleRuntimeSelectionPlan,
  type ArticleRuntimeSelectionPlanScene,
} from "./articleRuntimeAdapter";
import { buildArticleVisibleCopyPlan } from "./articleVisibleCopyPlan";
import type { ShotSelectionPlan } from "../library/shotSelectionTypes";
import type {
  ArticleContentBrief,
  ArticleInput,
  ArticleSceneComponentProps,
  ArticleSceneSchedule,
  ArticleVisibleCopyScenePlan,
  ArticleVideoJob,
  ArticleVideoSpec,
  EvidenceItem,
} from "./types";

const articleVideoSpec: ArticleVideoSpec = {
  profileId: "article-landscape-preview-v1",
  purpose: "\u7f51\u7ad9\u6587\u7ae0\u6a2a\u7248\u77ed\u89c6\u9891\u9884\u89c8",
  aspectRatio: "16:9",
  previewWidth: getDefaultCompositionSpec().width,
  previewHeight: getDefaultCompositionSpec().height,
  fps: getDefaultCompositionSpec().fps,
  targetDurationSeconds: 12,
  minDurationSeconds: 10,
  maxDurationSeconds: 14,
  audioMode: "none",
  autoTts: false,
  autoBgm: false,
  outputMode: "preview",
};

type ArticlePlannedScene = PlannedScene & {
  sourceType: "article";
  preferredRuntimeShotId?: RuntimeShotId;
  evidenceIds?: string[];
  visualIntentKey: ArticleRuntimeSelectionPlanScene["visualIntent"];
  policyWarnings: string[];
  policyBindings: Pick<ArticlePolicyScenePlan, "headline" | "supportingText" | "recommendationTitle" | "recommendationItems" | "stepItems" | "cta">;
};

function dedupe<T>(items: T[]) {
  return [...new Set(items)];
}

function clean(value: string, max = 88) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > max ? normalized : normalized;
}

function cleanSentences(values: string[]) {
  return values.map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function evidenceById(brief: ArticleContentBrief) {
  return new Map(brief.evidence.map((item) => [item.evidenceId, item]));
}

function toSceneEvidence(brief: ArticleContentBrief, evidenceIds: string[]) {
  const lookup = evidenceById(brief);
  return evidenceIds
    .map((evidenceId) => lookup.get(evidenceId))
    .filter((item): item is EvidenceItem => Boolean(item))
    .map((item) => ({
      evidenceId: item.evidenceId,
      evidenceText: clean(item.sourceExcerpt, 140),
      sourceLocation: item.sourceLocation,
    }));
}

function orderedSteps(article: ArticleInput) {
  return cleanSentences(article.sections.flatMap((section) => section.orderedSteps ?? []));
}

function evidenceRows(brief: ArticleContentBrief, evidenceIds: string[]) {
  return toSceneEvidence(brief, evidenceIds).map((item) => clean(item.evidenceText, 42)).slice(0, 3);
}

function textValue(binding?: ArticlePolicyTextBinding) {
  return binding?.value;
}

function warningMessages(scene: ArticlePolicyScenePlan, runtimeScene: ArticleRuntimeSelectionPlanScene) {
  return [
    ...scene.warnings.map((warning) => warning.message),
    ...(runtimeScene.fallbackReason ? [runtimeScene.fallbackReason] : []),
  ];
}

function shotPreferredDurationSeconds(shotId: RuntimeShotId) {
  const shot = getShot(shotId);
  const preferredFrames = shot.duration_frames?.preferred ?? shot.choreography?.durationFrames?.preferred;
  if (!preferredFrames) {
    throw new Error(`Shot ${shotId} has no preferred duration_frames in the certified registry.`);
  }
  return preferredFrames / articleVideoSpec.fps;
}

function baseScene(
  id: number,
  shotId: RuntimeShotId,
  visualIntent: string,
  textOverlay: string[],
  audioCue: string,
): StoryboardScene {
  return {
    id,
    duration: shotPreferredDurationSeconds(shotId),
    hookType: id === 1 ? "pattern_interrupt" : "curiosity",
    camera: { shot: id === 1 ? "close" : "medium", motion: id === 1 ? "zoom" : "static" },
    visualIntent,
    textOverlay,
    assets: {
      image: [],
      fallback: "ai_generated",
    },
    audioCue,
  };
}

function sceneTitle(scene: ArticlePolicyScenePlan, brief: ArticleContentBrief) {
  return (
    textValue(scene.headline) ??
    textValue(scene.recommendationTitle) ??
    textValue(scene.cta) ??
    brief.coreMessage
  );
}

function sceneSupport(scene: ArticlePolicyScenePlan, brief: ArticleContentBrief) {
  return (
    textValue(scene.supportingText) ??
    bindPolicyText({
      value: brief.summary,
      maxCharacters: 34,
      sourceField: "contentBrief.summary",
      sourceExcerpt: brief.summary,
    }).value
  );
}

function selectionDataFocus(
  policyScene: ArticlePolicyScenePlan,
  runtimeScene: ArticleRuntimeSelectionPlanScene,
  article: ArticleInput,
  brief: ArticleContentBrief,
) {
  if (runtimeScene.visualIntent === "step_flow" || runtimeScene.visualIntent === "checklist") {
    return (policyScene.stepItems ?? []).map((item) => item.value).slice(0, 4);
  }
  if (runtimeScene.visualIntent === "recommendation" || runtimeScene.selectedRuntimeShotId === "shot_51" || runtimeScene.selectedRuntimeShotId === "shot_30") {
    const rows = (policyScene.recommendationItems ?? []).map((item) => item.value);
    return (rows.length ? rows : brief.keyPoints).slice(0, 3);
  }
  if (runtimeScene.visualIntent === "price_comparison" || runtimeScene.visualIntent === "result_metric" || runtimeScene.visualIntent === "evidence") {
    const rows = evidenceRows(brief, policyScene.selectedEvidenceIds);
    return (rows.length ? rows : brief.keyPoints).slice(0, 3);
  }
  if (runtimeScene.visualIntent === "reason") {
    return (evidenceRows(brief, policyScene.selectedEvidenceIds).length ? evidenceRows(brief, policyScene.selectedEvidenceIds) : brief.keyPoints).slice(0, 3);
  }
  if (runtimeScene.visualIntent === "hook") {
    return brief.keyPoints.slice(0, 3).map((point) => clean(point, 18));
  }
  return orderedSteps(article).slice(0, 3);
}

function componentPropsForSelection(
  policyScene: ArticlePolicyScenePlan,
  runtimeScene: ArticleRuntimeSelectionPlanScene,
  article: ArticleInput,
  brief: ArticleContentBrief,
) {
  const selectedEvidence = toSceneEvidence(brief, policyScene.selectedEvidenceIds);
  const recommendationItems = (policyScene.recommendationItems ?? []).map((item) => item.value);
  const stepItems = (policyScene.stepItems ?? []).map((item) => item.value);
  return {
    articleId: article.articleId,
    articleBindingMode: "strict",
    articleBindingRequired: true,
    evidenceIds: policyScene.selectedEvidenceIds,
    contentIntent: runtimeScene.visualIntent,
    policyWarnings: warningMessages(policyScene, runtimeScene),
    policyRecommendationItems: recommendationItems.length ? recommendationItems : undefined,
    policyStepItems: stepItems.length ? stepItems : undefined,
    selectedEvidence,
  } satisfies Record<string, unknown>;
}

function buildPlannedSceneFromSelection(
  policyScene: ArticlePolicyScenePlan,
  runtimeScene: ArticleRuntimeSelectionPlanScene,
  article: ArticleInput,
  brief: ArticleContentBrief,
): ArticlePlannedScene | undefined {
  const runtimeShotId = runtimeScene.selectedRuntimeShotId;
  const selectedChoreographyId = runtimeScene.selectedChoreographyId;
  if (!runtimeShotId || !selectedChoreographyId) return undefined;

  const catalogEntry = getRuntimeShotCatalogEntry(runtimeShotId);
  if (!catalogEntry) {
    throw new Error(`Runtime catalog entry missing for ${runtimeShotId}.`);
  }

  const headline = sceneTitle(policyScene, brief);
  const supportingText = sceneSupport(policyScene, brief);
  const audioCue = runtimeScene.visualIntent.replace(/_/g, " ");
  const dataFocus = selectionDataFocus(policyScene, runtimeScene, article, brief);
  const textOverlay = [headline, supportingText].filter(Boolean).slice(0, 2);

  return {
    ...baseScene(policyScene.sceneId, runtimeShotId, runtimeScene.visualIntent, textOverlay, audioCue),
    sourceType: "article",
    sceneType: catalogEntry.sceneType,
    visualTemplate: catalogEntry.visualType as PlannedScene["visualTemplate"],
    preferredRuntimeShotId: runtimeShotId,
    evidenceIds: policyScene.selectedEvidenceIds,
    dataFocus,
    componentProps: componentPropsForSelection(policyScene, runtimeScene, article, brief),
    visualIntentKey: runtimeScene.visualIntent,
    policyWarnings: warningMessages(policyScene, runtimeScene),
    policyBindings: {
      headline: policyScene.headline,
      supportingText: policyScene.supportingText,
      recommendationTitle: policyScene.recommendationTitle,
      recommendationItems: policyScene.recommendationItems,
      stepItems: policyScene.stepItems,
      cta: policyScene.cta,
    },
  };
}

function articleSceneProps(
  scene: ResolvedScene,
  article: ArticleInput,
  brief: ArticleContentBrief,
  visibleCopyPlan: ArticleVisibleCopyScenePlan | undefined,
): ArticleSceneComponentProps {
  const selectedEvidence = toSceneEvidence(brief, scene.selectedEvidenceIds ?? []);
  const firstEvidence = selectedEvidence[0];
  const warnings =
    scene.componentProps && typeof scene.componentProps === "object" && "policyWarnings" in scene.componentProps
      ? ((scene.componentProps.policyWarnings as string[]) ?? [])
      : [];

  const base: ArticleSceneComponentProps = {
    contentSource: "article",
    articleId: article.articleId,
    articleBindingMode: "strict",
    articleBindingRequired: true,
    headline: visibleCopyPlan?.headline?.value,
    supportingText: visibleCopyPlan?.supportingText?.value,
    shortLabel: visibleCopyPlan?.shortLabel?.value,
    evidenceId: firstEvidence?.evidenceId ?? visibleCopyPlan?.selectedEvidenceIds[0],
    evidenceText: visibleCopyPlan?.evidenceCaption?.value ?? firstEvidence?.evidenceText,
    ctaText: article.cta?.text,
    ctaUrl: article.cta?.url,
    visualIntent: scene.visualIntent,
    selectedEvidence,
    headlineSource: visibleCopyPlan?.headline?.sourceField,
    supportingTextSource: visibleCopyPlan?.supportingText?.sourceField,
    contentIntent:
      scene.componentProps && typeof scene.componentProps === "object" && "contentIntent" in scene.componentProps
        ? String(scene.componentProps.contentIntent)
        : undefined,
    policyWarnings: warnings,
    visibleCopyPlan,
  };

  const recommendationItems = (visibleCopyPlan?.recommendationItems ?? [])
    .filter((item) => item.displayMode !== "skipped" && item.value)
    .map((item) => item.value);
  const stepItems = (visibleCopyPlan?.stepItems ?? [])
    .filter((item) => item.displayMode !== "skipped" && item.value)
    .map((item) => item.value);

  if (recommendationItems.length || visibleCopyPlan?.recommendationTitle?.value) {
    return {
      ...base,
      recommendationTitle: visibleCopyPlan?.recommendationTitle?.value ?? base.headline,
      recommendationItems,
    };
  }

  if (stepItems.length) {
    return {
      ...base,
      stepItems,
    };
  }

  return base;
}

function enrichResolvedScenes(
  scenes: ResolvedScene[],
  article: ArticleInput,
  brief: ArticleContentBrief,
  visibleCopyPlan: ArticleVisibleCopyScenePlan[],
) {
  return scenes.map((scene) => ({
    ...scene,
    componentProps: {
      ...scene.componentProps,
      sourceType: "article",
      articleId: article.articleId,
      articleBindingMode: "strict",
      articleBindingRequired: true,
      evidenceIds: scene.selectedEvidenceIds ?? [],
      factConstraints: brief.factConstraints,
      contentIntent:
        scene.componentProps && typeof scene.componentProps === "object" && "contentIntent" in scene.componentProps
          ? scene.componentProps.contentIntent
          : undefined,
      policyWarnings:
        scene.componentProps && typeof scene.componentProps === "object" && "policyWarnings" in scene.componentProps
          ? scene.componentProps.policyWarnings
          : [],
      policyRecommendationItems:
        scene.componentProps && typeof scene.componentProps === "object" && "policyRecommendationItems" in scene.componentProps
          ? scene.componentProps.policyRecommendationItems
          : undefined,
      policyStepItems:
        scene.componentProps && typeof scene.componentProps === "object" && "policyStepItems" in scene.componentProps
          ? scene.componentProps.policyStepItems
          : undefined,
      articleContent: articleSceneProps(
        scene,
        article,
        brief,
        visibleCopyPlan.find((item) => item.sceneId === scene.id && item.runtimeShotId === scene.selectedShotId),
      ),
    },
  }));
}

function toRemotionScene(scene: ResolvedScene): ResolvedScene {
  const articleContent =
    scene.componentProps && typeof scene.componentProps === "object" && "articleContent" in scene.componentProps
      ? scene.componentProps.articleContent
      : undefined;

  return {
    id: scene.id,
    duration: scene.duration,
    durationInFrames: scene.durationInFrames,
    hookType: scene.hookType,
    camera: scene.camera,
    visualIntent: scene.visualIntent,
    textOverlay: scene.textOverlay,
    assets: scene.assets,
    audioCue: scene.audioCue,
    sourceType: scene.sourceType,
    sceneType: scene.sceneType,
    dataFocus: scene.dataFocus,
    headline: scene.headline,
    supportingText: scene.supportingText,
    visualType: scene.visualType,
    componentProps: {
      sourceType: scene.sourceType,
      articleId:
        scene.componentProps && typeof scene.componentProps === "object" && "articleId" in scene.componentProps
          ? scene.componentProps.articleId
          : undefined,
      evidenceIds:
        scene.componentProps && typeof scene.componentProps === "object" && "evidenceIds" in scene.componentProps
          ? scene.componentProps.evidenceIds
          : scene.selectedEvidenceIds,
      factConstraints:
        scene.componentProps && typeof scene.componentProps === "object" && "factConstraints" in scene.componentProps
          ? scene.componentProps.factConstraints
          : undefined,
      contentIntent:
        scene.componentProps && typeof scene.componentProps === "object" && "contentIntent" in scene.componentProps
          ? scene.componentProps.contentIntent
          : undefined,
      articleBindingMode:
        scene.componentProps && typeof scene.componentProps === "object" && "articleBindingMode" in scene.componentProps
          ? scene.componentProps.articleBindingMode
          : undefined,
      articleBindingRequired:
        scene.componentProps && typeof scene.componentProps === "object" && "articleBindingRequired" in scene.componentProps
          ? scene.componentProps.articleBindingRequired
          : undefined,
      policyWarnings:
        scene.componentProps && typeof scene.componentProps === "object" && "policyWarnings" in scene.componentProps
          ? scene.componentProps.policyWarnings
          : undefined,
      policyRecommendationItems:
        scene.componentProps && typeof scene.componentProps === "object" && "policyRecommendationItems" in scene.componentProps
          ? scene.componentProps.policyRecommendationItems
          : undefined,
      policyStepItems:
        scene.componentProps && typeof scene.componentProps === "object" && "policyStepItems" in scene.componentProps
          ? scene.componentProps.policyStepItems
          : undefined,
      articleContent,
    },
    selectedShotId: scene.selectedShotId,
    selectedRuntimeKey: scene.selectedRuntimeKey,
    selectedRuntimeSourceKind: scene.selectedRuntimeSourceKind,
    choreographyId: scene.choreographyId,
    motionPresetIds: [],
    visualAssetRefs: [],
    selectedEvidenceIds: scene.selectedEvidenceIds,
  };
}

function buildSceneSchedule(scenes: ResolvedScene[]): ArticleSceneSchedule[] {
  let cursor = 0;
  return scenes.map((scene) => {
    const startFrame = cursor;
    const durationInFrames = scene.durationInFrames;
    cursor += durationInFrames;
    return {
      sceneId: scene.id,
      selectedShotId: scene.selectedShotId,
      selectedRuntimeKey: scene.selectedRuntimeKey,
      choreographyId: scene.choreographyId,
      startFrame,
      durationInFrames,
      endFrame: startFrame + durationInFrames,
    };
  });
}


export function assertArticleRuntimeSelectionComplete(runtimeSelectionPlan: ArticleRuntimeSelectionPlan) {
  const productionBlockingScenes = runtimeSelectionPlan.scenes.filter(
    (scene) => scene.sceneRequiredness === "required" && scene.selectionStatus !== "selected" && scene.selectionStatus !== "safe_fallback",
  );
  if (productionBlockingScenes.length) {
    const codes = productionBlockingScenes.map((scene) => scene.blockedCode ?? "REQUIRED_SCENE_NO_RUNTIME_SHOT").join(",");
    throw new Error(`ArticleVideoJob blocked by incomplete required runtime selection: ${codes}`);
  }
}

export function buildArticleVideoJob(
  article: ArticleInput,
  contentBrief: ArticleContentBrief,
  outputDirectory: string,
  options: { pinnedRuntimeSelectionPlan?: ShotSelectionPlan } = {},
): ArticleVideoJob {
  const policyPlan = planArticleVisualPolicy(article, contentBrief, articleVideoSpec);
  const runtimeSelectionPlan = buildArticleRuntimeSelectionPlan(policyPlan, contentBrief, articleVideoSpec, {
    pinnedRuntimeSelectionPlan: options.pinnedRuntimeSelectionPlan,
  });
  assertArticleRuntimeSelectionComplete(runtimeSelectionPlan);
  const visibleCopyPlan = buildArticleVisibleCopyPlan({
    article,
    brief: contentBrief,
    policyScenes: policyPlan.scenes,
    runtimeScenes: runtimeSelectionPlan.scenes,
  });
  const selectedPlannedScenes = policyPlan.scenes
    .map((scene) => {
      const runtimeScene = runtimeSelectionPlan.scenes.find((item) => item.sceneId === scene.sceneId);
      if (!runtimeScene || (runtimeScene.selectionStatus !== "selected" && runtimeScene.selectionStatus !== "safe_fallback")) return undefined;
      return buildPlannedSceneFromSelection(scene, runtimeScene, article, contentBrief);
    })
    .filter((scene): scene is ArticlePlannedScene => Boolean(scene));

  const shotPlan = planResolvedScenesWithShots(selectedPlannedScenes, {
    fps: articleVideoSpec.fps,
    profile: "default-promo",
    narrativeId: contentBrief.sourceMetadata.pageType === "comparison" ? "comparison" : "trust",
    runtimeSelectionPlan: runtimeSelectionPlan.runtimeSelectionPlan,
  });

  const resolvedScenes = enrichResolvedScenes(shotPlan.scenes, article, contentBrief, visibleCopyPlan);
  const remotionScenes = resolvedScenes.map(toRemotionScene);
  const sceneSchedule = buildSceneSchedule(resolvedScenes);
  const selectedEvidenceIds = dedupe(selectedPlannedScenes.flatMap((scene) => scene.evidenceIds ?? []));
  const actualDurationFrames = sceneSchedule.reduce((sum, scene) => sum + scene.durationInFrames, 0);
  const actualDurationSeconds = actualDurationFrames / articleVideoSpec.fps;
  const jobId = `${article.articleId}_preview_job`;
  const runtimeWarnings = runtimeSelectionPlan.warnings;
  const runtimePolicyWarnings: ArticlePolicyWarning[] = runtimeWarnings.map((message) => ({
    code: "INTENT_NOT_SUPPORTED",
    message,
  }));
  const combinedPolicyWarnings = [...policyPlan.debug.policyWarnings, ...runtimePolicyWarnings];
  const combinedPolicyWarningMessages = combinedPolicyWarnings.map((warning) => warning.message);

  return {
    jobId,
    articleId: article.articleId,
    videoSpec: articleVideoSpec,
    targetDurationFrames: articleVideoSpec.targetDurationSeconds * articleVideoSpec.fps,
    actualDurationFrames,
    actualDurationSeconds,
    sceneSchedule,
    selectedSceneIds: resolvedScenes.map((scene) => scene.id),
    selectedChoreographyIds: dedupe(resolvedScenes.map((scene) => scene.choreographyId).filter(Boolean) as string[]),
    contentBrief,
    selectedEvidenceIds,
    visibleCopyPlan,
    resolvedScenes,
    runtimeSelectionPlan: runtimeSelectionPlan.runtimeSelectionPlan,
    policyDebug: {
      ...policyPlan.debug,
      runtimeSelectionPlan,
      shotPlannerRuntimeSelectionPlan: shotPlan.runtimeSelectionPlan,
      visibleCopyPlan,
      policyWarnings: combinedPolicyWarnings,
    } as Record<string, unknown>,
    remotionInputProps: {
      structure: {
        meta: {
          fps: articleVideoSpec.fps,
          width: articleVideoSpec.previewWidth,
          height: articleVideoSpec.previewHeight,
          durationFrames: actualDurationFrames,
        },
        renderConfig: {
          duration: actualDurationSeconds,
        },
        scenes: remotionScenes,
        articleJob: {
          jobId,
          articleId: article.articleId,
          articleBindingMode: "strict",
          selectedEvidenceIds,
          selectedShotIds: dedupe(resolvedScenes.map((scene) => scene.selectedShotId).filter(Boolean) as string[]),
          selectedRuntimeKeys: dedupe(resolvedScenes.map((scene) => scene.selectedRuntimeKey).filter(Boolean) as string[]),
          selectedChoreographyIds: dedupe(resolvedScenes.map((scene) => scene.choreographyId).filter(Boolean) as string[]),
          policyWarnings: combinedPolicyWarningMessages,
          visibleCopyPlan,
          runtimeSelectionPlan: runtimeSelectionPlan.runtimeSelectionPlan,
        },
      },
    },
    outputDirectory: path.resolve(outputDirectory),
  };
}
