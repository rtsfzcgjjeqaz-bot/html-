import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { validateArticleInput } from "./validateArticleInput";
import { validateContentBrief } from "./validateContentBrief";
import { planArticleVisualPolicy } from "./articleVisualPolicy";
import type { ArticleContentBrief, ArticleInput } from "./types";

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

async function run() {
  const args = readArgs();
  if (!args.inputDir || !args.outputDir) {
    throw new Error("Use: tsx src/article/inspectArticlePolicy.ts --input-dir outputs/article-api-inspect/... --output-dir outputs/article-policy-inspect/...");
  }

  const inputDir = path.resolve(args.inputDir);
  const outputDir = path.resolve(args.outputDir);
  const videoStructurePath = path.resolve("video-structure.json");
  const initialHash = sha256(videoStructurePath);

  const article = loadJson<ArticleInput>(path.join(inputDir, "article-input.json"));
  const brief = loadJson<ArticleContentBrief>(path.join(inputDir, "content-brief.json"));
  const evidenceMap = loadJson<unknown[]>(path.join(inputDir, "evidence-map.json"));

  const articleInputValid = validateArticleInput(article);
  const contentBriefValid = validateContentBrief(brief);
  const policyPlan = planArticleVisualPolicy(article, brief);

  const articleVideoPlan = {
    articleId: article.articleId,
    pageType: brief.sourceMetadata.pageType,
    policyVersion: policyPlan.debug.policyVersion,
    selectedVisualIntents: policyPlan.debug.selectedVisualIntents,
    rejectedVisualIntents: policyPlan.debug.rejectedVisualIntents,
    selectedEvidenceIds: policyPlan.debug.selectedEvidenceIds,
    rejectedEvidenceIds: policyPlan.debug.rejectedEvidenceIds,
    scenes: policyPlan.scenes.map((scene) => ({
      sceneId: scene.sceneId,
      visualIntent: scene.visualIntent,
      headline: scene.headline?.value,
      supportingText: scene.supportingText?.value,
      recommendationTitle: scene.recommendationTitle?.value,
      recommendationItems: scene.recommendationItems?.map((item) => item.value),
      stepItems: scene.stepItems?.map((item) => item.value),
      cta: scene.cta?.value,
      selectedEvidenceIds: scene.selectedEvidenceIds,
      warnings: scene.warnings,
    })),
  };

  const planQaSummary = {
    status:
      articleInputValid.valid &&
      contentBriefValid.valid &&
      Object.values(policyPlan.debug.qaChecks).every(Boolean)
        ? "passed"
        : "failed",
    checks: {
      articleInputValid: articleInputValid.valid,
      contentBriefValid: contentBriefValid.valid,
      evidenceMapCountMatchesBrief: Array.isArray(evidenceMap) && evidenceMap.length === brief.evidence.length,
      ...policyPlan.debug.qaChecks,
    },
    errors: [
      ...articleInputValid.errors.map((error) => `articleInput:${error}`),
      ...contentBriefValid.errors.map((error) => `contentBrief:${error}`),
    ],
    warnings: policyPlan.debug.policyWarnings.map((warning) => warning.message),
    videoStructureHashUnchanged: sha256(videoStructurePath) === initialHash,
  };

  if (
    detectLeakInObject(articleVideoPlan) ||
    detectLeakInObject(policyPlan.debug) ||
    detectLeakInObject(planQaSummary)
  ) {
    throw new Error("Potential secret leak detected in policy inspect outputs.");
  }

  writeJson(path.join(outputDir, "article-video-plan.json"), articleVideoPlan);
  writeJson(path.join(outputDir, "policy-debug.json"), policyPlan.debug);
  writeJson(path.join(outputDir, "policy-qa-summary.json"), planQaSummary);

  console.log(`articleVideoPlanPath=${path.join(outputDir, "article-video-plan.json")}`);
  console.log(`policyDebugPath=${path.join(outputDir, "policy-debug.json")}`);
  console.log(`policyQaSummaryPath=${path.join(outputDir, "policy-qa-summary.json")}`);
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
