import { getShot, getShotPath, type ShotAsset } from "../../assets/index/asset-resolver";
import { getRuntimeShotCatalogEntry, type RuntimeShotId } from "./runtimeShotCatalog";
import { getChoreographyEntry, materializeAnimationTracks } from "../motion/choreographyRegistry";
import type { ChoreographyAnimationTrack, StyleProfileId } from "../motion/choreographyTypes";
import type { PlannedScene } from "./videoVariantPlanner";
import { listUnifiedShotSelectionContracts } from "../library/assetLibraryCatalog";
import { selectShotsForScenes } from "../library/unifiedShotSelector";
import type { ShotSelectionDecision, ShotSelectionPlan, ShotSelectionSceneInput } from "../library/shotSelectionTypes";
import { localRuntimeKey, runtimeSourceKindFromRuntimeKey } from "../library/runtimeIdentity";
import type { ArticleContentBrief, ArticleVideoSpec } from "../article/types";
import type { ArticlePolicyPlan } from "../article/articleVisualPolicy";

export type ResolvedScene = PlannedScene & {
  id: number;
  durationInFrames: number;
  headline: string;
  supportingText: string;
  visualType: string;
  componentProps: Record<string, unknown>;
  selectedShotId?: RuntimeShotId;
  choreographyId?: string;
  motionPresetIds: string[];
  visualAssetRefs: string[];
  selectedRuntimeKey?: string;
  selectedRuntimeSourceKind?: string;
  selectedEvidenceIds?: string[];
  fallbackReason?: string;
  shotRuntimeDebug?: {
    shotPath?: string;
    resolvedVia?: "asset-resolver";
    visualDispatch: "SceneRenderer" | "SceneFallback";
    motionComposer: "enabled" | "fallback";
    notes: string[];
  };
};

export type ShotPlannerDebugEntry = {
  sceneId: number;
  selectedShotId?: string;
  selectedRuntimeKey?: string;
  selectedRuntimeSourceKind?: string;
  shotPath?: string;
  choreographyId?: string;
  visualType: string;
  resolvedVia?: "asset-resolver";
  visualDispatch: "SceneRenderer" | "SceneFallback";
  motionComposer: "enabled" | "fallback";
  fallbackReason?: string;
};

export type ShotPlannerResult = {
  scenes: ResolvedScene[];
  debug: ShotPlannerDebugEntry[];
  runtimeSelectionPlan: ShotSelectionPlan;
};

type ShotPlannerOptions = {
  fps: number;
  profile: StyleProfileId;
  narrativeId: string;
  allowedChoreographyIds?: string[];
  excludedChoreographyIds?: string[];
  runtimeSelectionPlan?: ShotSelectionPlan;
};

type RuntimeCandidate = {
  shotId: RuntimeShotId;
  runtimeKey: string;
  sceneType: string;
  visualType: string;
};

const openingHookCandidate: RuntimeCandidate = { shotId: "shot_01", runtimeKey: localRuntimeKey("shot_01"), sceneType: "coverHook", visualType: "coverHook" };
const recommendationCandidate: RuntimeCandidate = {
  shotId: "shot_51",
  runtimeKey: localRuntimeKey("shot_51"),
  sceneType: "aiRecommendation",
  visualType: "recommendationPanel",
};
const infoCandidate: RuntimeCandidate = { shotId: "shot_15", runtimeKey: localRuntimeKey("shot_15"), sceneType: "appGrid", visualType: "dashboardGrid" };
const runtimeCandidates: Record<NonNullable<PlannedScene["preferredRuntimeShotId"]>, RuntimeCandidate> = {
  shot_01: openingHookCandidate,
  shot_03: { shotId: "shot_03", runtimeKey: localRuntimeKey("shot_03"), sceneType: "stepFlow", visualType: "stepFlowRail" },
  shot_15: infoCandidate,
  shot_25: { shotId: "shot_25", runtimeKey: localRuntimeKey("shot_25"), sceneType: "searchDemo", visualType: "searchRows" },
  shot_27: { shotId: "shot_27", runtimeKey: localRuntimeKey("shot_27"), sceneType: "resultComparison", visualType: "splitCompareCards" },
  shot_30: { shotId: "shot_30", runtimeKey: localRuntimeKey("shot_30"), sceneType: "finalCTA", visualType: "finalCTA" },
  shot_35: { shotId: "shot_35", runtimeKey: localRuntimeKey("shot_35"), sceneType: "websiteHero", visualType: "websiteHeroAngledProductSurface" },
  shot_36: { shotId: "shot_36", runtimeKey: localRuntimeKey("shot_36"), sceneType: "emailDraftDemo", visualType: "emailDraftGenerationDemo" },
  shot_50: { shotId: "shot_50", runtimeKey: localRuntimeKey("shot_50"), sceneType: "priceInsight", visualType: "priceInsight" },
  shot_51: recommendationCandidate,
};

function isRuntimeShotId(value: string | undefined): value is RuntimeShotId {
  return Boolean(value && getRuntimeShotCatalogEntry(value as RuntimeShotId));
}

function runtimeCandidateForShotId(shotId: string | undefined): RuntimeCandidate | undefined {
  if (!isRuntimeShotId(shotId)) return undefined;
  const entry = getRuntimeShotCatalogEntry(shotId);
  return {
    shotId,
    runtimeKey: localRuntimeKey(shotId),
    sceneType: entry?.sceneType ?? runtimeCandidates[shotId].sceneType,
    visualType: entry?.visualType ?? runtimeCandidates[shotId].visualType,
  };
}

function runtimeCandidateForDecision(decision: ShotSelectionDecision | undefined): RuntimeCandidate | undefined {
  if (!decision?.selectedRuntimeKey || !decision.selectedShotId) return undefined;
  if (!decision.selectedRuntimeKey.startsWith("local:")) return undefined;
  return runtimeCandidateForShotId(decision.selectedShotId);
}

function sceneRequirednessForIntent(intent: ShotSelectionSceneInput["visualIntent"]) {
  return intent === "reason" || intent === "brief_summary" || intent === "checklist" || intent === "cta" || intent === "safe_end"
    ? "optional"
    : "required";
}

function selectionInputForScene(scene: PlannedScene, index: number, fps: number): ShotSelectionSceneInput {
  const visualIntent = String(scene.visualIntent ?? "reason") as ShotSelectionSceneInput["visualIntent"];
  return {
    sceneId: Number(scene.id ?? index + 1),
    visualIntent,
    sceneRole: visualIntent === "recommendation" ? "product_demo" : visualIntent === "price_comparison" ? "comparison" : visualIntent === "step_flow" ? "workflow" : visualIntent,
    sourceEvidenceTypes: [],
    semanticKeywords: [
      visualIntent,
      ...(Array.isArray(scene.dataFocus) ? scene.dataFocus : []),
      ...(Array.isArray(scene.textOverlay) ? scene.textOverlay : []),
    ].join(" ").toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean),
    requiredTextFields: ["headline"],
    targetDurationFrames: Math.max(1, Math.round(Number(scene.duration || 4) * fps)),
    aspectRatio: "16:9",
    sceneRequiredness: sceneRequirednessForIntent(visualIntent),
  };
}

function articleSceneEvidence(sceneEvidenceIds: string[], brief: ArticleContentBrief) {
  const lookup = new Map(brief.evidence.map((item) => [item.evidenceId, item]));
  return sceneEvidenceIds.map((id) => lookup.get(id)).filter((item): item is ArticleContentBrief["evidence"][number] => Boolean(item));
}

function articleSelectionInputForScene(
  scene: ArticlePolicyPlan["scenes"][number],
  brief: ArticleContentBrief,
): ShotSelectionSceneInput {
  const evidence = articleSceneEvidence(scene.selectedEvidenceIds, brief);
  const keywords = [
    scene.visualIntent,
    ...(scene.headline?.value ? scene.headline.value.split(/\s+/) : []),
    ...(scene.recommendationTitle?.value ? scene.recommendationTitle.value.split(/\s+/) : []),
    ...(scene.visualIntent === "recommendation" ? ["ai_recommendation", "prompt_composer"] : []),
    ...(scene.visualIntent === "price_comparison" ? ["price", "currency", "comparison", "table"] : []),
    ...(scene.visualIntent === "step_flow" ? ["workflow", "cursor_interaction", "website_ui"] : []),
  ].map((item) => item.toLowerCase());
  const requiredTextFields: ShotSelectionSceneInput["requiredTextFields"] = ["headline"];
  if (scene.supportingText || scene.recommendationTitle) requiredTextFields.push("supportingText");
  if ((scene.stepItems?.length ?? 0) > 0 || (scene.recommendationItems?.length ?? 0) > 0) requiredTextFields.push("structuredItems");
  const targetDurationFrames = scene.visualIntent === "recommendation" ? 140 : scene.visualIntent === "step_flow" ? 144 : 120;
  return {
    sceneId: scene.sceneId,
    visualIntent: scene.visualIntent,
    sceneRole: scene.visualIntent === "recommendation" ? "product_demo" : scene.visualIntent === "price_comparison" ? "comparison" : scene.visualIntent === "step_flow" ? "workflow" : scene.visualIntent,
    sourceEvidenceTypes: evidence.map((item) => item.valueType),
    semanticKeywords: [...new Set(keywords)],
    requiredTextFields: [...new Set(requiredTextFields)],
    targetDurationFrames,
    aspectRatio: "16:9",
    sceneRequiredness: sceneRequirednessForIntent(scene.visualIntent),
  };
}

export function planRuntimeShotsForArticle(
  policyPlan: ArticlePolicyPlan,
  brief: ArticleContentBrief,
  _spec: ArticleVideoSpec,
  options: { runtimeSelectionPlan?: ShotSelectionPlan } = {},
): ShotSelectionPlan {
  void _spec;
  if (options.runtimeSelectionPlan) return options.runtimeSelectionPlan;
  return selectShotsForScenes(policyPlan.scenes.map((scene) => articleSelectionInputForScene(scene, brief)), undefined, { contracts: listUnifiedShotSelectionContracts() });
}

function textParts(scene: PlannedScene) {
  const lines = Array.isArray(scene.textOverlay) ? scene.textOverlay.filter(Boolean) : [];
  const headline = String(lines[0] ?? scene.visualIntent ?? "Website insight");
  const supportingText = String(lines[1] ?? scene.audioCue ?? scene.visualIntent ?? "");
  return { headline, supportingText };
}

function visualRefs(scene: PlannedScene) {
  return [
    ...(scene.assets?.image ?? []),
    ...(scene.assets?.appIcons ?? []).map((icon) => icon.src).filter(Boolean),
  ];
}

function stripUnexecutedChoreography(scene: PlannedScene): PlannedScene {
  const {
    choreographyId: _choreographyId,
    animationTracks: _animationTracks,
    choreographyBlockedReason: _choreographyBlockedReason,
    ...rest
  } = scene;
  void _choreographyId;
  void _animationTracks;
  void _choreographyBlockedReason;
  return rest as PlannedScene;
}

function toResolvedFallback(scene: PlannedScene, index: number, fps: number): ResolvedScene {
  const base = stripUnexecutedChoreography(scene);
  const { headline, supportingText } = textParts(scene);
  const visualType = String(scene.visualTemplate ?? scene.sceneType ?? "defaultVisual");
  return {
    ...base,
    id: Number(scene.id ?? index + 1),
    durationInFrames: Math.max(1, Math.round(Number(scene.duration || 5) * fps)),
    headline,
    supportingText,
    visualType,
    componentProps: {
      visualIntent: scene.visualIntent,
      dataFocus: scene.dataFocus ?? [],
      textOverlay: scene.textOverlay ?? [],
      ...(scene.componentProps ?? {}),
    },
    motionPresetIds: scene.motionIds ?? [],
    visualAssetRefs: visualRefs(scene),
    selectedEvidenceIds: scene.evidenceIds ?? [],
  };
}

function choreographyIdFor(shot: ShotAsset) {
  return shot.choreography_id ?? shot.remotion?.choreography_id ?? shot.choreography?.choreographyId;
}

function buildFallbackReason(shot: ShotAsset, candidate: RuntimeCandidate, options: ShotPlannerOptions) {
  const choreographyId = choreographyIdFor(shot);
  if (!shot.approval?.approved || !shot.approval?.allowed_in_factory) {
    return `Shot ${candidate.shotId} is not approved for factory use.`;
  }
  if (shot.batch?.compatible === false || shot.batch?.filesystem_dependency === true) {
    return `Shot ${candidate.shotId} is not batch-safe or has a filesystem dependency.`;
  }
  if (!choreographyId) {
    return `Shot ${candidate.shotId} has no choreography_id.`;
  }
  if (options.excludedChoreographyIds?.includes(choreographyId)) {
    return `Choreography ${choreographyId} is excluded by CLI override.`;
  }
  if (options.allowedChoreographyIds?.length && !options.allowedChoreographyIds.includes(choreographyId)) {
    return `Choreography ${choreographyId} is not in the restricted include list.`;
  }
  const entry = getChoreographyEntry(choreographyId);
  if (!entry) {
    return `Choreography ${choreographyId} is not registered.`;
  }
  if (!entry.approved || !entry.allowedInFactory) {
    return `Choreography ${choreographyId} is not approved for factory use.`;
  }
  if (entry.sceneType !== candidate.sceneType) {
    return `Choreography ${choreographyId} sceneType ${entry.sceneType} is incompatible with ${candidate.sceneType}.`;
  }
  if (!entry.compatibleProfiles.includes(options.profile)) {
    return `Choreography ${choreographyId} is not compatible with profile ${options.profile}.`;
  }
  if (!entry.compatibleNarratives.includes(options.narrativeId)) {
    return `Choreography ${choreographyId} is not compatible with narrative ${options.narrativeId}.`;
  }
  const missingMotions = shot.atomic_motions.filter((motionId) => !entry.atomicMotions.includes(motionId));
  if (missingMotions.length) {
    return `Shot ${candidate.shotId} references unregistered motions: ${missingMotions.join(", ")}.`;
  }
  return undefined;
}

function applyShot(scene: PlannedScene, index: number, candidate: RuntimeCandidate, options: ShotPlannerOptions): ResolvedScene {
  const shot = getShot(candidate.shotId);
  const shotPath = getShotPath(candidate.shotId);
  const catalogEntry = getRuntimeShotCatalogEntry(candidate.shotId);
  const base = toResolvedFallback(scene, index, options.fps);
  const preferredFrames = shot.duration_frames?.preferred ?? shot.choreography?.durationFrames?.preferred ?? base.durationInFrames;
  const durationInFrames = Math.max(1, preferredFrames);
  const fallbackReason = buildFallbackReason(shot, candidate, options);
  const choreographyId = choreographyIdFor(shot);
  const animationTracks: ChoreographyAnimationTrack[] = fallbackReason || !choreographyId
    ? []
    : materializeAnimationTracks(choreographyId, durationInFrames);
  const enabled = !fallbackReason && Boolean(choreographyId) && animationTracks.length >= 4;
  const visualDispatch = enabled ? "SceneRenderer" : "SceneFallback";
  const motionComposer = enabled ? "enabled" : "fallback";
  const sceneLabel =
    candidate.shotId === "shot_01"
      ? "opening hook"
      : candidate.shotId === "shot_51"
        ? "ai recommendation"
        : "information reinforcement";

  return {
    ...base,
    duration: durationInFrames / options.fps,
    durationInFrames,
    sceneType: catalogEntry?.sceneType ?? candidate.sceneType,
    visualType: catalogEntry?.visualType ?? candidate.visualType,
    visualTemplate: enabled ? undefined : base.visualTemplate,
    selectedShotId: candidate.shotId,
    selectedRuntimeKey: candidate.runtimeKey,
    selectedRuntimeSourceKind: "local_runtime",
    choreographyId: enabled ? choreographyId : undefined,
    animationTracks: enabled ? animationTracks : undefined,
    motionPresetIds: shot.atomic_motions,
    motionIds: shot.atomic_motions,
    visualAssetRefs: visualRefs(scene),
    fallbackReason,
    componentProps: {
      ...base.componentProps,
      ...(scene.componentProps ?? {}),
      shotId: candidate.shotId,
      selectedRuntimeKey: candidate.runtimeKey,
      runtimeSourceKind: "local_runtime",
      shotPath,
      choreographyId,
      motionTags: shot.motion_tags,
      runtimeShotId: shot.runtimeShotId ?? candidate.shotId,
      sourceShotId: shot.sourceShotId,
      sourceLibrary: shot.sourceLibrary,
      sourceBranch: shot.sourceBranch,
      sourceChoreographyId: shot.sourceChoreographyId,
      adaptationStatus: shot.adaptationStatus,
      packageId: shot.packageId,
      evidenceIds: scene.evidenceIds ?? [],
    },
    selectedEvidenceIds: scene.evidenceIds ?? [],
    shotRuntimeDebug: {
      shotPath,
      resolvedVia: "asset-resolver",
      visualDispatch,
      motionComposer,
      notes: [
        `selected ${candidate.shotId} for ${sceneLabel}`,
        fallbackReason ?? `resolved ${choreographyId} with ${animationTracks.length} animation tracks`,
      ],
    },
  };
}

function applyMacShotDecision(scene: PlannedScene, index: number, decision: ShotSelectionDecision, options: ShotPlannerOptions): ResolvedScene {
  const base = toResolvedFallback(scene, index, options.fps);
  return {
    ...base,
    selectedShotId: decision.logicalShotId as RuntimeShotId | undefined,
    selectedRuntimeKey: decision.selectedRuntimeKey,
    selectedRuntimeSourceKind: decision.runtimeSourceKind ?? runtimeSourceKindFromRuntimeKey(decision.selectedRuntimeKey ?? ""),
    choreographyId: decision.selectedChoreographyId,
    visualType: decision.selectedChoreographyId ?? base.visualType,
    componentProps: {
      ...base.componentProps,
      ...(scene.componentProps ?? {}),
      shotId: decision.logicalShotId ?? decision.selectedShotId,
      selectedRuntimeKey: decision.selectedRuntimeKey,
      runtimeSourceKind: decision.runtimeSourceKind,
      sourceEnvironment: decision.selectedSourceEnvironment,
      runtimeShotId: decision.logicalShotId ?? decision.selectedShotId,
      choreographyId: decision.selectedChoreographyId,
      evidenceIds: scene.evidenceIds ?? [],
    },
    selectedEvidenceIds: scene.evidenceIds ?? [],
    shotRuntimeDebug: {
      resolvedVia: undefined,
      visualDispatch: "SceneFallback",
      motionComposer: "fallback",
      notes: [
        `selected ${decision.selectedRuntimeKey} for ${scene.visualIntent ?? scene.sceneType}`,
        "mac runtime identity preserved for generated registry lookup",
      ],
    },
  };
}

function findInfoSceneIndex(scenes: PlannedScene[]) {
  const preferredIndex = scenes.findIndex((scene, index) => {
    if (index === 0) return false;
    const text = [scene.sceneType, scene.visualTemplate, scene.visualIntent, ...(scene.textOverlay ?? []), ...(scene.dataFocus ?? [])]
      .join(" ")
      .toLowerCase();
    return /data|price|compare|comparison|cost|grid|insight|metric|app/.test(text);
  });
  return preferredIndex >= 0 ? preferredIndex : Math.min(1, scenes.length - 1);
}

function findRecommendationSceneIndex(scenes: PlannedScene[]) {
  const preferredIndex = scenes.findIndex((scene, index) => {
    if (index === 0) return false;
    const text = [scene.sceneType, scene.visualTemplate, scene.visualIntent, ...(scene.textOverlay ?? []), ...(scene.dataFocus ?? [])]
      .join(" ")
      .toLowerCase();
    return /airecommendation|recommendation|decision/.test(text);
  });
  return preferredIndex >= 0 ? preferredIndex : -1;
}

export function planResolvedScenesWithShots(scenes: PlannedScene[], options: ShotPlannerOptions): ShotPlannerResult {
  const runtimeSelectionPlan = options.runtimeSelectionPlan ?? selectShotsForScenes(
    scenes.map((scene, index) => selectionInputForScene(scene, index, options.fps)),
    undefined,
    { contracts: listUnifiedShotSelectionContracts() },
  );
  const infoSceneIndex = scenes.length > 1 ? findInfoSceneIndex(scenes) : -1;
  const recommendationSceneIndex = scenes.length > 1 ? findRecommendationSceneIndex(scenes) : -1;
  const resolvedScenes = scenes.map((scene, index) => {
    if (scene.preferredRuntimeShotId) {
      return applyShot(scene, index, runtimeCandidates[scene.preferredRuntimeShotId], options);
    }
    const decision = runtimeSelectionPlan.decisions.find((item) => item.sceneId === Number(scene.id ?? index + 1));
    if (decision?.selectedRuntimeKey?.startsWith("mac:")) {
      return applyMacShotDecision(scene, index, decision, options);
    }
    const selectedCandidate = runtimeCandidateForDecision(decision);
    if (selectedCandidate) return applyShot(scene, index, selectedCandidate, options);
    if (index === 0) {
      return { ...applyShot(scene, index, openingHookCandidate, options), fallbackReason: "LEGACY_SHOT_SELECTION_FALLBACK" };
    }
    if (index === recommendationSceneIndex) {
      return { ...applyShot(scene, index, recommendationCandidate, options), fallbackReason: "LEGACY_SHOT_SELECTION_FALLBACK" };
    }
    if (index === infoSceneIndex) {
      return { ...applyShot(scene, index, infoCandidate, options), fallbackReason: "LEGACY_SHOT_SELECTION_FALLBACK" };
    }
    return toResolvedFallback(scene, index, options.fps);
  });

  const debug = resolvedScenes.map<ShotPlannerDebugEntry>((scene) => ({
    sceneId: scene.id,
    selectedShotId: scene.selectedShotId,
    shotPath: scene.shotRuntimeDebug?.shotPath,
    choreographyId: scene.choreographyId,
    visualType: scene.visualType,
    resolvedVia: scene.shotRuntimeDebug?.resolvedVia,
    visualDispatch: scene.shotRuntimeDebug?.visualDispatch ?? "SceneFallback",
    motionComposer: scene.shotRuntimeDebug?.motionComposer ?? "fallback",
    fallbackReason: scene.fallbackReason,
  }));

  return { scenes: resolvedScenes, debug, runtimeSelectionPlan };
}
