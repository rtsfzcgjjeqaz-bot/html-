import fs from "fs";
import path from "path";
import { analyzeReferenceVideo } from "./analyzeReferenceVideo";
import { extractReferenceFrames } from "./extractReferenceFrames";

export type ReferenceQualityProfile = {
  sourcePath: string;
  exists: boolean;
  durationSeconds: number;
  fps: number;
  targetSceneCount: number;
  averageShotSeconds: number;
  frames: ReturnType<typeof extractReferenceFrames>;
  visualDensity: { minPrimaryVisualArea: number; minOccupiedSafeAreaRatio: number; maxTextLinesPerScene: number; maxTextAreaRatio: number };
  camera: { keySceneIndexes: number[]; maxStrongCameraScenes: number; stableSceneMotion: string; forbidden: string[] };
  motion: { minSemanticEventsPerScene: number; mustBindTo: string[]; forbidden: string[] };
};

export function buildReferenceProfile(sourcePath = "C:\\Users\\Administrator\\Desktop\\mvp3（已加bgm）.mp4", outputPath = path.join(process.cwd(), "src", "reference", "referenceQualityProfile.generated.json")): ReferenceQualityProfile {
  const base = analyzeReferenceVideo(sourcePath, path.join(process.cwd(), "src", "reference", "referenceProfile.json"));
  const frames = extractReferenceFrames(sourcePath);
  const profile: ReferenceQualityProfile = {
    sourcePath,
    exists: fs.existsSync(sourcePath),
    durationSeconds: base.durationSeconds || 30,
    fps: base.fps || 30,
    targetSceneCount: Math.max(8, base.targetSceneCount || 8),
    averageShotSeconds: base.averageShotSeconds || 3.75,
    frames,
    visualDensity: { minPrimaryVisualArea: 260000, minOccupiedSafeAreaRatio: 0.34, maxTextLinesPerScene: 2, maxTextAreaRatio: 0.26 },
    camera: { keySceneIndexes: [0, 2, 5], maxStrongCameraScenes: 3, stableSceneMotion: "component_only", forbidden: ["random_shake", "continuous_drift", "decorative_orbit"] },
    motion: { minSemanticEventsPerScene: 3, mustBindTo: ["websiteScreenshot", "appIcon", "countryData", "priceSignal", "aiDecision", "chart", "stepFlow"], forbidden: ["decorativeHud", "floatingLabel", "randomScanLine", "unboundShape", "meaninglessArrow"] },
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(profile, null, 2));
  return profile;
}

if (require.main === module) console.log(JSON.stringify(buildReferenceProfile(), null, 2));
