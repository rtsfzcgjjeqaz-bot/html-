import { getShot, getShotPath, type ShotAsset } from "../../assets/index/asset-resolver";
import { getChoreographyEntry, materializeAnimationTracks } from "../motion/choreographyRegistry";
import type { ChoreographyAnimationTrack, StyleProfileId } from "../motion/choreographyTypes";
import type { PlannedScene } from "./videoVariantPlanner";

export type ResolvedScene = PlannedScene & {
  id: number;
  durationInFrames: number;
  headline: string;
  supportingText: string;
  visualType: string;
  componentProps: Record<string, unknown>;
  selectedShotId?: "shot_01" | "shot_15";
  choreographyId?: string;
  motionPresetIds: string[];
  visualAssetRefs: string[];
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
};

type ShotPlannerOptions = {
  fps: number;
  profile: StyleProfileId;
  narrativeId: string;
  allowedChoreographyIds?: string[];
  excludedChoreographyIds?: string[];
};

type RuntimeCandidate = {
  shotId: "shot_01" | "shot_15";
  sceneType: string;
  visualType: string;
};

const runtimeCandidates: RuntimeCandidate[] = [
  { shotId: "shot_01", sceneType: "coverHook", visualType: "coverHook" },
  { shotId: "shot_15", sceneType: "appGrid", visualType: "dashboardGrid" },
];

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
    },
    motionPresetIds: scene.motionIds ?? [],
    visualAssetRefs: visualRefs(scene),
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

  return {
    ...base,
    duration: durationInFrames / options.fps,
    durationInFrames,
    sceneType: candidate.sceneType,
    visualType: candidate.visualType,
    visualTemplate: enabled ? undefined : base.visualTemplate,
    selectedShotId: candidate.shotId,
    choreographyId: enabled ? choreographyId : undefined,
    animationTracks: enabled ? animationTracks : undefined,
    motionPresetIds: shot.atomic_motions,
    motionIds: shot.atomic_motions,
    visualAssetRefs: visualRefs(scene),
    fallbackReason,
    componentProps: {
      ...base.componentProps,
      shotId: candidate.shotId,
      shotPath,
      choreographyId,
      motionTags: shot.motion_tags,
    },
    shotRuntimeDebug: {
      shotPath,
      resolvedVia: "asset-resolver",
      visualDispatch,
      motionComposer,
      notes: [
        `selected ${candidate.shotId} for ${index === 0 ? "opening hook" : "information reinforcement"}`,
        fallbackReason ?? `resolved ${choreographyId} with ${animationTracks.length} animation tracks`,
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

export function planResolvedScenesWithShots(scenes: PlannedScene[], options: ShotPlannerOptions): ShotPlannerResult {
  const infoSceneIndex = scenes.length > 1 ? findInfoSceneIndex(scenes) : -1;
  const resolvedScenes = scenes.map((scene, index) => {
    if (index === 0) return applyShot(scene, index, runtimeCandidates[0], options);
    if (index === infoSceneIndex) return applyShot(scene, index, runtimeCandidates[1], options);
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

  return { scenes: resolvedScenes, debug };
}
