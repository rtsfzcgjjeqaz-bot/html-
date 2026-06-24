import fs from "fs";
import path from "path";
import { analyzeWebsite } from "../ai/analyzeWebsite";
import { directorBrain } from "../ai/directorBrain";
import { captureWebsite } from "../capture/captureWebsite";
import { defaultDurationSeconds } from "../lib/config";
import { runQualityGate } from "./qualityGate";
import { ensureRunDirs, videoIdFor } from "./factoryState";
import { buildContentLock } from "./contentLock";
import { generateExpressionVariants } from "./generateExpressionVariants";
import { standardizeStructure } from "./standardizeStructure";
import { contentConsistencyValidator } from "../qa/contentConsistencyValidator";
import { expressionDivergenceValidator } from "../qa/expressionDivergenceValidator";
import type { QualityStructure } from "../qa/types";

const garbledTokens = ["�", "鍏", "瑙", "槄", "鐞", "浠", "鏈", "涓", "绾", "骞", "鏍", "鏂", "馃", "銆", "€", "泄", "楼"];
const looksGarbled = (value: string) => garbledTokens.some((token) => value.includes(token));
const cleanVisible = (value: string, fallback: string) => {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized || looksGarbled(normalized) || normalized.includes("...") || normalized.includes("…")) return fallback;
  return normalized;
};

export async function generateTenConsistentVideos(url: string, runId: string, count = 10) {
  const runDir = ensureRunDirs(runId);
  const capture = await captureWebsite(url);
  const director = await directorBrain(capture);
  const analysis = await analyzeWebsite(capture);
  const lockedContent = buildContentLock(capture, analysis);
  const variants = generateExpressionVariants(lockedContent, count);
  const outputs = [];
  const structures: QualityStructure[] = [];

  for (let index = 1; index <= count; index++) {
    const videoId = videoIdFor(index);
    const variant = variants[index - 1];
    const raw = {
      project: { url, timestamp: new Date().toISOString() },
      director: {
        ...director,
        brand: cleanVisible(director.brand, lockedContent.productName),
        industry: cleanVisible(director.industry, "subscription price intelligence"),
      },
      analysis: {
        ...analysis,
        productName: lockedContent.productName,
        brandPositioning: cleanVisible(analysis.brandPositioning, "Global subscription price intelligence platform"),
        coreValue: lockedContent.coreValue,
        oneLineValue: lockedContent.coreValue,
        usp: lockedContent.usp,
      },
      strategies: variants.map((item) => item.expressionSystem),
      selectedStrategy: variant.expressionSystemId,
      assets: {
        images: capture.screenshots.map((shot) => shot.path),
        screenshots: capture.screenshots.map((shot) => shot.path),
        website: {
          title: lockedContent.productName,
          description: lockedContent.coreValue,
          keyPoints: [lockedContent.usp, "AI decision assistant", "Country price reference"],
          appIcons: capture.assets.appIcons,
          prices: capture.assets.prices,
          metrics: capture.assets.metrics,
        },
      },
      renderConfig: { aspectRatio: "16:9", duration: defaultDurationSeconds },
      bgmKeywords: ["premium product ad", "clean technology", "confident pulse"],
      cover: { title: lockedContent.productName, visual: capture.screenshots[0]?.path || "" },
    };
    const structure = standardizeStructure({ raw, expressionVariant: variant }, index, capture.screenshots);
    const structurePath = path.join(runDir, "structures", `${videoId}.structure.json`);
    const qaPath = path.join(runDir, "qa", `${videoId}.qa.json`);
    fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2));
    const qa = runQualityGate(structure, qaPath);
    outputs.push({ index, videoId, structurePath, qaPath, qaStatus: qa.passed ? "passed" : "failed", contentHash: lockedContent.contentHash, expressionSystemId: variant.expressionSystemId });
    structures.push(structure);
  }

  const contentConsistency = contentConsistencyValidator(structures);
  const expressionDivergence = expressionDivergenceValidator(structures);
  const manifest = { runId, url, count, contentHash: lockedContent.contentHash, videos: outputs, contentConsistency, expressionDivergence };
  fs.writeFileSync(path.join(runDir, "ten-video-manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(runDir, "content-lock.json"), JSON.stringify(lockedContent, null, 2));
  return { runId, runDir, videos: outputs, contentConsistency, expressionDivergence };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf("--url");
  const runIndex = args.indexOf("--runId");
  const countIndex = args.indexOf("--count");
  const url = urlIndex >= 0 ? args[urlIndex + 1] : "";
  const runId = runIndex >= 0 ? args[runIndex + 1] : `run_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const count = countIndex >= 0 ? Number(args[countIndex + 1]) : 10;
  if (!url) throw new Error('Usage: npm run factory:ten -- --url "https://example.com"');
  generateTenConsistentVideos(url, runId, count).then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
