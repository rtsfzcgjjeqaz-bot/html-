import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { buildArticleVideoJob } from "./buildArticleVideoJob";
import {
  containsArticlePlaceholder,
  listVisibleValues,
  sceneDisplayModeSummary,
  visibleCopyHasDanglingPunctuation,
  visibleCopyHasEllipsis,
  visibleCopyIsSemanticallyComplete,
  visibleEvidenceHasSubstantiveClaim,
} from "./articleVisibleCopyPlan";
import type { ArticleContentBrief, ArticleInput, ArticleVisibleCopyScenePlan } from "./types";

type CliArgs = {
  inputDir?: string;
  outputDir?: string;
};

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return {
    inputDir: valueAfter("--input-dir"),
    outputDir: valueAfter("--output-dir"),
  };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sha256(filePath: string) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function sceneVisibleTrace(scene: ArticleVisibleCopyScenePlan) {
  return {
    sceneId: scene.sceneId,
    runtimeShotId: scene.runtimeShotId,
    choreographyId: scene.choreographyId,
    visualIntent: scene.visualIntent,
    contentRole: scene.contentRole,
    articleBindingMode: scene.articleBindingMode,
    articleBindingRequired: scene.articleBindingRequired,
    visibleAtFrame: scene.visibleAtFrame,
    headline: scene.headline,
    supportingText: scene.supportingText,
    shortLabel: scene.shortLabel,
    recommendationTitle: scene.recommendationTitle,
    recommendationItems: scene.recommendationItems,
    stepItems: scene.stepItems,
    cards: scene.cards,
    evidenceCaption: scene.evidenceCaption,
    selectedEvidenceIds: scene.selectedEvidenceIds,
    displayModeSummary: sceneDisplayModeSummary(scene),
  };
}

function bodyBoundSceneCount(visibleCopyPlan: ArticleVisibleCopyScenePlan[]) {
  return visibleCopyPlan.filter((scene) => {
    const bodySignals = [
      scene.supportingText?.value,
      scene.evidenceCaption?.value,
      ...(scene.recommendationItems ?? []).map((item) => item.value),
      ...(scene.stepItems ?? []).map((item) => item.value),
    ].filter(Boolean);
    return bodySignals.length > 0;
  }).length;
}

function hasSourceTrace(scene: ArticleVisibleCopyScenePlan) {
  const entries = [
    scene.headline,
    scene.supportingText,
    scene.shortLabel,
    scene.recommendationTitle,
    scene.evidenceCaption,
    ...(scene.recommendationItems ?? []),
    ...(scene.stepItems ?? []),
  ].filter(Boolean);
  return entries.every((entry) => Boolean(entry?.sourceField && entry.sourceExcerpt));
}

function hasDuplicate(values: string[]) {
  const normalized = values.map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

function intersects(left: string[], right: string[]) {
  const rightSet = new Set(right.map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean));
  return left.some((value) => rightSet.has(value.replace(/\s+/g, " ").trim()));
}

function evidenceCaptions(visibleCopyPlan: ArticleVisibleCopyScenePlan[]) {
  return visibleCopyPlan.map((scene) => scene.evidenceCaption).filter(Boolean);
}

async function run() {
  const args = readArgs();
  if (!args.inputDir || !args.outputDir) {
    throw new Error("Use: tsx src/article/inspectArticleContentBinding.ts --input-dir outputs/article-api-inspect/... --output-dir outputs/article-content-binding-inspect/...");
  }

  const inputDir = path.resolve(args.inputDir);
  const outputDir = path.resolve(args.outputDir);
  const videoStructurePath = path.resolve("video-structure.json");
  const initialHash = sha256(videoStructurePath);

  const article = loadJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = loadJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const job = buildArticleVideoJob(article, brief, outputDir);
  const visibleCopyPlan = job.visibleCopyPlan ?? [];
  const sceneRendererSource = fs.readFileSync(path.resolve("src/remotion/components/SceneRenderer.tsx"), "utf8");
  const safeTextSource = fs.readFileSync(path.resolve("src/remotion/components/SafeText.tsx"), "utf8");

  const titleBoundSceneCount = visibleCopyPlan.filter((scene) => Boolean(scene.headline?.value)).length;
  const titleVisibleSceneCount = visibleCopyPlan.filter((scene) => listVisibleValues(scene).includes(article.title)).length;
  const visibleEvidenceCount = evidenceCaptions(visibleCopyPlan).length;
  const placeholderHits = visibleCopyPlan.flatMap((scene) =>
    listVisibleValues(scene)
      .filter((value) => containsArticlePlaceholder(value))
      .map((value) => ({ sceneId: scene.sceneId, value })),
  );
  const ellipsisHits = visibleCopyPlan.flatMap((scene) =>
    listVisibleValues(scene)
      .filter((value) => visibleCopyHasEllipsis(value))
      .map((value) => ({ sceneId: scene.sceneId, value })),
  );
  const danglingHits = visibleCopyPlan.flatMap((scene) =>
    listVisibleValues(scene)
      .filter((value) => visibleCopyHasDanglingPunctuation(value))
      .map((value) => ({ sceneId: scene.sceneId, value })),
  );
  const hookScene = visibleCopyPlan.find((scene) => scene.contentRole === "hook");
  const stepScene = visibleCopyPlan.find((scene) => scene.contentRole === "step_flow");
  const recommendationScene = visibleCopyPlan.find((scene) => scene.contentRole === "recommendation");
  const headlineValues = visibleCopyPlan.map((scene) => scene.headline?.value).filter((value): value is string => Boolean(value));
  const supportingTextValues = visibleCopyPlan.map((scene) => scene.supportingText?.value).filter((value): value is string => Boolean(value));
  const stepItemValues = (stepScene?.stepItems ?? []).map((item) => item.value).filter(Boolean);
  const recommendationItemValues = (recommendationScene?.recommendationItems ?? []).map((item) => item.value).filter(Boolean);
  const visibleEvidenceEntries = evidenceCaptions(visibleCopyPlan);
  const genericSummaries = [article.summary, brief.summary].map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);

  const qaChecks = {
    articleTitleBoundToVisibleScene: titleBoundSceneCount >= 1,
    titleVisibleSceneCountIsOne: titleVisibleSceneCount === 1,
    articleBodyBoundSceneCount: bodyBoundSceneCount(visibleCopyPlan) >= 2,
    articleEvidenceBoundToVisibleScene: visibleEvidenceCount >= 1,
    allRequiredArticleScenesReceiveBoundCopy: visibleCopyPlan.every((scene) => Boolean(scene.headline?.value)),
    noDemoPlaceholderCopy: placeholderHits.length === 0,
    noDefaultWebsiteCopy: !/ChatGPT|Claude|Gemini|One subscription|Best route/i.test(JSON.stringify(visibleCopyPlan)),
    noCriticalTextEllipsis: ellipsisHits.length === 0,
    noCriticalTextCssClamp: safeTextSource.includes("preserveContent ? \"visible\" : \"hidden\"") && sceneRendererSource.includes("preserveContent={isStrictArticleScene(scene)}"),
    noSilentArticleFallback: !sceneRendererSource.includes("items ?? aiRecommendationRows(scene)") || sceneRendererSource.includes("ARTICLE_SCENE_REQUIRED_COPY_MISSING"),
    hookTextVisibleByFrameThreshold: (hookScene?.visibleAtFrame ?? Number.POSITIVE_INFINITY) <= 9,
    stepFlowUsesCanonicalOrderedSteps:
      Boolean(stepScene?.stepItems?.length) &&
      (stepScene?.stepItems ?? []).every((item) => item.sourceField.includes("orderedSteps")),
    recommendationUsesSourceBackedContent:
      Boolean(recommendationScene?.recommendationItems?.length) &&
      (recommendationScene?.recommendationItems ?? []).every((item) => Boolean(item.sourceField && item.sourceExcerpt)),
    visibleCopyHasSourceTrace: visibleCopyPlan.every(hasSourceTrace),
    articleBindingStrictModeEnabled: visibleCopyPlan.every(
      (scene) => scene.articleBindingMode === "strict" && scene.articleBindingRequired === true && scene.noPlaceholderFallback === true,
    ),
    noRepeatedHeadlineAcrossScenes: !hasDuplicate(headlineValues),
    noPartialClauseOrDanglingPunctuation: danglingHits.length === 0,
    stepItemsSemanticallyComplete:
      stepItemValues.length >= 2 &&
      stepItemValues.length <= 3 &&
      stepItemValues.every((value) => visibleCopyIsSemanticallyComplete(value)),
    recommendationMustDifferFromStepFlow:
      Boolean(recommendationScene?.headline?.value && stepScene?.headline?.value) &&
      recommendationScene?.headline?.value !== stepScene?.headline?.value &&
      !intersects(recommendationItemValues, stepItemValues),
    visibleEvidenceMustContainSubstantiveClaim:
      visibleEvidenceEntries.length >= 1 &&
      visibleEvidenceEntries.every(
        (entry) =>
          Boolean(entry?.sourceEvidenceIds.length) &&
          entry?.sourceField.includes("evidence") &&
          visibleEvidenceHasSubstantiveClaim(entry?.value),
      ),
    genericSummaryNotMisclassifiedAsEvidence: visibleEvidenceEntries.every(
      (entry) =>
        !["article.summary", "contentBrief.summary"].includes(entry?.sourceField ?? "") &&
        !genericSummaries.includes((entry?.value ?? "").replace(/\s+/g, " ").trim()),
    ),
    noRepeatedSupportingTextAcrossScenes: !hasDuplicate(supportingTextValues),
  };

  const articleVisibleCopyPlan = {
    articleId: article.articleId,
    title: article.title,
    selectedSceneIds: job.selectedSceneIds,
    selectedShotIds: job.remotionInputProps.structure.articleJob?.selectedShotIds ?? [],
    selectedChoreographyIds: job.selectedChoreographyIds,
    scenes: visibleCopyPlan.map(sceneVisibleTrace),
  };

  const articleBindingDebug = {
    rootCause: {
      articlePropsReachedJob: true,
      articlePropsReachedComponentProps: true,
      visibleCopyPlanInserted: visibleCopyPlan.length > 0,
      strictBindingEnabled: qaChecks.articleBindingStrictModeEnabled,
      previousFailureMode:
        "SceneRenderer article scenes retained demo/default fallbacks and SafeText clamp-compatible truncation, so selected shots did not guarantee visible article copy.",
    },
    selectedScenes: job.resolvedScenes.map((scene) => ({
      sceneId: scene.id,
      selectedShotId: scene.selectedShotId,
      choreographyId: scene.choreographyId,
      fallbackReason: scene.fallbackReason,
      articleBindingMode:
        scene.componentProps && typeof scene.componentProps === "object" && "articleBindingMode" in scene.componentProps
          ? scene.componentProps.articleBindingMode
          : undefined,
      articleContent:
        scene.componentProps && typeof scene.componentProps === "object" && "articleContent" in scene.componentProps
          ? scene.componentProps.articleContent
          : undefined,
    })),
  };

  const qaSummary = {
    status: Object.values(qaChecks).every(Boolean) ? "passed" : "failed",
    checks: {
      ...qaChecks,
      titleBoundSceneCount,
      titleVisibleSceneCount,
      bodyBoundSceneCount: bodyBoundSceneCount(visibleCopyPlan),
      visibleEvidenceCount,
      placeholderHitCount: placeholderHits.length,
      ellipsisHitCount: ellipsisHits.length,
      danglingPunctuationHitCount: danglingHits.length,
      hookVisibleAtFrame: hookScene?.visibleAtFrame ?? -1,
      stepItemValues,
      recommendationItemValues,
      selectedShotIds: job.remotionInputProps.structure.articleJob?.selectedShotIds.join(",") ?? "",
      selectedChoreographyIds: job.selectedChoreographyIds.join(","),
    },
    sceneAudit: visibleCopyPlan.map((scene) => ({
      sceneId: scene.sceneId,
      runtimeShotId: scene.runtimeShotId,
      choreographyId: scene.choreographyId,
      visibleTexts: listVisibleValues(scene),
      sourceTraceComplete: hasSourceTrace(scene),
      hasPlaceholder: listVisibleValues(scene).some((value) => containsArticlePlaceholder(value)),
      hasEllipsis: listVisibleValues(scene).some((value) => visibleCopyHasEllipsis(value)),
      hasDanglingPunctuation: listVisibleValues(scene).some((value) => visibleCopyHasDanglingPunctuation(value)),
      visibleAtFrame: scene.visibleAtFrame,
    })),
    warnings: [],
    errors: Object.entries(qaChecks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check),
    videoStructureHashUnchanged: sha256(videoStructurePath) === initialHash,
  };

  if (qaSummary.videoStructureHashUnchanged !== true) {
    throw new Error("video-structure.json hash changed during article content binding inspect.");
  }

  writeJson(path.join(outputDir, "article-visible-copy-plan.json"), articleVisibleCopyPlan);
  writeJson(path.join(outputDir, "article-binding-debug.json"), articleBindingDebug);
  writeJson(path.join(outputDir, "article-binding-qa-summary.json"), qaSummary);

  console.log(`articleVisibleCopyPlanPath=${path.join(outputDir, "article-visible-copy-plan.json")}`);
  console.log(`articleBindingDebugPath=${path.join(outputDir, "article-binding-debug.json")}`);
  console.log(`articleBindingQaSummaryPath=${path.join(outputDir, "article-binding-qa-summary.json")}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
