import "dotenv/config";
import { planFactoryRun, readFactoryPlanArgs } from "../factory/factoryPlan";

export type VideoStructure = {
  scenes: Array<{
    id?: number;
    duration: number;
    textOverlay: string[];
    assets: { image: string[] };
    visualIntent?: string;
  }>;
  renderConfig: { duration: number };
  strategies: unknown[];
};

async function run() {
  const args = readFactoryPlanArgs(process.argv.slice(2));
  const result = await planFactoryRun(args);

  console.log("Pipeline dispatch complete.");
  console.log(`runId: ${result.runId}`);
  if (result.blockedByQaPath) {
    console.log(`qualityGate blocked preview: ${result.blockedByQaPath}`);
  } else if (result.firstPreviewPath) {
    console.log(`preview: ${result.firstPreviewPath}`);
  }
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
