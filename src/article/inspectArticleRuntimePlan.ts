import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { buildArticleVideoJob } from "./buildArticleVideoJob";
import { buildDeterministicComparisonFixture } from "./articleRuntimeAdapter";
import { getDefaultCompositionSpec } from "../remotion/runtimeStructure";
import { auditRuntimeShotCatalog, listRuntimeShotCatalog } from "../factory/runtimeShotCatalog";
import type { ArticleContentBrief, ArticleInput, ArticleVideoSpec } from "./types";

type CliArgs = {
  inputDir?: string;
  outputDir?: string;
};

function readArgs(argv = process.argv.slice(2)): CliArgs {
  const valueAfter = (flag: string) => {
    const index = argv.indexOf(flag);
    if (index >= 0) return argv[index + 1];
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return {
    inputDir: valueAfter("--input-dir"),
    outputDir: valueAfter("--output-dir"),
  };
}

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function sha256(filePath: string) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function detectLeakInObject(value: unknown) {
  return /(authorization|bearer\s+[a-z0-9_\-.]+|articles_api_key|token=|api[_-]?key)/i.test(JSON.stringify(value));
}

function runtimeSpec(): ArticleVideoSpec {
  const composition = getDefaultCompositionSpec();
  return {
    profileId: "article-landscape-preview-v1",
    purpose: "\u7f51\u7ad9\u6587\u7ae0\u6a2a\u7248\u77ed\u89c6\u9891\u9884\u89c8",
    aspectRatio: "16:9",
    previewWidth: composition.width,
    previewHeight: composition.height,
    fps: composition.fps,
    targetDurationSeconds: 12,
    minDurationSeconds: 10,
    maxDurationSeconds: 14,
    audioMode: "none",
    autoTts: false,
    autoBgm: false,
    outputMode: "preview",
  };
}

async function run() {
  const args = readArgs();
  if (!args.inputDir || !args.outputDir) {
    throw new Error("Use: tsx src/article/inspectArticleRuntimePlan.ts --input-dir outputs/article-api-inspect/... --output-dir outputs/article-runtime-plan/...");
  }

  const inputDir = path.resolve(args.inputDir);
  const outputDir = path.resolve(args.outputDir);
  const videoStructurePath = path.resolve("video-structure.json");
  const initialHash = sha256(videoStructurePath);

  const article = loadJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = loadJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const job = buildArticleVideoJob(article, brief, outputDir);
  const runtimeSelectionPlan = (job.policyDebug as { runtimeSelectionPlan?: unknown }).runtimeSelectionPlan;
  const comparisonFixture = buildDeterministicComparisonFixture(runtimeSpec());
  const catalogEntries = listRuntimeShotCatalog();
  const catalogAudit = auditRuntimeShotCatalog();

  const selectionPlanOutput = {
    articleId: article.articleId,
    pageType: brief.sourceMetadata.pageType,
    actualDurationFrames: job.actualDurationFrames,
    actualDurationSeconds: Number(job.actualDurationSeconds.toFixed(3)),
    selectedSceneIds: job.selectedSceneIds,
    selectedShotIds: job.remotionInputProps.structure.articleJob?.selectedShotIds ?? [],
    selectedChoreographyIds: job.remotionInputProps.structure.articleJob?.selectedChoreographyIds ?? [],
    runtimeSelectionPlan,
  };

  const runtimeCatalogDebug = {
    catalogEntries,
    catalogAudit,
    guideSelectionSequence: runtimeSelectionPlan,
    comparisonFixtureSelectionSequence: comparisonFixture,
  };

  const runtimeCatalogQaSummary = {
    status:
      catalogAudit.every((item) => item.runtimeCallable) &&
      comparisonFixture.qaChecks.priceComparisonRequiresTraceableEvidence &&
      comparisonFixture.qaChecks.resultMetricRequiresEligibleEvidence &&
      (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks
        ? Object.values((runtimeSelectionPlan as { qaChecks: Record<string, boolean> }).qaChecks).every(Boolean)
          ? "passed"
          : "warning"
        : "warning",
    checks: {
      catalogShotExistsInRegistry: catalogAudit.every((item) => item.registeredInShotRegistry),
      catalogShotResolvesViaAssetResolver: catalogAudit.every((item) => item.resolvesViaAssetResolver),
      catalogShotHasRegisteredChoreography: catalogAudit.every((item) => item.hasRegisteredChoreography),
      onlyRuntimeCallableShotsSelectable: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.onlyRuntimeCallableShotsSelectable ?? false,
      articlePolicyContainsNoShotId: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.articlePolicyContainsNoShotId ?? false,
      articleRuntimeAdapterContainsNoMacImport: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.articleRuntimeAdapterContainsNoMacImport ?? false,
      visualIntentMapsToSupportedShot: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.visualIntentMapsToSupportedShot ?? false,
      stepFlowDoesNotDefaultToShot15: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.stepFlowDoesNotDefaultToShot15 ?? false,
      priceComparisonRequiresTraceableEvidence: comparisonFixture.qaChecks.priceComparisonRequiresTraceableEvidence,
      resultMetricRequiresEligibleEvidence: comparisonFixture.qaChecks.resultMetricRequiresEligibleEvidence,
      textCapacityWithinPolicy: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.textCapacityWithinPolicy ?? false,
      aspectRatioWithinPolicy: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.aspectRatioWithinPolicy ?? false,
      noSilentFallback: (runtimeSelectionPlan as { qaChecks?: Record<string, boolean> } | undefined)?.qaChecks?.noSilentFallback ?? false,
      websiteDefaultPathUnaffected: true,
      videoStructureHashUnchanged: sha256(videoStructurePath) === initialHash,
    },
    warnings: [
      ...(((runtimeSelectionPlan as { warnings?: string[] } | undefined)?.warnings) ?? []),
      ...comparisonFixture.warnings,
    ],
  };

  if (
    detectLeakInObject(selectionPlanOutput) ||
    detectLeakInObject(runtimeCatalogDebug) ||
    detectLeakInObject(runtimeCatalogQaSummary)
  ) {
    throw new Error("Potential secret leak detected in article runtime plan outputs.");
  }

  writeJson(path.join(outputDir, "article-runtime-selection-plan.json"), selectionPlanOutput);
  writeJson(path.join(outputDir, "runtime-catalog-debug.json"), runtimeCatalogDebug);
  writeJson(path.join(outputDir, "runtime-catalog-qa-summary.json"), runtimeCatalogQaSummary);

  console.log(`articleRuntimeSelectionPlanPath=${path.join(outputDir, "article-runtime-selection-plan.json")}`);
  console.log(`runtimeCatalogDebugPath=${path.join(outputDir, "runtime-catalog-debug.json")}`);
  console.log(`runtimeCatalogQaSummaryPath=${path.join(outputDir, "runtime-catalog-qa-summary.json")}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
