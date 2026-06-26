import path from "path";
import type { StoryboardScene } from "../ai/generateStoryboard";
import { getShot } from "../../assets/index/asset-resolver";
import { planResolvedScenesWithShots, type ResolvedScene } from "../factory/shotPlanner";
import type { PlannedScene } from "../factory/videoVariantPlanner";
import { getDefaultCompositionSpec } from "../remotion/runtimeStructure";
import {
  articleVisualPolicy,
  bindPolicyText,
  planArticleVisualPolicy,
  type ArticlePolicyDebug,
  type ArticlePolicyScenePlan,
  type ArticlePolicyTextBinding,
  type ArticlePolicyWarning,
  type ArticleVisualIntent,
} from "./articleVisualPolicy";
import type {
  ArticleContentBrief,
  ArticleInput,
  ArticleSceneComponentProps,
  ArticleSceneSchedule,
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
  preferredRuntimeShotId?: "shot_01" | "shot_15" | "shot_51";
  evidenceIds?: string[];
  visualIntentKey: ArticleVisualIntent;
  policyWarnings: ArticlePolicyWarning[];
  policyBindings: Pick<ArticlePolicyScenePlan, "headline" | "supportingText" | "recommendationTitle" | "recommendationItems" | "stepItems" | "cta">;
};

function dedupe<T>(items: T[]) {
  return [...new Set(items)];
}

function clean(value: string, max = 88) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 3).trim()}...` : normalized;
}

function cleanSentences(values: string[]) {
  return values.map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function paragraphEvidence(evidence: EvidenceItem[], kinds: EvidenceItem["kind"][]) {
  return evidence.filter((item) => kinds.includes(item.kind) && item.videoEligible);
}

function structuredEvidence(brief: ArticleContentBrief) {
  return brief.evidence.filter((item) =>
    item.videoEligible &&
    (item.valueType === "currency" ||
      item.valueType === "percentage" ||
      item.valueType === "date" ||
      item.valueType === "count" ||
      item.valueType === "duration"),
  );
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

function articleWarningsMessage(warnings: ArticlePolicyWarning[]) {
  return warnings.map((warning) => warning.message);
}

function recommendationBindings(article: ArticleInput, brief: ArticleContentBrief, evidenceIds: string[]) {
  const sceneEvidence = toSceneEvidence(brief, evidenceIds);
  const stepBindings = orderedSteps(article).map((step, index) =>
    bindPolicyText({
      value: step,
      maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
      sourceField: `article.sections.orderedSteps[${index}]`,
      sourceExcerpt: step,
    }),
  );
  const keyPointBindings = brief.keyPoints.map((point, index) =>
    bindPolicyText({
      value: point,
      maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
      sourceField: `contentBrief.keyPoints[${index}]`,
      sourceExcerpt: point,
    }),
  );
  const evidenceBindings = sceneEvidence.map((item) =>
    bindPolicyText({
      value: item.evidenceText,
      maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
      sourceField: "contentBrief.evidence.sourceExcerpt",
      sourceExcerpt: item.evidenceText,
      sourceEvidenceId: item.evidenceId,
    }),
  );

  const byValue = new Map<string, ArticlePolicyTextBinding>();
  [...stepBindings, ...keyPointBindings, ...evidenceBindings].forEach((binding) => {
    if (!byValue.has(binding.value)) byValue.set(binding.value, binding);
  });

  return [...byValue.values()].slice(0, articleVisualPolicy.textDensity.maxRecommendationItems);
}

function stepBindings(article: ArticleInput, brief: ArticleContentBrief, evidenceIds: string[]) {
  const sceneEvidence = toSceneEvidence(brief, evidenceIds);
  const sectionStepBindings = orderedSteps(article).map((step, index) =>
    bindPolicyText({
      value: step,
      maxCharacters: articleVisualPolicy.textDensity.maxStepTitleCharacters,
      sourceField: `article.sections.orderedSteps[${index}]`,
      sourceExcerpt: step,
    }),
  );
  const evidenceBindings = sceneEvidence
    .filter((item) => item.evidenceText.length > 1)
    .map((item) =>
      bindPolicyText({
        value: item.evidenceText,
        maxCharacters: articleVisualPolicy.textDensity.maxStepTitleCharacters,
        sourceField: "contentBrief.evidence.sourceExcerpt",
        sourceExcerpt: item.evidenceText,
        sourceEvidenceId: item.evidenceId,
      }),
    );

  const byValue = new Map<string, ArticlePolicyTextBinding>();
  [...sectionStepBindings, ...evidenceBindings].forEach((binding) => {
    if (!byValue.has(binding.value)) byValue.set(binding.value, binding);
  });

  return [...byValue.values()].slice(0, articleVisualPolicy.textDensity.maxStepItems);
}

function shouldUseStructuredScene(bindings: ArticlePolicyTextBinding[], article: ArticleInput, brief: ArticleContentBrief) {
  const orderedStepCount = orderedSteps(article).length;
  if (orderedStepCount < 2) {
    return { allowed: false, reason: "Article does not contain enough canonical ordered steps." };
  }
  if (bindings.length < 2) {
    return { allowed: false, reason: "No readable structured step items remain after policy fitting." };
  }
  const numericEvidenceCount = structuredEvidence(brief).length;
  const compactedSteps = bindings.filter((binding) => binding.compacted).length;
  const tinyBindings = bindings.filter((binding) => binding.finalCharacters <= 2).length;
  if (numericEvidenceCount === 0 && compactedSteps === bindings.length) {
    return { allowed: false, reason: "Structured scene would compress every step without traceable numeric support." };
  }
  if (compactedSteps > 0 || tinyBindings > 0) {
    return { allowed: false, reason: "Structured scene would force compact or tiny dashboard labels." };
  }
  return { allowed: true };
}

function articleSceneProps(scene: ResolvedScene, article: ArticleInput, brief: ArticleContentBrief): ArticleSceneComponentProps {
  const selectedEvidence = toSceneEvidence(brief, scene.selectedEvidenceIds ?? []);
  const firstEvidence = selectedEvidence[0];
  const warnings =
    scene.componentProps && typeof scene.componentProps === "object" && "policyWarnings" in scene.componentProps
      ? ((scene.componentProps.policyWarnings as string[]) ?? [])
      : [];
  const base: ArticleSceneComponentProps = {
    contentSource: "article",
    articleId: article.articleId,
    headline: scene.headline,
    supportingText: scene.supportingText,
    shortLabel: scene.sceneType === "coverHook" ? clean(article.title, 18) : clean(brief.keyPoints[0] ?? article.title, 18),
    evidenceId: firstEvidence?.evidenceId,
    evidenceText: firstEvidence?.evidenceText,
    ctaText: article.cta?.text,
    ctaUrl: article.cta?.url,
    visualIntent: scene.visualIntent,
    selectedEvidence,
    headlineSource: scene.sceneType === "coverHook" ? "article.title" : "contentBrief.keyPoints",
    supportingTextSource: scene.sceneType === "coverHook" ? "article.summary" : "contentBrief.summary",
    contentIntent:
      scene.componentProps && typeof scene.componentProps === "object" && "contentIntent" in scene.componentProps
        ? String(scene.componentProps.contentIntent)
        : undefined,
    policyWarnings: warnings,
  };

  if (scene.selectedShotId === "shot_51") {
    const recommendationItems =
      scene.componentProps && typeof scene.componentProps === "object" && "policyRecommendationItems" in scene.componentProps
        ? ((scene.componentProps.policyRecommendationItems as string[]) ?? [])
        : [];
    return {
      ...base,
      recommendationTitle: scene.headline,
      recommendationItems,
    };
  }

  if (scene.selectedShotId === "shot_15") {
    const stepItems =
      scene.componentProps && typeof scene.componentProps === "object" && "policyStepItems" in scene.componentProps
        ? ((scene.componentProps.policyStepItems as string[]) ?? [])
        : [];
    return {
      ...base,
      stepItems,
    };
  }

  return base;
}

function shotPreferredDurationSeconds(shotId: "shot_01" | "shot_15" | "shot_51") {
  const shot = getShot(shotId);
  const preferredFrames = shot.duration_frames?.preferred ?? shot.choreography?.durationFrames?.preferred;
  if (!preferredFrames) {
    throw new Error(`Shot ${shotId} has no preferred duration_frames in the certified registry.`);
  }
  return preferredFrames / articleVideoSpec.fps;
}

function baseScene(
  id: number,
  shotId: "shot_01" | "shot_15" | "shot_51",
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

function buildHookScene(article: ArticleInput, brief: ArticleContentBrief): ArticlePlannedScene {
  const warnings: ArticlePolicyWarning[] = [];
  const headlineBinding = bindPolicyText({
    value: article.title || brief.coreMessage,
    maxCharacters: articleVisualPolicy.textDensity.maxHookHeadlineCharacters,
    sourceField: "article.title",
    sourceExcerpt: article.title || brief.coreMessage,
  });
  const supportBinding = bindPolicyText({
    value: article.summary || brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: "article.summary",
    sourceExcerpt: article.summary || brief.summary,
  });
  if (headlineBinding.compacted) {
    warnings.push({ code: "TEXT_COMPACTED", sceneId: 1, message: "Hook headline was compacted to fit policy." });
  }
  if (supportBinding.compacted) {
    warnings.push({ code: "TEXT_COMPACTED", sceneId: 1, message: "Hook supporting text was compacted to fit policy." });
  }
  return {
    ...baseScene(
      1,
      "shot_01",
      "hook",
      [headlineBinding.value, supportBinding.value],
      "clean opener",
    ),
    sourceType: "article",
    sceneType: "coverHook",
    visualTemplate: "websiteHero",
    preferredRuntimeShotId: "shot_01",
    evidenceIds: paragraphEvidence(brief.evidence, ["fact", "quote", "comparison"]).slice(0, 2).map((item) => item.evidenceId),
    dataFocus: brief.keyPoints.slice(0, 3).map((point) => clean(point, 18)),
    componentProps: {
      contentIntent: "hook",
      policyWarnings: articleWarningsMessage(warnings),
    },
    visualIntentKey: "hook",
    policyWarnings: warnings,
    policyBindings: {
      headline: headlineBinding,
      supportingText: supportBinding,
    },
  };
}

function buildRecommendationScene(article: ArticleInput, brief: ArticleContentBrief): ArticlePlannedScene {
  const warnings: ArticlePolicyWarning[] = [];
  const recommendationEvidence = paragraphEvidence(brief.evidence, ["instruction", "fact", "quote"]).slice(0, 3);
  const recommendationTitleBinding = bindPolicyText({
    value: brief.coreMessage,
    maxCharacters: articleVisualPolicy.textDensity.maxRecommendationTitleCharacters,
    sourceField: "contentBrief.coreMessage",
    sourceExcerpt: brief.coreMessage,
  });
  const supportBinding = bindPolicyText({
    value: brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: "contentBrief.summary",
    sourceExcerpt: brief.summary,
  });
  const itemBindings = recommendationBindings(article, brief, recommendationEvidence.map((item) => item.evidenceId));
  if (recommendationTitleBinding.compacted) {
    warnings.push({ code: "TEXT_COMPACTED", sceneId: 2, message: "Recommendation title was compacted to fit policy." });
  }
  if (itemBindings.length < recommendationEvidence.length) {
    warnings.push({ code: "RECOMMENDATION_ITEMS_REDUCED", sceneId: 2, message: "Recommendation items were reduced to fit policy." });
  }
  return {
    ...baseScene(
      2,
      "shot_51",
      "recommendation",
      [recommendationTitleBinding.value, supportBinding.value],
      "recommendation reveal",
    ),
    sourceType: "article",
    sceneType: "aiRecommendation",
    visualTemplate: "recommendationPanel",
    preferredRuntimeShotId: "shot_51",
    evidenceIds: recommendationEvidence.map((item) => item.evidenceId),
    dataFocus: itemBindings.map((binding) => binding.value),
    componentProps: {
      articleId: article.articleId,
      evidenceIds: recommendationEvidence.map((item) => item.evidenceId),
      contentIntent: "recommendation",
      policyWarnings: articleWarningsMessage(warnings),
      policyRecommendationItems: itemBindings.map((binding) => binding.value),
    },
    visualIntentKey: "recommendation",
    policyWarnings: warnings,
    policyBindings: {
      headline: recommendationTitleBinding,
      supportingText: supportBinding,
      recommendationTitle: recommendationTitleBinding,
      recommendationItems: itemBindings,
      cta: article.cta?.text
        ? bindPolicyText({
            value: article.cta.text,
            maxCharacters: articleVisualPolicy.textDensity.maxCtaCharacters,
            sourceField: "article.cta.text",
            sourceExcerpt: article.cta.text,
          })
        : undefined,
    },
  };
}

function buildStructuredInfoScene(article: ArticleInput, brief: ArticleContentBrief) {
  const sceneEvidence = [...structuredEvidence(brief), ...paragraphEvidence(brief.evidence, ["instruction", "comparison"])].slice(0, 4);
  const bindings = stepBindings(article, brief, sceneEvidence.map((item) => item.evidenceId));
  const warnings: ArticlePolicyWarning[] = [];
  const structuredDecision = shouldUseStructuredScene(bindings, article, brief);
  if (!structuredDecision.allowed) {
    warnings.push({
      code: "STRUCTURED_SCENE_UNSUITABLE",
      sceneId: 3,
      message: structuredDecision.reason ?? "Structured article scene is unsuitable under the current article visual policy.",
    });
  }
  if (bindings.length < articleVisualPolicy.textDensity.maxStepItems) {
    warnings.push({ code: "STEP_ITEMS_REDUCED", sceneId: 3, message: "Step items were reduced to fit policy." });
  }
  if (sceneEvidence.length === 0 || !structuredDecision.allowed) {
    return {
      scene: undefined,
      debug: {
        sceneId: 3,
        visualIntent: "step_flow" as const,
        warnings,
        stepItems: bindings,
        selectedEvidenceIds: [],
        rejectedEvidenceIds: sceneEvidence.map((item) => item.evidenceId),
      } satisfies Partial<ArticlePolicyScenePlan>,
    };
  }

  const headlineBinding = bindPolicyText({
    value: brief.keyPoints[1] ?? "Structured evidence",
    maxCharacters: articleVisualPolicy.textDensity.maxHookHeadlineCharacters,
    sourceField: "contentBrief.keyPoints[1]",
    sourceExcerpt: brief.keyPoints[1] ?? "Structured evidence",
  });
  const supportBinding = bindPolicyText({
    value: brief.keyPoints[2] ?? brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: brief.keyPoints[2] ? "contentBrief.keyPoints[2]" : "contentBrief.summary",
    sourceExcerpt: brief.keyPoints[2] ?? brief.summary,
  });
  return {
    scene: {
      ...baseScene(
        3,
        "shot_15",
        "step_flow",
        [headlineBinding.value, supportBinding.value],
        "structured info hold",
      ),
      sourceType: "article",
      sceneType: "appGrid",
      visualTemplate: "appGrid",
      preferredRuntimeShotId: "shot_15",
      dataFocus: bindings.map((binding) => binding.value),
      evidenceIds: sceneEvidence.map((item) => item.evidenceId),
      componentProps: {
        evidenceIds: sceneEvidence.map((item) => item.evidenceId),
        contentIntent: "step_flow",
        policyWarnings: articleWarningsMessage(warnings),
        policyStepItems: bindings.map((binding) => binding.value),
      },
      visualIntentKey: "step_flow",
      policyWarnings: warnings,
      policyBindings: {
        headline: headlineBinding,
        supportingText: supportBinding,
        stepItems: bindings,
      },
    } satisfies ArticlePlannedScene,
    debug: {
      sceneId: 3,
      visualIntent: "step_flow",
      warnings,
      headline: headlineBinding,
      supportingText: supportBinding,
      stepItems: bindings,
      selectedEvidenceIds: sceneEvidence.map((item) => item.evidenceId),
      rejectedEvidenceIds: [],
    } satisfies Partial<ArticlePolicyScenePlan>,
  };
}

function buildSafeEndScene(article: ArticleInput, brief: ArticleContentBrief): ArticlePlannedScene {
  const warnings: ArticlePolicyWarning[] = [
    {
      code: "SAFE_END_ENABLED",
      sceneId: 99,
      message: "Policy enabled a safe ending scene to keep duration within the approved window.",
    },
  ];
  const ctaText = article.cta?.text ?? "Safe ending";
  const headlineBinding = bindPolicyText({
    value: ctaText,
    maxCharacters: articleVisualPolicy.textDensity.maxCtaCharacters,
    sourceField: article.cta?.text ? "article.cta.text" : "contentBrief.summary",
    sourceExcerpt: ctaText,
  });
  const supportBinding = bindPolicyText({
    value: article.cta?.url ?? brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: article.cta?.url ? "article.cta.url" : "contentBrief.summary",
    sourceExcerpt: article.cta?.url ?? brief.summary,
  });

  return {
    ...baseScene(
      4,
      "shot_51",
      "safe_end",
      [headlineBinding.value, supportBinding.value],
      "safe ending hold",
    ),
    sourceType: "article",
    sceneType: "aiRecommendation",
    visualTemplate: "recommendationPanel",
    preferredRuntimeShotId: "shot_51",
    evidenceIds: [],
    dataFocus: brief.keyPoints.slice(0, 2).map((point) => clean(point, articleVisualPolicy.textDensity.maxRecommendationItemCharacters)),
    componentProps: {
      articleId: article.articleId,
      evidenceIds: [],
      contentIntent: "safe_end",
      policyWarnings: articleWarningsMessage(warnings),
      policyRecommendationItems: brief.keyPoints
        .slice(0, 2)
        .map((point, index) =>
          bindPolicyText({
            value: point,
            maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
            sourceField: `contentBrief.keyPoints[${index}]`,
            sourceExcerpt: point,
          }).value,
        ),
    },
    visualIntentKey: "safe_end",
    policyWarnings: warnings,
    policyBindings: {
      headline: headlineBinding,
      supportingText: supportBinding,
      cta: article.cta?.text
        ? bindPolicyText({
            value: article.cta.text,
            maxCharacters: articleVisualPolicy.textDensity.maxCtaCharacters,
            sourceField: "article.cta.text",
            sourceExcerpt: article.cta.text,
          })
        : undefined,
      recommendationItems: brief.keyPoints.slice(0, 2).map((point, index) =>
        bindPolicyText({
          value: point,
          maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
          sourceField: `contentBrief.keyPoints[${index}]`,
          sourceExcerpt: point,
        }),
      ),
    },
  };
}

function enrichResolvedScenes(scenes: ResolvedScene[], article: ArticleInput, brief: ArticleContentBrief) {
  return scenes.map((scene) => ({
    ...scene,
    componentProps: {
      ...scene.componentProps,
      sourceType: "article",
      articleId: article.articleId,
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
      articleContent: articleSceneProps(scene, article, brief),
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
      choreographyId: scene.choreographyId,
      startFrame,
      durationInFrames,
      endFrame: startFrame + durationInFrames,
    };
  });
}

export function buildArticleVideoJob(article: ArticleInput, contentBrief: ArticleContentBrief, outputDirectory: string): ArticleVideoJob {
  const policyPlan = planArticleVisualPolicy(article, contentBrief, articleVideoSpec);
  const structuredInfo = buildStructuredInfoScene(article, contentBrief);
  const plannedScenes = [buildHookScene(article, contentBrief), buildRecommendationScene(article, contentBrief), structuredInfo.scene].filter(
    Boolean,
  ) as ArticlePlannedScene[];

  const projectedFrames = plannedScenes.reduce((sum, scene) => sum + Math.round(scene.duration * articleVideoSpec.fps), 0);
  if (projectedFrames / articleVideoSpec.fps < articleVisualPolicy.globalRhythm.minDurationSeconds) {
    plannedScenes.push(buildSafeEndScene(article, contentBrief));
  }

  const policyWarnings = [
    ...plannedScenes.flatMap((scene) => scene.policyWarnings),
    ...(!structuredInfo.scene ? structuredInfo.debug?.warnings ?? [] : []),
  ];
  const shotPlan = planResolvedScenesWithShots(plannedScenes, {
    fps: articleVideoSpec.fps,
    profile: "default-promo",
    narrativeId: "comparison",
  });

  const resolvedScenes = enrichResolvedScenes(shotPlan.scenes, article, contentBrief);
  const remotionScenes = resolvedScenes.map(toRemotionScene);
  const sceneSchedule = buildSceneSchedule(resolvedScenes);
  const selectedEvidenceIds = dedupe(plannedScenes.flatMap((scene) => scene.evidenceIds ?? []));
  const actualDurationFrames = sceneSchedule.reduce((sum, scene) => sum + scene.durationInFrames, 0);
  const actualDurationSeconds = actualDurationFrames / articleVideoSpec.fps;
  const jobId = `${article.articleId}_preview_job`;

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
    resolvedScenes,
    policyDebug: {
      ...policyPlan.debug,
      policyWarnings: [...policyPlan.debug.policyWarnings, ...policyWarnings],
    } satisfies ArticlePolicyDebug as unknown as Record<string, unknown>,
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
          selectedEvidenceIds,
          selectedShotIds: dedupe(resolvedScenes.map((scene) => scene.selectedShotId).filter(Boolean) as string[]),
          selectedChoreographyIds: dedupe(resolvedScenes.map((scene) => scene.choreographyId).filter(Boolean) as string[]),
          policyWarnings: articleWarningsMessage(policyWarnings),
        },
      },
    },
    outputDirectory: path.resolve(outputDirectory),
  };
}
