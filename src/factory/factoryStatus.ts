import "dotenv/config";
import { readFactoryState } from "./factoryState";

function readArgs() {
  const args = process.argv.slice(2);
  const runIndex = args.indexOf("--runId");
  return {
    runId: runIndex >= 0 ? args[runIndex + 1] : "",
  };
}

function nextActionFor(status: {
  status: string;
  currentIndex: number;
  previewReady: number[];
  rejected: number[];
  total: number;
}) {
  if (status.status === "complete") return "factory complete";
  if (status.rejected.includes(status.currentIndex)) return `revise video_${String(status.currentIndex).padStart(2, "0")}`;
  if (status.previewReady.includes(status.currentIndex)) return `review video_${String(status.currentIndex).padStart(2, "0")}.preview.mp4`;
  return `wait for video_${String(status.currentIndex).padStart(2, "0")} preview`;
}

async function run() {
  const { runId } = readArgs();
  if (!runId) {
    throw new Error('Usage: npm run factory:status -- --runId "{runId}"');
  }

  const state = readFactoryState(runId);
  const status = {
    runId: state.runId,
    total: state.count,
    currentIndex: state.currentIndex,
    approved: state.videos.filter((video) => video.previewStatus === "approved").map((video) => video.index),
    previewReady: state.videos.filter((video) => video.previewStatus === "ready").map((video) => video.index),
    rejected: state.videos.filter((video) => video.previewStatus === "rejected").map((video) => video.index),
    finalRendered: state.videos.filter((video) => video.finalStatus === "rendered").map((video) => video.index),
    nextAction: "",
  };
  status.nextAction = nextActionFor({ ...status, status: state.status });
  console.log(JSON.stringify(status, null, 2));
}

void run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
