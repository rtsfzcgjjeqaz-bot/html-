import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { outputsDir } from "../lib/config";
import type { BatchStrategyId } from "../ai/generateBatchStrategies";

const entry = "src/index.ts";
const batchDir = path.join(outputsDir, "batch");
const toCompositionSafeId = (value: string) => value.replace(/[^a-zA-Z0-9\u4e00-\u9fff-]/g, "-");

function quote(arg: string) {
  return `"${arg.replace(/"/g, '\\"')}"`;
}

function runRemotion(args: string[]) {
  execSync(`npx remotion ${args.map(quote).join(" ")}`, {
    stdio: "inherit",
  });
}

function runRemotionAsync(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const command = `npx remotion ${args.map(quote).join(" ")}`;
    const child = exec(command, { windowsHide: true });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Remotion command failed with exit code ${code}: ${command}`));
    });
    child.on("error", reject);
  });
}

export function renderPreview() {
  fs.mkdirSync(outputsDir, { recursive: true });
  const output = path.join(outputsDir, "preview.mp4");
  runRemotion(["render", entry, "WebsiteAdPreview", output, "--overwrite", "--scale=0.5"]);
  return output;
}

export function renderSilentFinal() {
  fs.mkdirSync(outputsDir, { recursive: true });
  const output = path.join(outputsDir, "final.mp4");
  runRemotion(["render", entry, "WebsiteAdPreview", output, "--overwrite"]);
  return output;
}

export function renderFinal() {
  fs.mkdirSync(outputsDir, { recursive: true });
  const output = path.join(outputsDir, "final.mp4");
  runRemotion(["render", entry, "WebsiteAdFinal", output, "--overwrite"]);
  return output;
}

export async function renderBatchVideos(strategyIds: BatchStrategyId[]) {
  fs.mkdirSync(batchDir, { recursive: true });
  fs.mkdirSync(outputsDir, { recursive: true });
  const outputs = strategyIds.map((strategyId) => ({
    strategyId,
    composition: `WebsiteAdBatch-${toCompositionSafeId(strategyId)}`,
    output: path.join(batchDir, `video_${strategyId}.mp4`),
  }));

  await Promise.all(
    outputs.map((item) =>
      runRemotionAsync(["render", entry, item.composition, item.output, "--overwrite", "--concurrency=1"]),
    ),
  );

  await runRemotionAsync(["render", entry, "WebsiteAdPreview", path.join(outputsDir, "preview.mp4"), "--overwrite", "--scale=0.5", "--concurrency=1"]);

  return outputs;
}

export function renderCover() {
  fs.mkdirSync(outputsDir, { recursive: true });
  const output = path.join(outputsDir, "cover.png");
  runRemotion(["still", entry, "WebsiteAdCover", output, "--overwrite", "--frame=0"]);
  return output;
}
