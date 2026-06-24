import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { getShot } from "../../assets/index/asset-resolver";
import { materializeAnimationTracks } from "./choreographyRegistry";
import { planResolvedScenesWithShots, type ResolvedScene } from "../factory/shotPlanner";
import type { PlannedScene } from "../factory/videoVariantPlanner";
import { renderPreviewFromStructure } from "../factory/sequentialRenderer";

const fps = 30;
const runtimeShotId = "shot_51";
const outputDir = path.join(process.cwd(), "outputs", "shot51-runtime-qa");
const structurePath = path.join(outputDir, "shot_51.runtime.structure.json");
const previewPath = path.join(outputDir, "shot_51.runtime.preview.mp4");
const debugPath = path.join(outputDir, "shot_51.runtime.debug.json");
const rootStructurePath = path.join(process.cwd(), "video-structure.json");
const rootBackupPath = path.join(outputDir, "video-structure.backup.json");

function safeJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function hasFfmpeg() {
  try {
    execFileSync("where.exe", ["ffmpeg"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function buildPreludeScene(): PlannedScene {
  return {
    id: 1,
    duration: 1,
    hookType: "pattern_interrupt",
    camera: { shot: "close", motion: "zoom" },
    visualIntent: "Open the story and hand off to the recommendation scene.",
    textOverlay: [
      "Open the story.",
      "Hand off to the recommendation scene.",
    ],
    assets: {
      image: [],
      fallback: "ai_generated",
    },
    audioCue: "clean reveal",
    sceneType: "coverHook",
  };
}

function buildMainScene(): PlannedScene {
  return {
    id: 2,
    duration: 4.67,
    hookType: "curiosity",
    camera: { shot: "medium", motion: "static" },
    visualIntent: "Turn context into a structured recommendation.",
    textOverlay: [
      "Turn context into a structured recommendation.",
      "Cursor-led panel, evidence rows, and readable decision support.",
    ],
    assets: {
      image: [],
      fallback: "ai_generated",
    },
    audioCue: "clean reveal",
    sceneType: "aiRecommendation",
  };
}

function extendPreviewScene(scene: ResolvedScene, extraFrames = 15): ResolvedScene {
  const previewFrames = Math.max(scene.durationInFrames + extraFrames, 155);
  const choreographyId = scene.choreographyId ?? "aiRecommendationCursorPanelReveal";
  return {
    ...scene,
    durationInFrames: previewFrames,
    duration: previewFrames / fps,
    animationTracks: materializeAnimationTracks(choreographyId, previewFrames),
  };
}

function captureFrames(outputFile: string) {
  if (!hasFfmpeg()) return { framesDir: "", contactSheetPath: "", warnings: ["FFMPEG_NOT_AVAILABLE"] as string[] };

  const framesDir = path.join(outputDir, "frames");
  fs.mkdirSync(framesDir, { recursive: true });

  const samples = [
    { name: "00_first", at: "00:00:00.00" },
    { name: "01_prelude", at: "00:00:00.40" },
    { name: "02_entry", at: "00:00:01.10" },
    { name: "03_cursor", at: "00:00:01.80" },
    { name: "04_panel_enter", at: "00:00:02.70" },
    { name: "05_mid", at: "00:00:03.70" },
    { name: "06_end", at: "00:00:05.90" },
    { name: "07_post_end", at: "00:00:06.10" },
  ];

  for (const sample of samples) {
    execFileSync(
      "ffmpeg",
      ["-y", "-ss", sample.at, "-i", outputFile, "-frames:v", "1", "-q:v", "2", path.join(framesDir, `${sample.name}.jpg`)],
      { stdio: "ignore" },
    );
  }

  const contactSheetPath = path.join(outputDir, "shot_51.runtime.contact-sheet.jpg");
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-pattern_type",
      "glob",
      "-i",
      path.join(framesDir, "*.jpg"),
      "-filter_complex",
      "tile=4x2:padding=10:margin=10:color=white",
      "-frames:v",
      "1",
      contactSheetPath,
    ],
    { stdio: "ignore" },
  );

  return { framesDir, contactSheetPath, warnings: [] as string[] };
}

export function renderShot51RuntimePreview() {
  const shot = getShot(runtimeShotId);
  const planned = planResolvedScenesWithShots([buildPreludeScene(), buildMainScene()], {
    fps,
    profile: "ai-tool-promo",
    narrativeId: "comparison",
  });

  if (planned.scenes.length < 2) {
    throw new Error("Shot planner returned no scenes for shot_51 preview.");
  }

  const [resolvedPrelude, resolvedMain] = planned.scenes;
  if (resolvedMain.selectedShotId !== runtimeShotId || resolvedMain.choreographyId !== shot.sourceChoreographyId) {
    throw new Error(
      `Unexpected shot selection for preview: selectedShotId=${resolvedMain.selectedShotId ?? "none"}, choreographyId=${resolvedMain.choreographyId ?? "none"}`,
    );
  }

  const previewPrelude = {
    ...resolvedPrelude,
    durationInFrames: 30,
    duration: 1,
    animationTracks: materializeAnimationTracks(resolvedPrelude.choreographyId ?? "coverHookImpact", 30),
  };
  const previewScene = extendPreviewScene(resolvedMain);
  const previewScenes = [previewPrelude, previewScene];
  const structure = {
    meta: {
      fps,
      width: 1920,
      height: 1080,
      durationFrames: previewPrelude.durationInFrames + previewScene.durationInFrames,
    },
    scenes: previewScenes,
    batchVideos: [{ strategyId: "shot_51_preview", scenes: previewScenes }],
    assets: {
      images: [],
      screenshots: [],
      website: {},
    },
    renderConfig: { aspectRatio: "16:9", duration: previewPrelude.duration + previewScene.duration },
    shotRuntime: {
      runtimeShotId,
      sourceShotId: shot.sourceShotId,
      sourceLibrary: shot.sourceLibrary,
      sourceBranch: shot.sourceBranch,
      choreographyId: shot.sourceChoreographyId,
      previewFrames: previewPrelude.durationInFrames + previewScene.durationInFrames,
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(structurePath, safeJson(structure));
  fs.writeFileSync(debugPath, safeJson({ runtimeShotId, sourceShotId: shot.sourceShotId, choreographyId: shot.sourceChoreographyId, structurePath }));

  if (fs.existsSync(rootStructurePath)) {
    fs.copyFileSync(rootStructurePath, rootBackupPath);
  }
  try {
    renderPreviewFromStructure(structurePath, previewPath);
  } finally {
    if (fs.existsSync(rootBackupPath)) {
      fs.copyFileSync(rootBackupPath, rootStructurePath);
      fs.unlinkSync(rootBackupPath);
    }
  }

  const frameCapture = captureFrames(previewPath);
  if (frameCapture.warnings.length) {
    fs.writeFileSync(path.join(outputDir, "shot_51.runtime.warnings.json"), safeJson(frameCapture.warnings));
  }

  return {
    previewPath,
    structurePath,
    debugPath,
    contactSheetPath: frameCapture.contactSheetPath,
    framesDir: frameCapture.framesDir,
  };
}

if (require.main === module) {
  const result = renderShot51RuntimePreview();
  console.log(`previewPath=${result.previewPath}`);
  console.log(`structurePath=${result.structurePath}`);
  console.log(`debugPath=${result.debugPath}`);
  if (result.contactSheetPath) console.log(`contactSheetPath=${result.contactSheetPath}`);
  if (result.framesDir) console.log(`framesDir=${result.framesDir}`);
}
