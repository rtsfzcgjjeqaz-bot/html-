import { execFileSync, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { videoStructurePath } from "../lib/config";
import { runRenderPostCheck } from "./renderPostCheck";

const entry = "src/index.ts";

function runRemotion(args: string[]) {
  execFileSync("npx", ["remotion", ...args], { stdio: "inherit", shell: true });
}

function hasFfmpeg() {
  try {
    execSync("where.exe ffmpeg", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function writeRootStructure(structurePath: string) {
  fs.copyFileSync(structurePath, videoStructurePath);
}

export function renderPreviewFromStructure(structurePath: string, outputPath: string) {
  writeRootStructure(structurePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  runRemotion(["render", entry, "WebsiteAdPreview", outputPath, "--overwrite", "--scale=0.5", "--concurrency=1"]);
}

export function assertRenderedPreview(outputPath: string) {
  if (!fs.existsSync(outputPath)) {
    throw new Error(`post-render QA failed: preview file missing (${outputPath})`);
  }
  const size = fs.statSync(outputPath).size;
  if (size < 250_000) {
    throw new Error(`post-render QA failed: preview file is too small (${size} bytes)`);
  }
  return { outputPath, size, status: "passed" as const };
}

export function renderPreviewWithPostCheck(structurePath: string, outputPath: string) {
  renderPreviewFromStructure(structurePath, outputPath);
  try {
    const fileCheck = assertRenderedPreview(outputPath);
    const postCheck = runRenderPostCheck(outputPath);
    if (!postCheck.passed) throw new Error(`post-render QA failed: ${postCheck.errors.join("; ")}`);
    return { ...fileCheck, postCheck };
  } catch (firstError) {
    renderPreviewFromStructure(structurePath, outputPath);
    try {
      const fileCheck = assertRenderedPreview(outputPath);
      const postCheck = runRenderPostCheck(outputPath);
      if (!postCheck.passed) throw new Error(`post-render QA failed: ${postCheck.errors.join("; ")}`);
      return { ...fileCheck, postCheck };
    } catch (secondError) {
      const message = secondError instanceof Error ? secondError.message : String(secondError);
      const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
      throw new Error(`${message}; rerender also failed after: ${firstMessage}`);
    }
  }
}

export function renderFinalFromStructure(structurePath: string, outputPath: string) {
  writeRootStructure(structurePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  runRemotion(["render", entry, "WebsiteAdPreview", outputPath, "--overwrite", "--concurrency=1"]);
}

export function generatePreviewFrames(previewPath: string, framesDir: string, videoId: string): string[] {
  const warnings: string[] = [];
  fs.mkdirSync(framesDir, { recursive: true });

  if (!hasFfmpeg()) {
    warnings.push("FFMPEG_NOT_AVAILABLE");
    return warnings;
  }

  const targets = [
    { name: "000", at: "00:00:00" },
    { name: "003s", at: "00:00:03" },
    { name: "006s", at: "00:00:06" },
    { name: "010s", at: "00:00:10" },
    { name: "015s", at: "00:00:15" },
    { name: "020s", at: "00:00:20" },
    { name: "026s", at: "00:00:26" },
  ];

  try {
    for (const target of targets) {
      execFileSync(
        "ffmpeg",
        ["-y", "-ss", target.at, "-i", previewPath, "-frames:v", "1", "-q:v", "3", path.join(framesDir, `${videoId}_frame_${target.name}.jpg`)],
        { stdio: "ignore" },
      );
    }

    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-pattern_type",
        "glob",
        "-i",
        path.join(framesDir, `${videoId}_frame_*.jpg`),
        "-filter_complex",
        "tile=4x2:padding=12:margin=12:color=white",
        "-frames:v",
        "1",
        path.join(framesDir, `${videoId}_contact_sheet.jpg`),
      ],
      { stdio: "ignore" },
    );
  } catch (error) {
    warnings.push(`FRAME_EXTRACTION_FAILED: ${error instanceof Error ? error.message : String(error)}`);
  }

  return warnings;
}
