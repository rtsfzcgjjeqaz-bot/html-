import fs from "fs";
import path from "path";
import { runQualityGate } from "../factory/qualityGate";
import { contentConsistencyValidator } from "./contentConsistencyValidator";
import { expressionDivergenceValidator } from "./expressionDivergenceValidator";
import { intraVideoMotionValidator } from "./intraVideoMotionValidator";

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const runId = arg("--runId");
if (!runId) {
  console.error('Usage: npm run quality:ten -- --runId "run_..."');
  process.exit(1);
}

const runDir = path.join(process.cwd(), "outputs", "runs", runId);
const structureDir = path.join(runDir, "structures");
const qaDir = path.join(runDir, "qa");
const files = fs.readdirSync(structureDir).filter((file) => file.endsWith(".structure.json")).sort();
const structures = files.map((file) => JSON.parse(fs.readFileSync(path.join(structureDir, file), "utf8")));
const videos = files.map((file, index) => {
  const single = runQualityGate(structures[index], path.join(qaDir, file.replace(".structure.json", ".qa.json")));
  const intra = intraVideoMotionValidator(structures[index]);
  return { file, single, intra };
});
const contentConsistency = contentConsistencyValidator(structures);
const expressionDivergence = expressionDivergenceValidator(structures);
const passed = videos.every((video) => video.single.passed && video.intra.status !== "failed") && contentConsistency.status !== "failed" && expressionDivergence.status !== "failed";
const output = { passed, videos, contentConsistency, expressionDivergence };
console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 1);
