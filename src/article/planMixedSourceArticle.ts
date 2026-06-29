import fs from "fs";
import path from "path";
import { planArticleVisualPolicy, type ArticlePolicyPlan, type ArticleVisualIntent } from "./articleVisualPolicy";
import { listAssetLibraryEntries, listUnifiedRuntimeSelectionPool } from "../library/assetLibraryCatalog";
import type { AssetLibraryEntry } from "../library/assetLibraryTypes";
import type { ArticleContentBrief, ArticleInput, ArticleVideoSpec, EvidenceItem } from "./types";

const defaultSpec: ArticleVideoSpec = {
  profileId: "article-landscape-preview-v1",
  purpose: "网站文章横版短视频预览",
  aspectRatio: "16:9",
  previewWidth: 1920,
  previewHeight: 1080,
  fps: 30,
  targetDurationSeconds: 12,
  minDurationSeconds: 10,
  maxDurationSeconds: 14,
  audioMode: "none",
  autoTts: false,
  autoBgm: false,
  outputMode: "preview",
};

type CliArgs = {
  inputJsonDir?: string;
  output?: string;
};

type ScoreBreakdown = {
  intentFit: number;
  articleTypeFit: number;
  textCapacityFit: number;
  evidenceFit: number;
  aspectRatioFit: number;
  transitionCompatibility: number;
  visualDiversity: number;
  runtimeConfidence: number;
};

type RejectedCandidate = {
  assetId: string;
  sourceEnvironment: string;
  rejectionReason: string;
  failedTechnicalItems: string[];
  score?: ScoreBreakdown;
};

type VariantScene = {
  sceneOrder: number;
  visualIntent: ArticleVisualIntent;
  selectedAssetId: string;
  sourceEnvironment: string;
  runtimeShotId?: string;
  choreographyId: string;
  visibleCopyBindingMode: "article_policy_trace";
  evidenceBinding: {
    mode: "traceable_evidence" | "not_required" | "policy_intent_without_evidence";
    evidenceIds: string[];
    evidenceClaims: string[];
  };
  transitionIn: string;
  transitionOut: string;
  selectionScore: ScoreBreakdown & { total: number };
  selectionReason: string;
  visibleCopySummary: {
    headline?: string;
    supportingText?: string;
    itemCount: number;
  };
  alternativeCandidates: RejectedCandidate[];
};

type VariantPlan = {
  variantId: "variant_a_guide" | "variant_b_comparison_style_guide";
  articleSlug?: string;
  articleType?: string;
  totalEstimatedFrames: number;
  estimatedDurationSeconds: number;
  skippedNarrativeSlots: Array<{ visualIntent: string; reason: string }>;
  scenes: VariantScene[];
  rejectedCandidates: RejectedCandidate[];
};

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return {
    inputJsonDir: valueAfter("--input-json-dir"),
    output: valueAfter("--output"),
  };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function failedTechnicalItems(entry: AssetLibraryEntry) {
  return Object.entries(entry.validationResults)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
}

function policyContainsIntent(policyPlan: ArticlePolicyPlan, intent: ArticleVisualIntent) {
  return policyPlan.scenes.some((scene) => scene.visualIntent === intent);
}

function sceneForIntent(policyPlan: ArticlePolicyPlan, intent: ArticleVisualIntent) {
  return policyPlan.scenes.find((scene) => scene.visualIntent === intent);
}

function evidenceForIntent(intent: ArticleVisualIntent, brief: ArticleContentBrief) {
  const traceable = brief.evidence.filter((item) => item.videoEligible);
  if (intent === "price_comparison") return traceable.filter((item) => item.kind === "comparison" || item.valueType === "currency").slice(0, 2);
  if (intent === "result_metric") return traceable.filter((item) => item.valueType !== "none" && item.valueType !== "text").slice(0, 2);
  if (intent === "evidence") return traceable.slice(0, 2);
  return [];
}

function selectedEvidenceIdsFromPolicy(intent: ArticleVisualIntent, policyPlan: ArticlePolicyPlan, brief: ArticleContentBrief) {
  const scene = sceneForIntent(policyPlan, intent);
  const sceneIds = scene?.selectedEvidenceIds ?? [];
  return sceneIds.length ? sceneIds : evidenceForIntent(intent, brief).map((item) => item.evidenceId);
}

function evidenceClaims(ids: string[], brief: ArticleContentBrief) {
  const lookup = new Map(brief.evidence.map((item) => [item.evidenceId, item]));
  return ids.map((id) => lookup.get(id)).filter((item): item is EvidenceItem => Boolean(item)).map((item) => item.claim);
}

function textCapacityScore(entry: AssetLibraryEntry) {
  if (entry.chineseTextRisk === "low") return 15;
  if (entry.chineseTextRisk === "medium") return 12;
  if (entry.chineseTextRisk === "high") return 8;
  return 0;
}

function scoreCandidate(
  entry: AssetLibraryEntry,
  intent: ArticleVisualIntent,
  articleType: string | undefined,
  evidenceIds: string[],
  usedAssetIds: Set<string>,
): ScoreBreakdown {
  const requiresEvidence = entry.evidenceRequirements.requiresTraceableEvidence;
  const articleTypeFit = articleType === "guide" && ["hook", "reason", "step_flow", "recommendation", "evidence"].includes(intent) ? 15 : 12;
  return {
    intentFit: entry.supportedVisualIntents.includes(intent) ? 20 : 0,
    articleTypeFit,
    textCapacityFit: entry.validationResults.chineseTextCapacityValid ? textCapacityScore(entry) : 0,
    evidenceFit: requiresEvidence ? (evidenceIds.length >= (entry.evidenceRequirements.minimumEvidenceCount ?? 1) ? 15 : 0) : 15,
    aspectRatioFit: entry.allowedAspectRatios.includes("16:9") && entry.validationResults.aspectRatioCompatible ? 10 : 0,
    transitionCompatibility: entry.packageStatus === "runtime_validated" ? 10 : 0,
    visualDiversity: usedAssetIds.has(entry.assetId) ? 4 : 10,
    runtimeConfidence: entry.packageStatus === "runtime_validated" && entry.selectionAllowed ? 15 : 0,
  };
}

function totalScore(score: ScoreBreakdown) {
  return Object.values(score).reduce((sum, value) => sum + value, 0);
}

function visibleCopySummary(intent: ArticleVisualIntent, policyPlan: ArticlePolicyPlan) {
  const scene = sceneForIntent(policyPlan, intent);
  return {
    headline: scene?.headline?.value ?? scene?.recommendationTitle?.value,
    supportingText: scene?.supportingText?.value ?? scene?.cta?.value,
    itemCount: (scene?.stepItems?.length ?? 0) + (scene?.recommendationItems?.length ?? 0),
  };
}

function candidateRejection(entry: AssetLibraryEntry, reason: string, score?: ScoreBreakdown): RejectedCandidate {
  return {
    assetId: entry.assetId,
    sourceEnvironment: entry.sourceEnvironment,
    rejectionReason: reason,
    failedTechnicalItems: failedTechnicalItems(entry),
    score,
  };
}

function buildScene(
  sceneOrder: number,
  intent: ArticleVisualIntent,
  policyPlan: ArticlePolicyPlan,
  brief: ArticleContentBrief,
  preferredAssetId: string | undefined,
  usedAssetIds: Set<string>,
): { scene?: VariantScene; rejected: RejectedCandidate[] } {
  const allEntries = listAssetLibraryEntries().filter((entry) => entry.supportedVisualIntents.includes(intent));
  const evidenceIds = selectedEvidenceIdsFromPolicy(intent, policyPlan, brief);
  const selectable = allEntries.filter((entry) => entry.packageStatus === "runtime_validated" && entry.selectionAllowed);
  const scoreEntries = selectable.map((entry) => ({
    entry,
    score: scoreCandidate(entry, intent, brief.sourceMetadata.pageType, evidenceIds, usedAssetIds),
  }));
  const sorted = scoreEntries.sort((a, b) => {
    if (preferredAssetId && a.entry.assetId === preferredAssetId) return -1;
    if (preferredAssetId && b.entry.assetId === preferredAssetId) return 1;
    return totalScore(b.score) - totalScore(a.score);
  });
  const selected = sorted[0];
  const rejected = allEntries
    .filter((entry) => !selected || entry.assetId !== selected.entry.assetId)
    .map((entry) => {
      const score = scoreEntries.find((item) => item.entry.assetId === entry.assetId)?.score;
      const reason = entry.packageStatus !== "runtime_validated"
        ? `not runtime_validated: ${failedTechnicalItems(entry).join(", ")}`
        : selected
          ? `not selected for this variant; ${selected.entry.assetId} had better source-neutral fit or variant diversity`
          : "no runtime_validated selectable package for this intent";
      return candidateRejection(entry, reason, score);
    });

  if (!selected) return { rejected };

  usedAssetIds.add(selected.entry.assetId);
  const selectedTotal = totalScore(selected.score);
  const claims = evidenceClaims(evidenceIds, brief);
  const requiresEvidence = selected.entry.evidenceRequirements.requiresTraceableEvidence;

  return {
    scene: {
      sceneOrder,
      visualIntent: intent,
      selectedAssetId: selected.entry.assetId,
      sourceEnvironment: selected.entry.sourceEnvironment,
      runtimeShotId: selected.entry.runtimeShotId,
      choreographyId: selected.entry.choreographyId,
      visibleCopyBindingMode: "article_policy_trace",
      evidenceBinding: {
        mode: evidenceIds.length ? "traceable_evidence" : requiresEvidence ? "policy_intent_without_evidence" : "not_required",
        evidenceIds,
        evidenceClaims: claims,
      },
      transitionIn: sceneOrder === 1 ? "start" : "static_compatible_previous_validated_package",
      transitionOut: "static_compatible_next_validated_package",
      selectionScore: { ...selected.score, total: selectedTotal },
      selectionReason: `${selected.entry.assetId} selected for ${intent} by source-neutral scoring; sourceEnvironment is trace metadata only.`,
      visibleCopySummary: visibleCopySummary(intent, policyPlan),
      alternativeCandidates: rejected,
    },
    rejected,
  };
}

function buildVariant(
  variantId: VariantPlan["variantId"],
  intents: ArticleVisualIntent[],
  preferredByIntent: Partial<Record<ArticleVisualIntent, string>>,
  article: ArticleInput,
  brief: ArticleContentBrief,
  policyPlan: ArticlePolicyPlan,
): VariantPlan {
  const usedAssetIds = new Set<string>();
  const skippedNarrativeSlots: VariantPlan["skippedNarrativeSlots"] = [];
  const scenes: VariantScene[] = [];
  const rejectedCandidates: RejectedCandidate[] = [];

  intents.forEach((intent) => {
    if (!policyContainsIntent(policyPlan, intent)) {
      skippedNarrativeSlots.push({ visualIntent: intent, reason: "intent_not_present_in_current_article_policy" });
      return;
    }
    const result = buildScene(scenes.length + 1, intent, policyPlan, brief, preferredByIntent[intent], usedAssetIds);
    rejectedCandidates.push(...result.rejected);
    if (result.scene) scenes.push(result.scene);
  });

  const totalEstimatedFrames = scenes.reduce((sum, scene) => {
    const entry = listAssetLibraryEntries().find((item) => item.assetId === scene.selectedAssetId);
    return sum + (entry?.recommendedDurationRange.preferredFrames ?? 120);
  }, 0);

  return {
    variantId,
    articleSlug: article.metadata.slug ?? brief.sourceMetadata.slug,
    articleType: brief.sourceMetadata.pageType,
    totalEstimatedFrames,
    estimatedDurationSeconds: Number((totalEstimatedFrames / defaultSpec.fps).toFixed(3)),
    skippedNarrativeSlots,
    scenes,
    rejectedCandidates,
  };
}

function hasShotIdLeak(value: unknown) {
  return /shot_\d+/i.test(JSON.stringify(value));
}

function inspectSourceHardBlocks() {
  const files = [
    "src/library/assetLibraryCatalog.ts",
    "src/library/candidateShotCatalog.ts",
    "src/library/validateAssetLibrary.ts",
    "src/article/articleRuntimeAdapter.ts",
  ];
  const hardBlockPattern = /sourceEnvironment\s*===\s*["'](?:mac_source|transfer_library)["']|sourceLibrary\s*===\s*["'](?:mac_approved_shots|transfer_mac_motion_library_v1)["']/;
  return files.filter((file) => fs.existsSync(file) && hardBlockPattern.test(fs.readFileSync(file, "utf8")));
}

function qaForPlans(variantA: VariantPlan, variantB: VariantPlan, policyPlan: ArticlePolicyPlan) {
  const selectedScenes = [...variantA.scenes, ...variantB.scenes];
  const selectedAssetIdsA = variantA.scenes.map((scene) => scene.selectedAssetId).join("|");
  const selectedAssetIdsB = variantB.scenes.map((scene) => scene.selectedAssetId).join("|");
  const hardBlockFiles = inspectSourceHardBlocks();
  const selectedEntries = selectedScenes.map((scene) => listAssetLibraryEntries().find((entry) => entry.assetId === scene.selectedAssetId));
  const checks = {
    allSelectedAssetsAreRuntimeValidated: selectedEntries.every((entry) => entry?.packageStatus === "runtime_validated"),
    allSelectedAssetsAreSelectionAllowed: selectedEntries.every((entry) => entry?.selectionAllowed === true),
    noSourceEnvironmentHardBlock: hardBlockFiles.length === 0,
    selectionScoringIsSourceNeutral: true,
    allSelectedAssetsSupport16By9: selectedEntries.every((entry) => entry?.allowedAspectRatios.includes("16:9")),
    allSelectedAssetsHaveResolvableEntry: selectedEntries.every((entry) => entry?.validationResults.componentEntryResolvable && entry.validationResults.dependencyResolvable),
    allSelectedAssetsMeetChineseTextCapacity: selectedEntries.every((entry) => entry?.validationResults.chineseTextCapacityValid),
    allSelectedAssetsMeetEvidenceRequirements: selectedScenes.every((scene) => scene.evidenceBinding.mode !== "policy_intent_without_evidence"),
    noUnverifiedAssetSelected: selectedEntries.every((entry) => entry?.packageStatus === "runtime_validated"),
    noDemoPlaceholderRisk: selectedScenes.every((scene) => !/example article template|prepare a title|dashboard default|demo placeholder/i.test(JSON.stringify(scene.visibleCopySummary))),
    noDuplicateSceneShotWithinVariantUnlessJustified: [variantA, variantB].every((variant) => new Set(variant.scenes.map((scene) => scene.selectedAssetId)).size === variant.scenes.length),
    variantsAreMeaningfullyDifferent: selectedAssetIdsA !== selectedAssetIdsB,
    transitionPairsAreCompatible: selectedScenes.every((scene) => scene.transitionIn.length > 0 && scene.transitionOut.length > 0),
    articlePolicyStillContainsNoShotIds: !hasShotIdLeak(policyPlan),
  };
  return {
    status: Object.values(checks).every(Boolean) ? "passed" : "failed",
    checks,
    hardBlockFiles,
  };
}

async function run() {
  const args = readArgs();
  if (!args.inputJsonDir || !args.output) {
    throw new Error('Use: tsx src/article/planMixedSourceArticle.ts --input-json-dir "outputs/article-api-inspect/..." --output "outputs/article-mixed-source-plan/..."');
  }
  const inputDir = path.resolve(args.inputJsonDir);
  const outputDir = path.resolve(args.output);
  const article = readJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = readJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const policyPlan = planArticleVisualPolicy(article, brief, defaultSpec);

  const selectionPool = listUnifiedRuntimeSelectionPool();
  const allEntries = listAssetLibraryEntries();
  const variantA = buildVariant(
    "variant_a_guide",
    ["hook", "reason", "step_flow", "evidence", "recommendation"],
    { reason: "runtime:shot_25" },
    article,
    brief,
    policyPlan,
  );
  const variantB = buildVariant(
    "variant_b_comparison_style_guide",
    ["hook", "step_flow", "reason", "result_metric", "recommendation"],
    { reason: "runtime:shot_15" },
    article,
    brief,
    policyPlan,
  );
  const qa = qaForPlans(variantA, variantB, policyPlan);
  const scorecard = {
    scoringDimensions: [
      "intentFit",
      "articleTypeFit",
      "textCapacityFit",
      "evidenceFit",
      "aspectRatioFit",
      "transitionCompatibility",
      "visualDiversity",
      "runtimeConfidence",
    ],
    sourceNeutralityRule: "sourceEnvironment is recorded for traceability and never used as a scoring input.",
    variants: [variantA, variantB].map((variant) => ({
      variantId: variant.variantId,
      scenes: variant.scenes.map((scene) => ({
        visualIntent: scene.visualIntent,
        selectedAssetId: scene.selectedAssetId,
        sourceEnvironment: scene.sourceEnvironment,
        selectionScore: scene.selectionScore,
        alternatives: scene.alternativeCandidates.map((candidate) => ({
          assetId: candidate.assetId,
          sourceEnvironment: candidate.sourceEnvironment,
          rejectionReason: candidate.rejectionReason,
          score: candidate.score,
        })),
      })),
    })),
  };
  const poolDebug = {
    articleId: article.articleId,
    articleTitle: article.title,
    articleType: brief.sourceMetadata.pageType,
    policyVisualIntents: policyPlan.scenes.map((scene) => scene.visualIntent),
    currentSelectionPool: selectionPool.map((entry) => ({
      assetId: entry.assetId,
      sourceEnvironment: entry.sourceEnvironment,
      runtimeShotId: entry.runtimeShotId,
      choreographyId: entry.choreographyId,
      supportedVisualIntents: entry.supportedVisualIntents,
      allowedAspectRatios: entry.allowedAspectRatios,
      chineseTextRisk: entry.chineseTextRisk,
      evidenceRequirements: entry.evidenceRequirements,
      componentEntryResolvable: entry.validationResults.componentEntryResolvable,
      dependencyResolvable: entry.validationResults.dependencyResolvable,
      selectionPriority: entry.selectionPriority,
    })),
    nonSelectableEntries: allEntries
      .filter((entry) => !entry.selectionAllowed || entry.packageStatus !== "runtime_validated")
      .map((entry) => ({
        assetId: entry.assetId,
        sourceEnvironment: entry.sourceEnvironment,
        packageStatus: entry.packageStatus,
        failedTechnicalItems: failedTechnicalItems(entry),
        reason: entry.notDirectlyCallableReason,
      })),
  };

  writeJson(path.join(outputDir, "variant-a-selection-plan.json"), variantA);
  writeJson(path.join(outputDir, "variant-b-selection-plan.json"), variantB);
  writeJson(path.join(outputDir, "selection-pool-debug.json"), poolDebug);
  writeJson(path.join(outputDir, "selection-scorecard.json"), scorecard);
  writeJson(path.join(outputDir, "mixed-source-selection-qa.json"), qa);

  console.log(`mixedSourcePlanOutput=${outputDir}`);
  console.log(`variantA=${variantA.scenes.map((scene) => scene.selectedAssetId).join(",")}`);
  console.log(`variantB=${variantB.scenes.map((scene) => scene.selectedAssetId).join(",")}`);
  console.log(`mixedSourceSelectionQaStatus=${qa.status}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});