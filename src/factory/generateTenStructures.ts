export { generateTenConsistentVideos as generateTenStructures } from "./generateTenConsistentVideos";

import { generateTenConsistentVideos } from "./generateTenConsistentVideos";

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
