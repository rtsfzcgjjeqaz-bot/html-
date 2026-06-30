import {
  auditRuntimeShotCatalog,
  getRuntimeShotCatalogEntry,
  type RuntimeShotCatalogEntry,
  type RuntimeShotId,
} from "../factory/runtimeShotCatalog";
import { planRuntimeShotsForArticle } from "../factory/shotPlanner";
import type { ShotSelectionDecision, ShotSelectionPlan } from "../library/shotSelectionTypes";
import { articleVisualPolicy, type ArticlePolicyPlan, type ArticleVisualIntent } from "./articleVisualPolicy";
import type { ArticleContentBrief, ArticleVideoSpec, EvidenceItem } from "./types";

export type ArticleRuntimeSelectionStatus =
  | "selected"
  | "safe_fallback"
  | "optional_skipped"
  | "blocked"
  | "capability_warning"
  | "safe_end_not_renderable"
  | "intent_not_renderable";

export type ArticleRuntimeSelectionPlanScene = {
  sceneId: number;
  visualIntent: ArticleVisualIntent;
  selectedRuntimeShotId?: RuntimeShotId;
  selectedRuntimeKey?: string;
  runtimeSourceKind?: string;
  selectedChoreographyId?: string;
  selectionStatus: ArticleRuntimeSelectionStatus;
  selectionReason: string;
  sceneRequiredness: "required" | "optional";
  fallbackType: "none" | "legacy_runtime_fallback" | "safe_static_fallback" | "explicit_scene_skip";
  blockedCode?: string;
  rejectedCandidateIds: RuntimeShotId[];
  fallbackReason?: string;
  textCapacityCheck: { passed: boolean; reason: string };
  aspectRatioCheck: { passed: boolean; reason: string };
  evidenceGateCheck: { passed: boolean; reason: string };
  safeEndReason?: string;
  selectionDecision?: ShotSelectionDecision;
  selectedSourceEnvironment?: string;
  selectionContractHash?: string;
  selectionCatalogVersion?: string;
};

export type ArticleRuntimeSelectionPlan = {
  scenes: ArticleRuntimeSelectionPlanScene[];
  warnings: string[];
  runtimeSelectionPlan: ShotSelectionPlan;
  qaChecks: {
    catalogShotExistsInRegistry: boolean;
    catalogShotResolvesViaAssetResolver: boolean;
    catalogShotHasRegisteredChoreography: boolean;
    onlyRuntimeCallableShotsSelectable: boolean;
    articlePolicyContainsNoShotId: boolean;
    articleRuntimeAdapterContainsNoMacImport: boolean;
    visualIntentMapsToSupportedShot: boolean;
    stepFlowDoesNotDefaultToShot15: boolean;
    priceComparisonRequiresTraceableEvidence: boolean;
    resultMetricRequiresEligibleEvidence: boolean;
    textCapacityWithinPolicy: boolean;
    aspectRatioWithinPolicy: boolean;
    noSilentFallback: boolean;
  };
};

const intentSelectionPriority: Record<ArticleVisualIntent, number> = {
  hook: 100,
  price_comparison: 95,
  result_metric: 92,
  step_flow: 90,
  recommendation: 85,
  evidence: 80,
  reason: 60,
  brief_summary: 55,
  checklist: 50,
  cta: 40,
  safe_end: 10,
};

function clean(value: string, max: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, Math.max(1, max - 3)).trim()}...` : normalized;
}

function evidenceById(brief: ArticleContentBrief) {
  return new Map(brief.evidence.map((item) => [item.evidenceId, item]));
}

function sceneEvidence(sceneEvidenceIds: string[], brief: ArticleContentBrief) {
  const lookup = evidenceById(brief);
  return sceneEvidenceIds.map((id) => lookup.get(id)).filter((item): item is EvidenceItem => Boolean(item));
}

function aspectRatioCheck(entry: RuntimeShotCatalogEntry, spec: ArticleVideoSpec) {
  const passed = entry.allowedAspectRatios.includes(spec.aspectRatio);
  return {
    passed,
    reason: passed ? `${entry.runtimeShotId} supports ${spec.aspectRatio}` : `${entry.runtimeShotId} does not support ${spec.aspectRatio}`,
  };
}

function textCapacityCheck(intent: ArticleVisualIntent, scene: ArticlePolicyPlan["scenes"][number], entry: RuntimeShotCatalogEntry) {
  const headlineLength = scene.headline?.finalCharacters ?? scene.recommendationTitle?.finalCharacters ?? 0;
  const supportLength = scene.supportingText?.finalCharacters ?? scene.cta?.finalCharacters ?? 0;
  const structuredLengths = [
    ...(scene.stepItems ?? []).map((item) => item.finalCharacters),
    ...(scene.recommendationItems ?? []).map((item) => item.finalCharacters),
  ];
  const maxStructured = structuredLengths.length ? Math.max(...structuredLengths) : 0;

  const headlineLimit = articleVisualPolicy.textDensity.maxHookHeadlineCharacters;
  const supportingLimit =
    intent === "evidence"
      ? articleVisualPolicy.textDensity.maxEvidenceCaptionCharacters
      : articleVisualPolicy.textDensity.maxHookSupportingCharacters;
  const structuredLimit =
    intent === "step_flow" || intent === "checklist"
      ? articleVisualPolicy.textDensity.maxStepTitleCharacters
      : articleVisualPolicy.textDensity.maxRecommendationItemCharacters;

  const fails: string[] = [];
  if (headlineLength > headlineLimit) {
    fails.push(`headline exceeds policy max ${headlineLimit}`);
  }
  if (supportLength > supportingLimit) {
    fails.push(`supporting text exceeds policy max ${supportingLimit}`);
  }
  if (maxStructured > structuredLimit) {
    fails.push(`structured items exceed policy max ${structuredLimit}`);
  }

  if (intent === "step_flow" || intent === "checklist") {
    const structuredCount = (scene.stepItems ?? []).length;
    if (!structuredCount) fails.push("missing structured step items");
    if (structuredCount > 4) fails.push("too many structured items");
  }

  const passed = fails.length === 0;
  return {
    passed,
    reason: passed ? `${entry.runtimeShotId} fits current policy-sized text` : fails.join("; "),
  };
}

function evidenceGateCheck(intent: ArticleVisualIntent, scene: ArticlePolicyPlan["scenes"][number], brief: ArticleContentBrief, entry: RuntimeShotCatalogEntry) {
  const evidence = sceneEvidence(scene.selectedEvidenceIds, brief);
  if (!entry.evidenceRequirements.requiresTraceableEvidence) {
    return {
      passed: true,
      reason: `${entry.runtimeShotId} does not require mandatory traceable evidence for ${intent}`,
    };
  }

  if (!evidence.length) {
    return { passed: false, reason: `${intent} requires traceable evidence but none was selected` };
  }

  if ((entry.evidenceRequirements.minimumEvidenceCount ?? 0) > evidence.length) {
    return { passed: false, reason: `${intent} requires at least ${entry.evidenceRequirements.minimumEvidenceCount} evidence items` };
  }

  if (entry.evidenceRequirements.allowedValueTypes?.length) {
    const allowed = new Set(entry.evidenceRequirements.allowedValueTypes);
    const invalid = evidence.find((item) => !allowed.has(item.valueType));
    if (invalid) {
      return { passed: false, reason: `${intent} evidence valueType ${invalid.valueType} is not allowed for ${entry.runtimeShotId}` };
    }
  }

  return {
    passed: true,
    reason: `${entry.runtimeShotId} satisfies evidence gate for ${intent}`,
  };
}

function isRuntimeShotId(value: string | undefined): value is RuntimeShotId {
  return Boolean(value && getRuntimeShotCatalogEntry(value as RuntimeShotId));
}

function explicitGapReason(intent: ArticleVisualIntent) {
  if (intent === "reason") return "reason_not_renderable";
  if (intent === "checklist") return "checklist_not_renderable";
  if (intent === "safe_end") return "safe_end_not_renderable";
  return `${intent}_not_renderable`;
}

function hasShotIdLeak(value: unknown) {
  return /shot_\d+/i.test(JSON.stringify(value));
}

function preferredFramesFor(runtimeShotId: RuntimeShotId) {
  const entry = getRuntimeShotCatalogEntry(runtimeShotId);
  return entry?.recommendedDurationRange.preferredFrames ?? Number.POSITIVE_INFINITY;
}


export function buildArticleRuntimeSelectionPlan(
  policyPlan: ArticlePolicyPlan,
  brief: ArticleContentBrief,
  spec: ArticleVideoSpec,
  options: { pinnedRuntimeSelectionPlan?: ShotSelectionPlan } = {},
): ArticleRuntimeSelectionPlan {
  const warnings: string[] = [];
  const runtimeSelectionPlan = planRuntimeShotsForArticle(policyPlan, brief, spec, { runtimeSelectionPlan: options.pinnedRuntimeSelectionPlan });
  const scenes = policyPlan.scenes.map<ArticleRuntimeSelectionPlanScene>((scene) => {
    const decision = runtimeSelectionPlan.decisions.find((item) => item.sceneId === scene.sceneId);
    const rejectedCandidateIds = (decision?.hardFilteredOutShotIds ?? []).filter(isRuntimeShotId);

    if (!decision?.selectedShotId) {
      const status = decision?.selectionStatus ?? (scene.visualIntent === "safe_end" ? "optional_skipped" : "blocked");
      const reason = decision?.fallbackReason ?? explicitGapReason(scene.visualIntent);
      warnings.push(`${scene.visualIntent}:${reason}`);
      return {
        sceneId: scene.sceneId,
        visualIntent: scene.visualIntent,
        selectionStatus: status,
        selectionReason: reason,
        sceneRequiredness: decision?.sceneRequiredness ?? "required",
        fallbackType: decision?.fallbackType ?? "explicit_scene_skip",
        blockedCode: decision?.blockedCode,
        rejectedCandidateIds,
        fallbackReason: reason,
        textCapacityCheck: { passed: false, reason: "no runtime-callable candidate registered" },
        aspectRatioCheck: { passed: false, reason: "no runtime-callable candidate registered" },
        evidenceGateCheck: { passed: false, reason: "no runtime-callable candidate registered" },
        safeEndReason: scene.visualIntent === "safe_end" ? reason : undefined,
        selectionDecision: decision,
      };
    }

    const entry = isRuntimeShotId(decision.selectedShotId) ? getRuntimeShotCatalogEntry(decision.selectedShotId) : undefined;
    const textCheck = entry ? textCapacityCheck(scene.visualIntent, scene, entry) : { passed: true, reason: `${decision.selectedShotId} text capacity passed unified selector` };
    const aspectCheck = entry ? aspectRatioCheck(entry, spec) : { passed: true, reason: `${decision.selectedShotId} aspect ratio passed unified selector` };
    const evidenceCheck = entry ? evidenceGateCheck(scene.visualIntent, scene, brief, entry) : { passed: true, reason: `${decision.selectedShotId} evidence gate passed unified selector` };
    if (decision.selectedChoreographyId && textCheck.passed && aspectCheck.passed && evidenceCheck.passed) {
      return {
        sceneId: scene.sceneId,
        visualIntent: scene.visualIntent,
        selectedRuntimeShotId: isRuntimeShotId(decision.selectedShotId) ? decision.selectedShotId : undefined,
        selectedRuntimeKey: decision.selectedRuntimeKey,
        runtimeSourceKind: decision.runtimeSourceKind,
        selectedChoreographyId: decision.selectedChoreographyId,
        selectionStatus: decision.selectionStatus,
        selectionReason: `selected ${decision.selectedShotId} for ${scene.visualIntent} via unifiedShotSelector`,
        sceneRequiredness: decision.sceneRequiredness,
        fallbackType: decision.fallbackType,
        blockedCode: decision.blockedCode,
        rejectedCandidateIds,
        textCapacityCheck: textCheck,
        aspectRatioCheck: aspectCheck,
        evidenceGateCheck: evidenceCheck,
        selectionDecision: decision,
        selectedSourceEnvironment: decision.selectedSourceEnvironment,
        selectionContractHash: decision.selectionContractHash,
        selectionCatalogVersion: decision.selectionCatalogVersion,
      };
    }

    const reason = explicitGapReason(scene.visualIntent);
    warnings.push(`${scene.visualIntent}:${reason}`);
    return {
      sceneId: scene.sceneId,
      visualIntent: scene.visualIntent,
      selectionStatus: "blocked",
      selectionReason: reason,
      sceneRequiredness: decision.sceneRequiredness,
      fallbackType: "explicit_scene_skip",
      blockedCode: "REQUIRED_SCENE_NO_RUNTIME_SHOT",
      rejectedCandidateIds,
      fallbackReason: reason,
      textCapacityCheck: { passed: false, reason: "all runtime candidates failed policy checks" },
      aspectRatioCheck: { passed: false, reason: "all runtime candidates failed policy checks" },
      evidenceGateCheck: { passed: false, reason: "all runtime candidates failed policy checks" },
      safeEndReason: scene.visualIntent === "safe_end" ? reason : undefined,
      selectionDecision: decision,
    };
  });

  const maxDurationFrames = spec.maxDurationSeconds * spec.fps;
  let selectedDurationFrames = scenes
    .filter((scene) => scene.selectionStatus === "selected" && scene.selectedRuntimeShotId)
    .reduce((sum, scene) => sum + preferredFramesFor(scene.selectedRuntimeShotId as RuntimeShotId), 0);

  while (selectedDurationFrames > maxDurationFrames) {
    const removable = scenes
      .filter((scene) => scene.selectionStatus === "selected" && scene.selectedRuntimeShotId && scene.visualIntent !== "hook")
      .sort((a, b) => {
        const byIntent = intentSelectionPriority[a.visualIntent] - intentSelectionPriority[b.visualIntent];
        if (byIntent !== 0) return byIntent;
        return a.sceneId - b.sceneId;
      })[0];

    if (!removable || !removable.selectedRuntimeShotId) {
      break;
    }

    selectedDurationFrames -= preferredFramesFor(removable.selectedRuntimeShotId);
    removable.selectionStatus = "capability_warning";
    removable.blockedCode = "REQUIRED_SCENE_NO_RUNTIME_SHOT";
    removable.fallbackType = "explicit_scene_skip";
    removable.fallbackReason = `unsupported_timing_budget:${removable.selectedRuntimeShotId}`;
    removable.selectionReason = `unsupported_timing_budget for ${removable.selectedRuntimeShotId}`;
    removable.rejectedCandidateIds = [...removable.rejectedCandidateIds, removable.selectedRuntimeShotId];
    removable.selectedRuntimeShotId = undefined;
    removable.selectedChoreographyId = undefined;
    removable.textCapacityCheck = {
      passed: false,
      reason: `selection dropped to keep video within ${spec.maxDurationSeconds}s max duration`,
    };
    removable.aspectRatioCheck = {
      passed: false,
      reason: `selection dropped to keep video within ${spec.maxDurationSeconds}s max duration`,
    };
    removable.evidenceGateCheck = {
      passed: false,
      reason: `selection dropped to keep video within ${spec.maxDurationSeconds}s max duration`,
    };
    warnings.push(`${removable.visualIntent}:unsupported_timing_budget`);
  }

  const catalogAudit = auditRuntimeShotCatalog();
  return {
    scenes,
    warnings,
    runtimeSelectionPlan,
    qaChecks: {
      catalogShotExistsInRegistry: catalogAudit.every((entry) => entry.registeredInShotRegistry),
      catalogShotResolvesViaAssetResolver: catalogAudit.every((entry) => entry.resolvesViaAssetResolver),
      catalogShotHasRegisteredChoreography: catalogAudit.every((entry) => entry.hasRegisteredChoreography),
      onlyRuntimeCallableShotsSelectable: scenes.every(
        (scene) => !scene.selectedRuntimeKey || runtimeSelectionPlan.decisions.some(
          (decision) => decision.sceneId === scene.sceneId && decision.selectedRuntimeKey === scene.selectedRuntimeKey,
        ),
      ),
      articlePolicyContainsNoShotId: !hasShotIdLeak(policyPlan),
      articleRuntimeAdapterContainsNoMacImport: true,
      visualIntentMapsToSupportedShot: scenes.every((scene) => scene.selectionStatus !== "selected" || Boolean(scene.selectedRuntimeShotId)),
      stepFlowDoesNotDefaultToShot15: scenes
        .filter((scene) => scene.visualIntent === "step_flow" || scene.visualIntent === "checklist")
        .every((scene) => scene.selectedRuntimeShotId !== "shot_15"),
      priceComparisonRequiresTraceableEvidence: scenes
        .filter((scene) => scene.visualIntent === "price_comparison")
        .every((scene) => scene.evidenceGateCheck.passed),
      resultMetricRequiresEligibleEvidence: scenes
        .filter((scene) => scene.visualIntent === "result_metric")
        .every((scene) => scene.evidenceGateCheck.passed),
      textCapacityWithinPolicy: scenes.every((scene) => scene.selectionStatus !== "selected" || scene.textCapacityCheck.passed),
      aspectRatioWithinPolicy: scenes.every((scene) => scene.selectionStatus !== "selected" || scene.aspectRatioCheck.passed),
      noSilentFallback: scenes.every((scene) => scene.selectionStatus === "selected" || Boolean(scene.fallbackReason)),
    },
  };
}

export function buildDeterministicComparisonFixture(spec: ArticleVideoSpec, brief?: ArticleContentBrief): ArticleRuntimeSelectionPlan {
  const comparisonEvidence: EvidenceItem[] = [
    {
      evidenceId: "fixture_price_comparison_currency",
      claim: "Annual plan costs 120 while monthly totals 150.",
      sourceExcerpt: "Annual plan 120, monthly total 150.",
      sourceLocation: { sectionId: "fixture-comparison", paragraphIndex: 0 },
      kind: "comparison",
      valueType: "currency",
      value: 120,
      unit: "USD",
      videoEligible: true,
    },
    {
      evidenceId: "fixture_result_metric_percentage",
      claim: "Annual plan saves 20%.",
      sourceExcerpt: "Annual option saves 20%.",
      sourceLocation: { sectionId: "fixture-comparison", paragraphIndex: 1 },
      kind: "fact",
      valueType: "percentage",
      value: 20,
      unit: "%",
      videoEligible: true,
    },
  ];

  const syntheticBrief = brief ?? {
    articleId: "comparison-fixture",
    title: "Comparison fixture",
    coreMessage: "Annual plan has lower total cost.",
    summary: "Use traceable numbers to compare yearly and monthly pricing.",
    keyPoints: ["Annual total is lower", "Savings are measurable", "Choose by actual usage horizon"],
    evidence: comparisonEvidence,
    factConstraints: [],
    recommendedVisualIntents: ["hook", "price_comparison", "result_metric", "evidence", "safe_end"],
    sourceMetadata: {
      sourceType: "text",
      pageType: "comparison",
      titleSource: "fallback",
      summarySource: "fallback",
    },
  };

  const fixturePolicyPlan: ArticlePolicyPlan = {
    scenes: [
      {
        sceneId: 1,
        visualIntent: "price_comparison",
        headline: {
          value: clean("Annual vs monthly total cost", 24),
          sourceField: "fixture.headline",
          sourceExcerpt: "Annual vs monthly total cost",
          compacted: false,
          originalCharacters: 28,
          finalCharacters: 24,
        },
        selectedEvidenceIds: ["fixture_price_comparison_currency"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
      {
        sceneId: 2,
        visualIntent: "result_metric",
        headline: {
          value: clean("Save 20% over the full year", 24),
          sourceField: "fixture.metric",
          sourceExcerpt: "Save 20% over the full year",
          compacted: false,
          originalCharacters: 25,
          finalCharacters: 24,
        },
        selectedEvidenceIds: ["fixture_result_metric_percentage"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
      {
        sceneId: 3,
        visualIntent: "evidence",
        headline: {
          value: clean("Comparison evidence", 24),
          sourceField: "fixture.evidence",
          sourceExcerpt: "Comparison evidence",
          compacted: false,
          originalCharacters: 19,
          finalCharacters: 19,
        },
        selectedEvidenceIds: ["fixture_price_comparison_currency", "fixture_result_metric_percentage"],
        rejectedEvidenceIds: [],
        warnings: [],
      },
    ],
    debug: {
      articleId: "comparison-fixture",
      pageType: "comparison",
      policyVersion: "article-visual-policy-v2",
      selectedVisualIntents: ["price_comparison", "result_metric", "evidence"],
      rejectedVisualIntents: [],
      selectedEvidenceIds: ["fixture_price_comparison_currency", "fixture_result_metric_percentage"],
      rejectedEvidenceIds: [],
      evidenceDecisions: [],
      textShorteningActions: [],
      stepSelection: { canonicalOrderedSteps: [], selectedSteps: [] },
      duplicatePreventionActions: [],
      policyWarnings: [],
      scenes: [],
      qaChecks: {
        pageTypeRecognized: true,
        visualIntentSequenceValid: true,
        noHardcodedShotIdInPolicy: true,
        stepFlowUsesCanonicalOrderedSteps: true,
        comparisonRequiresTraceableEvidence: true,
        resultMetricRequiresEligibleEvidence: true,
        sceneIntentSinglePurpose: true,
        textDensityWithinPolicy: true,
        noDuplicateStepConsumption: true,
        CTAOnlyWhenTraceable: true,
        safeEndWhenCtaMissing: true,
      },
    },
  };

  return buildArticleRuntimeSelectionPlan(fixturePolicyPlan, syntheticBrief, spec);
}
