import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

export type ReferenceFrame = {
  index: number;
  atSecond: number;
  path: string;
  extracted: boolean;
};

function hasFfmpeg() {
  try {
    execFileSync("where.exe", ["ffmpeg"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function extractReferenceFrames(sourcePath: string, outputDir = path.join(process.cwd(), "outputs", "reference-frames")): ReferenceFrame[] {
  fs.mkdirSync(outputDir, { recursive: true });
  const targetSeconds = [0, 3, 6, 10, 15, 20, 26];
  const canExtract = fs.existsSync(sourcePath) && hasFfmpeg();

  return targetSeconds.map((atSecond, index) => {
    const framePath = path.join(outputDir, `reference_${String(index + 1).padStart(2, "0")}.jpg`);
    if (canExtract) {
      execFileSync("ffmpeg", ["-y", "-ss", String(atSecond), "-i", sourcePath, "-frames:v", "1", "-q:v", "3", framePath], { stdio: "ignore" });
    }
    return { index: index + 1, atSecond, path: framePath, extracted: canExtract && fs.existsSync(framePath) };
  });
}

if (require.main === module) {
  const sourceIndex = process.argv.indexOf("--source");
  const source = sourceIndex >= 0 ? process.argv[sourceIndex + 1] : "C:\\Users\\Administrator\\Desktop\\mvp3（已加bgm）.mp4";
  console.log(JSON.stringify(extractReferenceFrames(source), null, 2));
}
