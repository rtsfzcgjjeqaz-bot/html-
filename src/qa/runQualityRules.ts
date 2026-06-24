import fs from "fs";
import { runQualityGate } from "../factory/qualityGate";

function readArgs() {
  const args = process.argv.slice(2);
  const structureIndex = args.indexOf("--structure");
  const qaIndex = args.indexOf("--qa");
  return {
    structurePath: structureIndex >= 0 ? args[structureIndex + 1] : "",
    qaPath: qaIndex >= 0 ? args[qaIndex + 1] : undefined,
  };
}

const { structurePath, qaPath } = readArgs();

if (!structurePath) {
  console.error('Usage: npm run quality:rules -- --structure "outputs/runs/{runId}/structures/video_01.structure.json"');
  process.exit(1);
}

const structure = JSON.parse(fs.readFileSync(structurePath, "utf8"));
const report = runQualityGate(structure, qaPath);
console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 1);
