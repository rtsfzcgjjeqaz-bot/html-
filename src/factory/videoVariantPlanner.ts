import type { BatchStrategy } from "../ai/generateBatchStrategies";
import type { StoryboardScene } from "../ai/generateStoryboard";
import { selectChoreography } from "../motion/choreographySelector";
import type { ChoreographyAnimationTrack, FactoryMode, StyleProfileId } from "../motion/choreographyTypes";
import type { VisualTemplate } from "../templates/visualTemplates";

export type VideoVariantPlannerOptions = {
  profile: StyleProfileId;
  mode: FactoryMode;
  includeChoreographies?: string[];
  excludeChoreographies?: string[];
  fps?: number;
};

export type PlannedScene = StoryboardScene & {
  sceneType: string;
  choreographyId?: string;
  animationTracks?: ChoreographyAnimationTrack[];
  motionIds?: string[];
  cameraPathId?: string;
  layoutId?: string;
  transitionId?: string;
  choreographyBlockedReason?: unknown;
  visualTemplate?: VisualTemplate;
  dataFocus?: string[];
  assets?: StoryboardScene["assets"] & {
    appIcons?: Array<{ appName: string; src: string; alt?: string }>;
  };
};

const sceneTypes = ["websiteHero", "appGrid", "searchDemo", "resultComparison", "aiRecommendation", "priceInsight", "finalCTA"];

function sceneTypeFor(scene: StoryboardScene, index: number) {
  const explicit = (scene as StoryboardScene & { sceneType?: string; visualTemplate?: string }).sceneType;
  if (explicit) return explicit;
  const template = (scene as StoryboardScene & { visualTemplate?: string }).visualTemplate;
  if (template === "websiteHero") return "websiteHero";
  return index === 0 ? "websiteHero" : sceneTypes[index % sceneTypes.length];
}

export function planVideoVariant(
  scenes: StoryboardScene[],
  strategy: BatchStrategy,
  options: VideoVariantPlannerOptions,
): PlannedScene[] {
  const usedChoreographyIds: string[] = [];
  const usedMotionIds: string[] = [];
  const usedCameraPathIds: string[] = [];
  const usedLayoutIds: string[] = [];
  const fps = options.fps ?? 30;

  return scenes.map((scene, index) => {
    const sceneType = sceneTypeFor(scene, index);
    const durationFrames = Math.round(Number(scene.duration || 5) * fps);
    const result = selectChoreography({
      sceneType,
      narrativeId: strategy.type,
      profile: options.profile,
      usedChoreographyIds,
      usedMotionIds,
      usedCameraPathIds,
      usedLayoutIds,
      allowedChoreographyIds: options.mode === "restricted" || options.mode === "test" ? options.includeChoreographies : undefined,
      excludedChoreographyIds: options.excludeChoreographies,
      durationFrames,
    });

    if (result.blocked) {
      return {
        ...scene,
        sceneType,
        visualTemplate: sceneType === "websiteHero" ? "websiteHero" : (scene as StoryboardScene & { visualTemplate?: string }).visualTemplate,
        choreographyBlockedReason: result,
      } as PlannedScene;
    }

    usedChoreographyIds.push(result.selection.choreographyId);
    usedMotionIds.push(...result.selection.motionIds);
    usedCameraPathIds.push(result.selection.cameraPathId);
    usedLayoutIds.push(result.selection.layoutId);

    return {
      ...scene,
      sceneType,
      visualTemplate: sceneType === "websiteHero" ? "websiteHero" : (scene as StoryboardScene & { visualTemplate?: string }).visualTemplate,
      choreographyId: result.selection.choreographyId,
      animationTracks: result.selection.animationTracks,
      motionIds: result.selection.motionIds,
      cameraPathId: result.selection.cameraPathId,
      layoutId: result.selection.layoutId,
      transitionId: result.selection.transitionId,
      duration: result.selection.durationFrames / fps,
    } as PlannedScene;
  });
}
