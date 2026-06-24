import fs from "fs";
import path from "path";
import { runQualityGate } from "./qualityGate";
import { renderFinalFromStructure } from "./sequentialRenderer";

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

export function renderTenFinals(runId: string) {
  const runDir = path.join(process.cwd(), "outputs", "runs", runId);
  const structureDir = path.join(runDir, "structures");
  const finalDir = path.join(runDir, "final");
  const qaDir = path.join(runDir, "qa");
  const files = fs.readdirSync(structureDir).filter((file) => file.endsWith(".structure.json")).sort();
  for (const file of files) {
    const structurePath = path.join(structureDir, file);
    const qaPath = path.join(qaDir, file.replace(".structure.json", ".qa.json"));
    const structure = JSON.parse(fs.readFileSync(structurePath, "utf8"));
    const qa = runQualityGate(structure, qaPath);
    if (!qa.passed) throw new Error(`qualityGate blocked final render: ${qaPath}`);
    renderFinalFromStructure(structurePath, path.join(finalDir, file.replace(".structure.json", ".final.mp4")));
  }
}

if (require.main === module) {
  const runId = arg("--runId");
  if (!runId) throw new Error('Usage: npm run factory:render10:final -- --runId "run_..."');
  renderTenFinals(runId);
}
