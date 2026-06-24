import fs from "fs";
import path from "path";

export type FactoryVideoStatus = {
  index: number;
  videoId: string;
  narrativeId: string;
  layoutSequence: string[];
  motionSequence: string[];
  cameraSequence: string[];
  transitionSequence: string[];
  previewStatus: "ready" | "missing" | "rejected" | "approved";
  finalStatus: "not_rendered" | "rendered";
  qaStatus: "passed" | "failed" | "warning";
  previewPath: string;
  finalPath: string;
  structurePath: string;
  qaPath: string;
  revisionCount: number;
  lastUserNote: string;
};

export type FactoryState = {
  runId: string;
  url: string;
  count: number;
  currentIndex: number;
  status: "waiting_review" | "complete";
  videos: FactoryVideoStatus[];
};

export const runsRoot = path.join(process.cwd(), "outputs", "runs");

export const padIndex = (index: number) => String(index).padStart(2, "0");
export const videoIdFor = (index: number) => `video_${padIndex(index)}`;
export const runDirFor = (runId: string) => path.join(runsRoot, runId);
export const statePathFor = (runId: string) => path.join(runDirFor(runId), "factory-state.json");

export function ensureRunDirs(runId: string) {
  const runDir = runDirFor(runId);
  for (const dir of ["structures", "qa", "previews", "final", "frames"]) {
    fs.mkdirSync(path.join(runDir, dir), { recursive: true });
  }
  return runDir;
}

export function readFactoryState(runId: string): FactoryState {
  return JSON.parse(fs.readFileSync(statePathFor(runId), "utf8")) as FactoryState;
}

export function writeFactoryState(state: FactoryState) {
  ensureRunDirs(state.runId);
  fs.writeFileSync(statePathFor(state.runId), JSON.stringify(state, null, 2));
}

export function findVideo(state: FactoryState, index: number) {
  const video = state.videos.find((item) => item.index === index);
  if (!video) {
    throw new Error(`Video index ${index} is not part of run ${state.runId}`);
  }
  return video;
}
