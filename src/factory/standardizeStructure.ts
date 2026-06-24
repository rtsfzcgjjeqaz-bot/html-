import type { CapturedScreenshot } from "../capture/captureWebsite";
import type { QualityScene, QualityStructure, SceneRegion } from "../qa/types";
import type { LockedVideoContent } from "./contentLock";
import type { ExpressionSystemId } from "./expressionSystems";
import { solveSceneLayout } from "../layout/layoutSolver";
import { cameraIntentForScene } from "../motion/cameraIntentMap";
import { semanticMotionForTemplate } from "../motion/semanticMotionMap";

const textRegions: SceneRegion[] = [
  { x: 220, y: 190, width: 600, height: 230 },
  { x: 1040, y: 240, width: 600, height: 230 },
  { x: 260, y: 165, width: 700, height: 220 },
  { x: 1080, y: 280, width: 600, height: 220 },
  { x: 250, y: 185, width: 650, height: 220 },
  { x: 1030, y: 205, width: 620, height: 220 },
  { x: 250, y: 205, width: 640, height: 220 },
  { x: 650, y: 170, width: 620, height: 190 },
];

const primaryRegions: SceneRegion[] = [
  { x: 940, y: 170, width: 700, height: 540 },
  { x: 250, y: 165, width: 660, height: 610 },
  { x: 260, y: 485, width: 1100, height: 240 },
  { x: 235, y: 175, width: 750, height: 610 },
  { x: 925, y: 180, width: 690, height: 610 },
  { x: 240, y: 175, width: 720, height: 580 },
  { x: 920, y: 205, width: 690, height: 520 },
  { x: 320, y: 360, width: 1280, height: 440 },
];

const primaryRegionByTemplate: Record<string, SceneRegion> = {
  websiteHero: { x: 900, y: 150, width: 760, height: 620 },
  appGrid: { x: 180, y: 150, width: 800, height: 720 },
  searchFlow: { x: 220, y: 500, width: 1360, height: 260 },
  comparisonPanel: { x: 190, y: 150, width: 840, height: 720 },
  recommendationPanel: { x: 900, y: 150, width: 740, height: 720 },
  dynamicChart: { x: 920, y: 260, width: 700, height: 460 },
  iconRail: { x: 890, y: 155, width: 780, height: 700 },
  signalBoard: { x: 200, y: 430, width: 1520, height: 410 },
};

const textRegionByTemplate: Record<string, SceneRegion> = {
  websiteHero: { x: 220, y: 230, width: 610, height: 270 },
  appGrid: { x: 1060, y: 260, width: 560, height: 280 },
  searchFlow: { x: 280, y: 220, width: 760, height: 190 },
  comparisonPanel: { x: 1100, y: 270, width: 590, height: 300 },
  recommendationPanel: { x: 240, y: 245, width: 560, height: 280 },
  dynamicChart: { x: 240, y: 250, width: 620, height: 270 },
  iconRail: { x: 230, y: 265, width: 600, height: 280 },
  signalBoard: { x: 560, y: 210, width: 800, height: 180 },
};

const hookTypes = ["pattern_interrupt", "emotional", "curiosity"] as const;
const shots = ["close", "medium", "wide"] as const;

type ExpressionVariantScene = {
  content: {
    id: number;
    purpose: string;
    message: string;
    dataRefs: string[];
  };
  expression: {
    visualTemplate: string;
    layoutId: string;
    motionId: string;
    cameraPathId: string;
    transitionId: string;
    depthPresetId: string;
    animationPlan: Record<string, string>;
  };
};

type ExpressionVariantInput = {
  raw: Record<string, unknown>;
  expressionVariant?: {
    lockedContent?: LockedVideoContent;
    expressionSystemId: ExpressionSystemId;
    videoId?: string;
    expressionSystem?: unknown;
    scenes: ExpressionVariantScene[];
  };
  scenes?: Array<QualityScene & { hookType?: string; text?: string }>;
  selectedStrategy?: string;
  assets?: { website?: { appIcons?: Array<{ appName: string; src: string; alt?: string }> } };
  [key: string]: unknown;
};

function compact(value: unknown, fallback: string, max = 48) {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const words = text.split(" ");
  let output = "";
  for (const word of words) {
    if (`${output} ${word}`.trim().length > max) break;
    output = `${output} ${word}`.trim();
  }
  return output || fallback;
}

function secondaryLine(lockedContent: LockedVideoContent, sceneIndex: number) {
  const lines = [
    `${lockedContent.appList.length || 6} services tracked`,
    "App icons stay authentic",
    "Search starts the signal chain",
    `${lockedContent.countryData.length || 5} regions compared`,
    "AI ranks price and risk",
    "Signals collapse into one view",
    "Services remain linked to routes",
    "Decision-ready price intelligence",
  ];
  return compact(lines[sceneIndex] ?? lockedContent.usp, "Subscription intelligence", 42);
}

function screenshotFor(sceneIndex: number, screenshots: CapturedScreenshot[] = []) {
  if (sceneIndex !== 0) return [];
  const home = screenshots.find((shot) => shot.id === "home") ?? screenshots[0];
  return home?.publicPath ? [home.publicPath] : [];
}

function shapesFor(sceneIndex: number): Array<{ semanticRole: "highlightBox"; targetRegion: SceneRegion }> {
  // Avoid ambiguous arrows, connectors, and screenshot focus boxes. Only render a
  // bounded highlight when it is fully inside a real UI panel.
  if (sceneIndex === 1) return [{ semanticRole: "highlightBox", targetRegion: { x: 250, y: 250, width: 300, height: 150 } }];
  if (sceneIndex === 4) return [{ semanticRole: "highlightBox", targetRegion: { x: 920, y: 245, width: 330, height: 130 } }];
  if (sceneIndex === 7) return [{ semanticRole: "highlightBox", targetRegion: { x: 260, y: 395, width: 320, height: 140 } }];
  return [];
}

const panelRegionByTemplate: Record<string, SceneRegion> = {
  dynamicChart: { x: 180, y: 140, width: 1560, height: 760 },
};

function cardRegionsFor(template: string, primary: SceneRegion) {
  if (panelRegionByTemplate[template]) return [panelRegionByTemplate[template]];
  return ["appGrid", "searchFlow", "recommendationPanel", "iconRail", "signalBoard"].includes(template) ? [primary] : [];
}

function chartRegionsFor(template: string, primary: SceneRegion) {
  return ["comparisonPanel", "dynamicChart"].includes(template) ? [primary] : [];
}

export function standardizeStructure(input: ExpressionVariantInput, videoIndex: number, screenshots: CapturedScreenshot[] = []): QualityStructure & Record<string, unknown> {
  const variant = input.expressionVariant;
  if (variant?.lockedContent) return standardizeExpressionVariant(input, videoIndex, screenshots);
  return legacyStandardize(input, videoIndex, screenshots);
}

function lockedDataRef(lockedContent: LockedVideoContent, ref: string): string[] {
  const value = lockedContent[ref as keyof LockedVideoContent];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function standardizeExpressionVariant(input: ExpressionVariantInput, videoIndex: number, screenshots: CapturedScreenshot[]) {
  const variant = input.expressionVariant;
  if (!variant?.lockedContent) throw new Error("Missing expression variant lockedContent.");
  const lockedContent: LockedVideoContent = variant.lockedContent;
  const expressionSystemId: ExpressionSystemId = variant.expressionSystemId;

  const scenes: QualityScene[] = variant.scenes.map((sceneVariant, sceneIndex: number) => {
    const content = sceneVariant.content;
    const expression = sceneVariant.expression;
    const template = expression.visualTemplate;
    const primaryRegion = primaryRegionByTemplate[template] ?? primaryRegions[sceneIndex % primaryRegions.length];
    const textRegion = textRegionByTemplate[template] ?? textRegions[sceneIndex % textRegions.length];
    const shapes = shapesFor(sceneIndex);
    const semanticMotion = semanticMotionForTemplate(template);
    const baseScene = {
      id: content.id,
      duration: sceneIndex === 0 || sceneIndex === variant.scenes.length - 1 ? 4 : 3.7,
      hookType: hookTypes[sceneIndex % hookTypes.length],
      camera: { shot: shots[(sceneIndex + videoIndex) % shots.length], motion: expression.cameraPathId },
      content,
      expression,
      visualTemplate: expression.visualTemplate,
      layoutId: expression.layoutId,
      motionId: expression.motionId,
      cameraPathId: expression.cameraPathId,
      transitionId: expression.transitionId,
      depthPresetId: expression.depthPresetId,
      animationPlan: expression.animationPlan,
      animationEvents: semanticMotion.events,
      semanticMotion,
      visualIntent: `${expressionSystemId}: ${content.purpose}`,
      textOverlay: [compact(content.message, "Website value", 58), secondaryLine(lockedContent, sceneIndex)],
      textRoles: sceneIndex === 0 ? ["hero", "body"] : ["title", "body"],
      textRegions: [textRegion],
      primaryVisualRegion: primaryRegion,
      cardRegions: cardRegionsFor(template, primaryRegion),
      chartRegions: chartRegionsFor(template, primaryRegion),
      screenshotRegions: sceneIndex === 0 ? [primaryRegionByTemplate.websiteHero] : [],
      shapeRegions: shapes.map((shape) => shape.targetRegion),
      semanticShapes: shapes,
      screenshotPolicy: sceneIndex === 0 ? "websiteHeroOnly" : "none",
      assets: { image: screenshotFor(sceneIndex, screenshots), backgroundImage: [], appIcons: lockedContent.appIcons ?? [] },
      dataFocus: content.dataRefs.flatMap((ref: string) => lockedDataRef(lockedContent, ref)).slice(0, 5),
      audioCue: `${expressionSystemId} / ${content.purpose}`,
    } as QualityScene;
    const cameraIntent = cameraIntentForScene(baseScene, sceneIndex);
    return solveSceneLayout({
      ...baseScene,
      cameraIntent,
      camera: { ...baseScene.camera, motion: cameraIntent.activeCamera ? cameraIntent.cameraPath : "slow_center" },
      cameraPathId: `${cameraIntent.activeCamera ? cameraIntent.cameraPath : "stable_component"}_${sceneIndex + 1}`,
    });
  });

  return {
    ...input.raw,
    videoId: variant.videoId,
    contentHash: lockedContent.contentHash,
    lockedContent,
    expressionSystemId,
    expressionSystem: variant.expressionSystem,
    scenes,
    batchVideos: [{ strategyId: expressionSystemId, scenes }],
  };
}

function legacyStandardize(input: ExpressionVariantInput, videoIndex: number, screenshots: CapturedScreenshot[]) {
  const rawScenes = Array.isArray(input.scenes) && input.scenes.length ? input.scenes : [];
  const sceneCount = Math.max(8, Math.min(8, rawScenes.length || 8));
  const scenes: QualityScene[] = Array.from({ length: sceneCount }, (_, sceneIndex) => {
    const raw = rawScenes[sceneIndex] ?? {};
    const shapes = shapesFor(sceneIndex);
    const template = ["websiteHero", "appGrid", "searchFlow", "comparisonPanel", "recommendationPanel", "dynamicChart"][sceneIndex % 6];
    const primaryRegion = primaryRegionByTemplate[template] ?? primaryRegions[sceneIndex % primaryRegions.length];
    const textRegion = textRegionByTemplate[template] ?? textRegions[sceneIndex % textRegions.length];
    const semanticMotion = semanticMotionForTemplate(template);
    const baseScene = {
      ...raw,
      id: sceneIndex + 1,
      duration: Number(raw.duration) > 0 ? Number(raw.duration) : 5,
      hookType: raw.hookType ?? hookTypes[sceneIndex % hookTypes.length],
      camera: { shot: raw.camera?.shot ?? shots[sceneIndex % 3], motion: `legacy_camera_${videoIndex}_${sceneIndex + 1}` },
      visualTemplate: template,
      layoutId: `${template}_v${videoIndex}_${sceneIndex + 1}`,
      motionId: `legacy_motion_v${videoIndex}_${sceneIndex + 1}`,
      cameraPathId: `legacy_camera_v${videoIndex}_${sceneIndex + 1}`,
      transitionId: `legacy_transition_v${videoIndex}_${sceneIndex + 1}`,
      animationEvents: semanticMotion.events,
      semanticMotion,
      visualIntent: compact(raw.visualIntent, `${template} visual`, 90),
      textOverlay: (raw.textOverlay ?? [raw.text ?? raw.visualIntent ?? "Website insight"]).slice(0, 2).map((line: unknown, lineIndex: number) => compact(line, lineIndex ? "Decision signal" : "Website value", lineIndex ? 48 : 34)),
      textRoles: sceneIndex === 0 ? ["hero", "body"] : ["title", "body"],
      textRegions: [textRegion],
      primaryVisualRegion: primaryRegion,
      cardRegions: cardRegionsFor(template, primaryRegion),
      chartRegions: chartRegionsFor(template, primaryRegion),
      screenshotRegions: sceneIndex === 0 ? [primaryRegionByTemplate.websiteHero] : [],
      shapeRegions: shapes.map((shape) => shape.targetRegion),
      semanticShapes: shapes,
      screenshotPolicy: sceneIndex === 0 ? "websiteHeroOnly" : "none",
      assets: { ...(raw.assets ?? {}), image: screenshotFor(sceneIndex, screenshots), backgroundImage: [], appIcons: input.assets?.website?.appIcons ?? [] },
    } as QualityScene;
    const cameraIntent = cameraIntentForScene(baseScene, sceneIndex);
    return solveSceneLayout({
      ...baseScene,
      cameraIntent,
      camera: { ...baseScene.camera, motion: cameraIntent.activeCamera ? cameraIntent.cameraPath : "slow_center" },
      cameraPathId: `${cameraIntent.activeCamera ? cameraIntent.cameraPath : "stable_component"}_${sceneIndex + 1}`,
    });
  });
  return { ...input, scenes, batchVideos: [{ strategyId: input.selectedStrategy ?? "A", scenes }] };
}
