import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

export type ReferenceVideoProfile = {
  sourcePath: string;
  exists: boolean;
  durationSeconds: number;
  fps: number;
  targetSceneCount: number;
  averageShotSeconds: number;
  rhythm: "steady" | "fast" | "cinematic";
  motionDensity: "medium" | "high";
  requiredTraits: string[];
};

const fallbackProfile = (sourcePath: string): ReferenceVideoProfile => ({
  sourcePath,
  exists: fs.existsSync(sourcePath),
  durationSeconds: 30,
  fps: 30,
  targetSceneCount: 6,
  averageShotSeconds: 5,
  rhythm: "cinematic",
  motionDensity: "high",
  requiredTraits: ["safe typography", "2.5D depth", "primary visual per scene", "beat-aware transitions", "non-PPT motion"],
});

function readDurationWithFfprobe(sourcePath: string) {
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", sourcePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const duration = Number(out.trim());
    return Number.isFinite(duration) && duration > 0 ? duration : undefined;
  } catch {
    return undefined;
  }
}

export function analyzeReferenceVideo(sourcePath = "C:\\Users\\Administrator\\Downloads\\mvp3（已加bgm）.mp4", outputPath = path.join(process.cwd(), "src", "reference", "referenceProfile.json")) {
  const profile = fallbackProfile(sourcePath);
  const duration = readDurationWithFfprobe(sourcePath);
  if (duration) {
    profile.durationSeconds = Math.round(duration * 10) / 10;
    profile.targetSceneCount = Math.max(5, Math.min(10, Math.round(duration / 4.5)));
    profile.averageShotSeconds = Math.round((duration / profile.targetSceneCount) * 10) / 10;
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(profile, null, 2));
  return profile;
}

if (require.main === module) {
  const sourceIndex = process.argv.indexOf("--source");
  const outputIndex = process.argv.indexOf("--output");
  const profile = analyzeReferenceVideo(
    sourceIndex >= 0 ? process.argv[sourceIndex + 1] : undefined,
    outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined,
  );
  console.log(JSON.stringify(profile, null, 2));
}
