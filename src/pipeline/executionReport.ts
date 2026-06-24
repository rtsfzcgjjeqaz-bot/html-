import fs from "fs";
import path from "path";
import { outputsDir } from "../lib/config";

export type ExecutionSteps = {
  capture: boolean;
  extract: boolean;
  analysis: boolean;
  strategy: boolean;
  storyboard: boolean;
  render: boolean;
};

export type ExecutionReport = {
  status: "success" | "failed";
  exitCode: number;
  steps: ExecutionSteps;
  outputs: {
    screenshots: boolean;
    videoStructure: boolean;
    finalVideo: boolean;
  };
  errors: string[];
  warnings: string[];
};

export const createEmptySteps = (): ExecutionSteps => ({
  capture: false,
  extract: false,
  analysis: false,
  strategy: false,
  storyboard: false,
  render: false,
});

export function writeExecutionReport(input: {
  steps: ExecutionSteps;
  errors?: string[];
  warnings?: string[];
  exitCode?: number;
}) {
  fs.mkdirSync(outputsDir, { recursive: true });

  const outputs = {
    screenshots: fs.existsSync(path.join(outputsDir, "screenshots", "home.png")),
    videoStructure: fs.existsSync(path.join(outputsDir, "video-structure.json")),
    finalVideo: fs.existsSync(path.join(outputsDir, "final.mp4")),
  };
  const exitCode = input.exitCode ?? 0;
  const status = exitCode === 0 && Object.values(input.steps).every(Boolean) && Object.values(outputs).every(Boolean) ? "success" : "failed";

  const report: ExecutionReport = {
    status,
    exitCode: status === "success" ? 0 : exitCode || 1,
    steps: input.steps,
    outputs,
    errors: input.errors ?? [],
    warnings: input.warnings ?? [],
  };

  fs.writeFileSync(path.join(outputsDir, "execution-report.json"), JSON.stringify(report, null, 2));
  return report;
}
