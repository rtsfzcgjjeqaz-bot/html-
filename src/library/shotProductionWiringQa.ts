import fs from "fs";
import path from "path";
import { buildArticleRuntimeSelectionPlan } from "../article/articleRuntimeAdapter";
import { assertArticleRuntimeSelectionComplete, buildArticleVideoJob } from "../article/buildArticleVideoJob";
import { planResolvedScenesWithShots } from "../factory/shotPlanner";
import type { ArticlePolicyPlan } from "../article/articleVisualPolicy";
import type { ArticleContentBrief, ArticleInput, ArticleVideoSpec } from "../article/types";
import type { PlannedScene } from "../factory/videoVariantPlanner";
import { fixtureScenes, selectShotsForScenes } from "./unifiedShotSelector";
import { listUnifiedShotSelectionContracts } from "./assetLibraryCatalog";
import { localRuntimeKey, macRuntimeKey, resolveRuntimeKeyFromLogicalId, runtimeLogicalShotIdAmbiguousCode } from "./runtimeIdentity";
import type { ShotSelectionSceneInput, UnifiedShotSelectionContract } from "./shotSelectionTypes";

const spec: ArticleVideoSpec = {
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


const article: ArticleInput = {
  articleId: "shot-selection-production-fixture",
  sourceType: "text",
  title: "Shot selection production fixture",
  summary: "Compare a price choice, recommend an AI workflow, and show the steps.",
  rawContent: "AI recommendation, annual price comparison, and workflow steps.",
  sections: [
    {
      sectionId: "fixture-overview",
      heading: "Overview",
      paragraphs: ["Use AI recommendation, annual price comparison, and workflow steps."],
      orderedSteps: ["Open the page", "Review the annual option", "Confirm the workflow"],
      sourceLocation: { sectionIndex: 0 },
    },
  ],
  metadata: { pageType: "guide" },
};

const brief: ArticleContentBrief = {
  articleId: "shot-selection-production-fixture",
  title: "Shot selection production fixture",
  coreMessage: "Select deterministic shots",
  summary: "Fixture only; no external provider or render.",
  keyPoints: ["AI recommendation", "Price comparison", "Step flow"],
  evidence: [
    {
      evidenceId: "ev_currency",
      claim: "Annual option is cheaper.",
      sourceExcerpt: "Annual option is cheaper.",
      sourceLocation: { sectionId: "fixture", paragraphIndex: 0 },
      kind: "comparison",
      valueType: "currency",
      value: 120,
      unit: "USD",
      videoEligible: true,
    },
    {
      evidenceId: "ev_step",
      claim: "The workflow has ordered steps.",
      sourceExcerpt: "The workflow has ordered steps.",
      sourceLocation: { sectionId: "fixture", paragraphIndex: 1 },
      kind: "instruction",
      valueType: "text",
      value: "workflow",
      videoEligible: true,
    },
  ],
  factConstraints: [],
  recommendedVisualIntents: ["recommendation", "price_comparison", "step_flow"],
  sourceMetadata: { sourceType: "text", pageType: "guide", titleSource: "fallback", summarySource: "fallback" },
};

function policyPlan(): ArticlePolicyPlan {
  return {
    scenes: [
      {
        sceneId: 1,
        visualIntent: "recommendation",
        recommendationTitle: { value: "AI recommendation", sourceField: "fixture", sourceExcerpt: "AI recommendation", compacted: false, originalCharacters: 17, finalCharacters: 17 },
        selectedEvidenceIds: ["ev_step"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
      {
        sceneId: 2,
        visualIntent: "price_comparison",
        headline: { value: "Compare price", sourceField: "fixture", sourceExcerpt: "Compare price", compacted: false, originalCharacters: 13, finalCharacters: 13 },
        selectedEvidenceIds: ["ev_currency"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
      {
        sceneId: 3,
        visualIntent: "step_flow",
        headline: { value: "Follow the workflow", sourceField: "fixture", sourceExcerpt: "Follow the workflow", compacted: false, originalCharacters: 19, finalCharacters: 19 },
        stepItems: [
          { value: "Open", sourceField: "fixture", sourceExcerpt: "Open", compacted: false, originalCharacters: 4, finalCharacters: 4 },
          { value: "Review", sourceField: "fixture", sourceExcerpt: "Review", compacted: false, originalCharacters: 6, finalCharacters: 6 },
        ],
        selectedEvidenceIds: ["ev_step"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
    ],
    debug: { policyVersion: "article-visual-policy-v2", articleId: "fixture", pageType: "guide", selectedVisualIntents: [], rejectedVisualIntents: [], selectedEvidenceIds: [], rejectedEvidenceIds: [], evidenceDecisions: [], textShorteningActions: [], stepSelection: { canonicalOrderedSteps: [], selectedSteps: [] }, duplicatePreventionActions: [], policyWarnings: [], scenes: [], qaChecks: {} },
  } as unknown as ArticlePolicyPlan;
}

function plannedScenesFromRuntimeSelection(plan: ReturnType<typeof buildArticleRuntimeSelectionPlan>): PlannedScene[] {
  return plan.scenes
    .filter((scene) => scene.selectionStatus === "selected" && scene.selectedRuntimeShotId)
    .map((scene) => ({
      id: scene.sceneId,
      duration: 4,
      hookType: "curiosity",
      camera: { shot: "medium", motion: "static" },
      visualIntent: scene.visualIntent,
      textOverlay: [scene.visualIntent],
      sceneType: scene.visualIntent,
      visualTemplate: scene.visualIntent,
      assets: { image: [], fallback: "ai_generated" },
      audioCue: scene.visualIntent,
      sourceType: "article",
      preferredRuntimeShotId: scene.selectedRuntimeShotId,
      visualIntentKey: scene.visualIntent,
    } as unknown as PlannedScene));
}

function fixtureContract(input: Partial<UnifiedShotSelectionContract> & Pick<UnifiedShotSelectionContract, "assetId" | "shotId" | "sourceEnvironment" | "semanticTags" | "sceneRoles" | "selectionPriority">): UnifiedShotSelectionContract {
  return {
    displayName: input.shotId,
    logicalShotId: input.shotId,
    runtimeKey: input.sourceEnvironment === "mac_source" ? macRuntimeKey("fixture_commit", input.shotId) : localRuntimeKey(input.shotId),
    runtimeSourceKind: input.sourceEnvironment === "mac_source" ? "mac_package_runtime" : "local_runtime",
    sourceLibrary: input.sourceEnvironment === "mac_source" ? "mac_approved_shots" : "windows_runtime_catalog",
    runtimeReadiness: "runtime_validated",
    selectionAllowed: true,
    intents: ["recommendation"],
    excludedIntents: [],
    supportedEvidenceTypes: ["fact", "text"],
    durationRangeFrames: { minFrames: 100, preferredFrames: 120, maxFrames: 150 },
    aspectRatio: "16:9",
    textCapacityContract: { headline: "medium", supportingText: "medium", structuredItems: "medium" },
    duplicateUsePolicy: "avoid_repeat",
    transitionCompatibility: { compatible: true, supportedTransitionPairs: [], supportsOverlap: false },
    runtimeEntry: input.shotId,
    runtimeExport: input.shotId,
    choreographyEntry: input.shotId,
    choreographyExport: input.shotId,
    requiredAssets: ["fixture_motion"],
    visualEnergy: "medium",
    compositionType: "fixture",
    motionLanguage: input.semanticTags,
    provenance: {},
    contractHash: `${input.shotId}-hash`,
    selectionCatalogVersion: "fixture",
    ...input,
  };
}

const runtimePlan = buildArticleRuntimeSelectionPlan(policyPlan(), brief, spec);
const shotPlan = planResolvedScenesWithShots(plannedScenesFromRuntimeSelection(runtimePlan), {
  fps: spec.fps,
  profile: "default-promo",
  narrativeId: "trust",
  runtimeSelectionPlan: runtimePlan.runtimeSelectionPlan,
});
const job = buildArticleVideoJob(article, brief, ".asset-sync-cache/shot-production-wiring-qa");
const jobAdapterPlan = (job.policyDebug?.runtimeSelectionPlan as { runtimeSelectionPlan?: typeof job.runtimeSelectionPlan } | undefined)?.runtimeSelectionPlan;
const jobPlannerPlan = (job.policyDebug?.shotPlannerRuntimeSelectionPlan as typeof job.runtimeSelectionPlan | undefined);
const jobRemotionPlan = job.remotionInputProps.structure.articleJob?.runtimeSelectionPlan;

const fixtureMacWin = selectShotsForScenes(fixtureScenes("ai-recommendation"), "ai-recommendation", {
  contracts: [
    fixtureContract({ assetId: "mac-fixture:approved", shotId: "mac_fixture_approved", sourceEnvironment: "mac_source", semanticTags: ["ai_recommendation", "prompt_composer"], sceneRoles: ["product_demo"], selectionPriority: 80 }),
    fixtureContract({ assetId: "runtime:generic-ui", shotId: "windows_generic_ui", sourceEnvironment: "windows_runtime", semanticTags: ["generic_ui"], sceneRoles: ["reason"], selectionPriority: 90 }),
  ],
});

const rejectedMacFixture = selectShotsForScenes(fixtureScenes("ai-recommendation"), "ai-recommendation", {
  contracts: [
    { ...fixtureContract({ assetId: "mac-fixture:rejected", shotId: "mac_fixture_rejected", sourceEnvironment: "mac_source", semanticTags: ["ai_recommendation"], sceneRoles: ["product_demo"], selectionPriority: 120 }), runtimeReadiness: "rejected", selectionAllowed: false },
    fixtureContract({ assetId: "runtime:generic-ui", shotId: "windows_generic_ui", sourceEnvironment: "windows_runtime", semanticTags: ["generic_ui"], sceneRoles: ["product_demo"], selectionPriority: 50 }),
  ],
});

const referenceOnlyFixture = selectShotsForScenes(fixtureScenes("ai-recommendation"), "ai-recommendation", {
  contracts: [
    { ...fixtureContract({ assetId: "mac-fixture:reference", shotId: "mac_fixture_reference", sourceEnvironment: "mac_source", semanticTags: ["ai_recommendation"], sceneRoles: ["product_demo"], selectionPriority: 120 }), runtimeReadiness: "source_incomplete", selectionAllowed: false },
    fixtureContract({ assetId: "runtime:generic-ui", shotId: "windows_generic_ui", sourceEnvironment: "windows_runtime", semanticTags: ["generic_ui"], sceneRoles: ["product_demo"], selectionPriority: 50 }),
  ],
});


const noCompatibleRequiredScene: ShotSelectionSceneInput = {
  sceneId: 101,
  visualIntent: "safe_end",
  sceneRole: "safe_end",
  sourceEvidenceTypes: [],
  semanticKeywords: ["safe_end"],
  requiredTextFields: ["headline"],
  targetDurationFrames: 120,
  aspectRatio: "16:9",
  sceneRequiredness: "required",
};

const noCompatibleOptionalScene: ShotSelectionSceneInput = {
  ...noCompatibleRequiredScene,
  sceneId: 102,
  sceneRequiredness: "optional",
};

const duplicatePlan = selectShotsForScenes([fixtureScenes("step-flow")[0], fixtureScenes("step-flow")[0]]);
const requiredNoCompatiblePlan = selectShotsForScenes([noCompatibleRequiredScene]);
const optionalNoCompatiblePlan = selectShotsForScenes([noCompatibleOptionalScene]);
const fallbackPlan = selectShotsForScenes([{ ...fixtureScenes("ai-recommendation")[0], semanticKeywords: ["unmatched_semantic_marker"] }]);
const realMacContracts = listUnifiedShotSelectionContracts().filter((contract) => contract.runtimeSourceKind === "mac_package_runtime");
const realMacCanEnterCandidatePool = realMacContracts.length > 0;
const collisionIds = ["shot_35", "shot_36", "shot_50", "shot_51"];
const collisionRuntimeKeys = collisionIds.map((shotId) => ({
  shotId,
  runtimeKeys: listUnifiedShotSelectionContracts().filter((contract) => contract.logicalShotId === shotId).map((contract) => contract.runtimeKey),
}));
let ambiguousShot51FailClosed = false;
try {
  resolveRuntimeKeyFromLogicalId({ logicalShotId: "shot_51", runtimeKeys: collisionRuntimeKeys.flatMap((item) => item.runtimeKeys) });
} catch (error) {
  ambiguousShot51FailClosed = error instanceof Error && error.message.includes(runtimeLogicalShotIdAmbiguousCode);
}
const runtimeSelections = runtimePlan.runtimeSelectionPlan.decisions.map((item) => item.selectedShotId ?? "none");
const runtimeKeys = runtimePlan.runtimeSelectionPlan.decisions.map((item) => item.selectedRuntimeKey ?? "none");
const plannerSelections = shotPlan.scenes.map((item) => item.selectedShotId ?? "none");
const plannerRuntimeKeys = shotPlan.scenes.map((item) => item.selectedRuntimeKey ?? "none");
const jobAdapterSelections = jobAdapterPlan?.decisions.map((item) => item.selectedShotId ?? "none") ?? [];
const jobPlannerSelections = jobPlannerPlan?.decisions.map((item) => item.selectedShotId ?? "none") ?? [];
const jobSavedSelections = job.runtimeSelectionPlan.decisions.map((item) => item.selectedShotId ?? "none");
const jobSavedRuntimeKeys = job.runtimeSelectionPlan.decisions.map((item) => item.selectedRuntimeKey ?? "none");
const remotionSelections = jobRemotionPlan?.decisions.map((item) => item.selectedShotId ?? "none") ?? [];
const remotionRuntimeKeys = jobRemotionPlan?.decisions.map((item) => item.selectedRuntimeKey ?? "none") ?? [];
const jobHashes = [
  jobAdapterPlan?.runtimeSelectionPlanHash,
  jobPlannerPlan?.runtimeSelectionPlanHash,
  job.runtimeSelectionPlan.runtimeSelectionPlanHash,
  jobRemotionPlan?.runtimeSelectionPlanHash,
];
const noneDecision = job.runtimeSelectionPlan.decisions.find((decision) => !decision.selectedShotId);
const requiredNoCompatibleDecision = requiredNoCompatiblePlan.decisions[0];
const optionalNoCompatibleDecision = optionalNoCompatiblePlan.decisions[0];
const duplicateSecondDecision = duplicatePlan.decisions[1];
const jobRequiredIncompleteScenes = job.runtimeSelectionPlan.decisions.filter((decision) => decision.sceneRequiredness === "required" && !decision.selectedShotId);
let requiredNoCompatibleJobBlocked = false;
try {
  assertArticleRuntimeSelectionComplete({
    ...runtimePlan,
    scenes: [{
      ...runtimePlan.scenes[0],
      selectedRuntimeShotId: undefined,
      selectedChoreographyId: undefined,
      selectionStatus: "blocked",
      sceneRequiredness: "required",
      fallbackType: "explicit_scene_skip",
      fallbackReason: "REQUIRED_SCENE_NO_RUNTIME_SHOT",
      blockedCode: "REQUIRED_SCENE_NO_RUNTIME_SHOT",
    }],
  });
} catch (error) {
  requiredNoCompatibleJobBlocked = error instanceof Error && error.message.includes("REQUIRED_SCENE_NO_RUNTIME_SHOT");
}
const checks = {
  singleArticleSelectorCall: runtimePlan.runtimeSelectionPlan.selectorCallCount === 1,
  adapterAndPlannerSharePlanHash: runtimePlan.runtimeSelectionPlan.runtimeSelectionPlanHash === shotPlan.runtimeSelectionPlan.runtimeSelectionPlanHash,
  adapterPlannerSelectedShotIdsMatch: runtimeSelections.join(",") === plannerSelections.join(","),
  adapterPlannerRuntimeKeysMatch: runtimeKeys.join(",") === plannerRuntimeKeys.join(","),
  jobFourStagePlanHashMatch: jobHashes.every((hash) => hash && hash === job.runtimeSelectionPlan.runtimeSelectionPlanHash),
  jobFourStageSelectedShotIdsMatch: [jobAdapterSelections, jobPlannerSelections, jobSavedSelections, remotionSelections].every((items) => items.length > 0 && items.join(",") === jobSavedSelections.join(",")),
  jobFourStageRuntimeKeysMatch: [jobSavedRuntimeKeys, remotionRuntimeKeys].every((items) => items.length > 0 && items.join(",") === jobSavedRuntimeKeys.join(",")),
  jobRequiredScenesHaveSelections: jobRequiredIncompleteScenes.length === 0,
  jobNoneIsExplicitOptionalSkip: Boolean(noneDecision && noneDecision.selectionStatus === "optional_skipped" && noneDecision.sceneRequiredness === "optional" && noneDecision.blockedCode === "OPTIONAL_SCENE_SKIPPED"),
  expectedRecommendation: runtimePlan.runtimeSelectionPlan.decisions[0]?.selectedShotId === "shot_51",
  expectedPriceComparison: runtimePlan.runtimeSelectionPlan.decisions[1]?.selectedShotId === "shot_27",
  expectedStepFlow: runtimePlan.runtimeSelectionPlan.decisions[2]?.selectedShotId === "shot_03",
  macFixtureBeatsWindowsBySemantics: fixtureMacWin.decisions[0]?.selectedShotId === "mac_fixture_approved",
  rejectedMacFixtureExcluded: rejectedMacFixture.decisions[0]?.selectedShotId !== "mac_fixture_rejected",
  referenceOnlyFixtureExcluded: referenceOnlyFixture.decisions[0]?.selectedShotId !== "mac_fixture_reference",
  validatedRealMacCanEnterCandidatePool: realMacCanEnterCandidatePool,
  collisionRuntimeKeysUnique: collisionRuntimeKeys.every((item) => item.runtimeKeys.length >= 2 && new Set(item.runtimeKeys).size === item.runtimeKeys.length),
  ambiguousLogicalLookupFailClosed: ambiguousShot51FailClosed,
  duplicateAvoided: duplicatePlan.decisions[0]?.selectedShotId !== duplicatePlan.decisions[1]?.selectedShotId,
  duplicateSecondOutcomeExplained: Boolean(duplicateSecondDecision && ["selected", "optional_skipped", "blocked"].includes(duplicateSecondDecision.selectionStatus) && (duplicateSecondDecision.selectedShotId || duplicateSecondDecision.fallbackReason || duplicateSecondDecision.blockedCode)),
  requiredNoCompatibleBlocked: requiredNoCompatibleDecision?.selectionStatus === "blocked" && requiredNoCompatibleDecision.blockedCode === "REQUIRED_SCENE_NO_RUNTIME_SHOT",
  requiredNoCompatibleJobBlocked,
  optionalNoCompatibleSkipped: optionalNoCompatibleDecision?.selectionStatus === "optional_skipped" && optionalNoCompatibleDecision.blockedCode === "OPTIONAL_SCENE_SKIPPED",
  fallbackReasonRecorded: fallbackPlan.decisions[0]?.fallbackReason === "ASSET_SEMANTIC_MATCH_FALLBACK",
};
const summary = {
  status: Object.values(checks).every(Boolean) ? "passed" : "failed",
  checks,
  runtimeSelections,
  runtimeKeys,
  plannerSelections,
  plannerRuntimeKeys,
  jobAdapterSelections,
  jobPlannerSelections,
  jobSavedSelections,
  jobSavedRuntimeKeys,
  remotionSelections,
  remotionRuntimeKeys,
  runtimeSelectionPlanHash: runtimePlan.runtimeSelectionPlan.runtimeSelectionPlanHash,
  jobRuntimeSelectionPlanHash: job.runtimeSelectionPlan.runtimeSelectionPlanHash,
  macFixtureSelection: fixtureMacWin.decisions[0]?.selectedShotId ?? "none",
  rejectedMacFixtureSelection: rejectedMacFixture.decisions[0]?.selectedShotId ?? "none",
  referenceOnlyFixtureSelection: referenceOnlyFixture.decisions[0]?.selectedShotId ?? "none",
  collisionRuntimeKeys,
  noneOrigin: noneDecision ? {
    noneOrigin: noneDecision.blockedCode === "OPTIONAL_SCENE_SKIPPED" ? "optional scene skip" : "other",
    sceneId: noneDecision.sceneId,
    sceneRequiredness: noneDecision.sceneRequiredness,
    selectionStatus: noneDecision.selectionStatus,
    fallbackUsed: noneDecision.fallbackUsed,
    fallbackReason: noneDecision.fallbackReason ?? "none",
    blockedCode: noneDecision.blockedCode ?? "none",
    canEnterArticleVideoJob: noneDecision.sceneRequiredness === "optional" && noneDecision.selectionStatus === "optional_skipped",
  } : undefined,
  duplicateFixtureSelections: duplicatePlan.decisions.map((item) => item.selectedShotId ?? "none"),
  duplicateFixtureStatuses: duplicatePlan.decisions.map((item) => item.selectionStatus),
  duplicateFixtureBlockedCodes: duplicatePlan.decisions.map((item) => item.blockedCode ?? "none"),
  requiredNoCompatibleStatus: requiredNoCompatibleDecision?.selectionStatus ?? "none",
  requiredNoCompatibleBlockedCode: requiredNoCompatibleDecision?.blockedCode ?? "none",
  optionalNoCompatibleStatus: optionalNoCompatibleDecision?.selectionStatus ?? "none",
  optionalNoCompatibleBlockedCode: optionalNoCompatibleDecision?.blockedCode ?? "none",
  fallbackReason: fallbackPlan.decisions[0]?.fallbackReason ?? "none",
};
fs.mkdirSync(".asset-sync-cache", { recursive: true });
fs.writeFileSync(path.join(".asset-sync-cache", "shot-production-wiring-qa-summary.json"), JSON.stringify(summary, null, 2));

console.log(`shotProductionWiringQaStatus=${summary.status}`);
console.log(`articleRuntimeSelections=${runtimeSelections.join(",")}`);
console.log(`shotPlannerSelections=${plannerSelections.join(",")}`);
console.log(`jobSavedSelections=${jobSavedSelections.join(",")}`);
console.log(`remotionSelections=${remotionSelections.join(",")}`);
console.log(`runtimeSelectionPlanHashMatch=${checks.adapterAndPlannerSharePlanHash && checks.jobFourStagePlanHashMatch}`);
console.log(`macFixtureSelection=${summary.macFixtureSelection}`);
console.log(`rejectedMacFixtureSelection=${summary.rejectedMacFixtureSelection}`);
console.log(`referenceOnlyFixtureSelection=${summary.referenceOnlyFixtureSelection}`);
console.log(`noneOrigin=${summary.noneOrigin ? `${summary.noneOrigin.noneOrigin};sceneId=${summary.noneOrigin.sceneId};sceneRequiredness=${summary.noneOrigin.sceneRequiredness};selectionStatus=${summary.noneOrigin.selectionStatus};fallbackUsed=${summary.noneOrigin.fallbackUsed};fallbackReason=${summary.noneOrigin.fallbackReason};blockedCode=${summary.noneOrigin.blockedCode};canEnterArticleVideoJob=${summary.noneOrigin.canEnterArticleVideoJob}` : "none"}`);
console.log(`duplicateFixtureSelections=${summary.duplicateFixtureSelections.join(",")}`);
console.log(`duplicateFixtureStatuses=${summary.duplicateFixtureStatuses.join(",")}`);
console.log(`duplicateFixtureBlockedCodes=${summary.duplicateFixtureBlockedCodes.join(",")}`);
console.log(`requiredNoCompatibleStatus=${summary.requiredNoCompatibleStatus};blockedCode=${summary.requiredNoCompatibleBlockedCode}`);
console.log(`optionalNoCompatibleStatus=${summary.optionalNoCompatibleStatus};blockedCode=${summary.optionalNoCompatibleBlockedCode}`);
console.log(`fallbackReason=${summary.fallbackReason}`);
console.log(`checks=${Object.entries(checks).map(([key, value]) => `${key}:${value}`).join(";")}`);
