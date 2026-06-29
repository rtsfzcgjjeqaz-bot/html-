import fs from "fs";
import path from "path";
import type { BatchCheckpointManifest } from "./checkpointManager";
import type { FinalRenderManifest } from "./finalRenderGate";
import type { OutputQaReport } from "./outputQaGate";

export type FinalDeliveryManifest = {
  deliveryId: string;
  createdAt: string;
  finalFileRelativePath: string;
  finalFileHash: string;
  finalFileSizeBytes: number;
  width: number;
  height: number;
  fps: number;
  durationFrames: number;
  durationSeconds: number;
  audioExpected: boolean;
  audioObserved: boolean;
  checkpointId: string;
  sourceSnapshotId: string;
  scriptAttemptId: string;
  visibleCopyAttemptId: string;
  runtimeSelectionPlanHash: string;
  articleVideoJobHash: string;
  previewAttemptId: string;
  finalAttemptId: string;
  outputQaStatus: OutputQaReport["outputQaStatus"];
  finalFrameQaStatus: OutputQaReport["finalFrameQaStatus"];
  deliveryStatus: "delivered_local";
};

export type FinalDeliverySummary = {
  deliveryId: string;
  finalDeliveryEligible: boolean;
  finalDeliveryStatus: "delivered_local" | "blocked";
  blockedReason?: string;
  manifestPath?: string;
  summaryPath: string;
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

export function runFinalDeliveryGate(input: {
  outputDir: string;
  checkpoint: BatchCheckpointManifest;
  finalRender: FinalRenderManifest;
  outputQa: OutputQaReport;
  blocked: boolean;
}): FinalDeliverySummary {
  const deliveryDir = path.join(input.outputDir, "final-delivery");
  const manifestPath = path.join(deliveryDir, "delivery-manifest.json");
  const summaryPath = path.join(deliveryDir, "final-delivery-summary.json");
  const checks = input.outputQa.checks;
  const eligible =
    input.finalRender.status === "passed" &&
    input.outputQa.outputQaStatus === "passed" &&
    input.outputQa.finalFrameQaStatus === "passed" &&
    checks.finalFileExists === true &&
    checks.finalFileSizeGreaterThanZero === true &&
    checks.ffprobeReadable === true &&
    checks.articleVideoJobHashMatchesApprovedPreview === true &&
    checks.runtimeSelectionPlanHashMatchesApprovedPreview === true &&
    !input.blocked;

  if (!eligible) {
    const summary: FinalDeliverySummary = {
      deliveryId: "delivery-01",
      finalDeliveryEligible: false,
      finalDeliveryStatus: "blocked",
      blockedReason: "FINAL_DELIVERY_PRECONDITIONS_NOT_MET",
      summaryPath: path.relative(input.outputDir, summaryPath),
    };
    writeJson(summaryPath, summary);
    return summary;
  }

  const manifest: FinalDeliveryManifest = {
    deliveryId: "delivery-01",
    createdAt: new Date().toISOString(),
    finalFileRelativePath: input.finalRender.finalFileRelativePath,
    finalFileHash: input.finalRender.finalFileHash ?? "",
    finalFileSizeBytes: input.finalRender.finalFileSizeBytes,
    width: input.outputQa.mediaProbe.width,
    height: input.outputQa.mediaProbe.height,
    fps: input.outputQa.mediaProbe.fps,
    durationFrames: input.outputQa.mediaProbe.durationFrames,
    durationSeconds: input.outputQa.mediaProbe.durationSeconds,
    audioExpected: false,
    audioObserved: input.outputQa.mediaProbe.audioObserved,
    checkpointId: input.checkpoint.checkpointId,
    sourceSnapshotId: input.checkpoint.sourceAttemptIds.sourceSnapshotId,
    scriptAttemptId: input.checkpoint.sourceAttemptIds.scriptAttemptId,
    visibleCopyAttemptId: input.checkpoint.sourceAttemptIds.visibleCopyAttemptId,
    runtimeSelectionPlanHash: input.checkpoint.dependencyHashes.runtimeSelectionPlanHash,
    articleVideoJobHash: input.checkpoint.dependencyHashes.articleVideoJobHash,
    previewAttemptId: input.finalRender.previewAttemptId,
    finalAttemptId: input.finalRender.finalAttemptId,
    outputQaStatus: input.outputQa.outputQaStatus,
    finalFrameQaStatus: input.outputQa.finalFrameQaStatus,
    deliveryStatus: "delivered_local",
  };
  writeJson(manifestPath, manifest);
  const summary: FinalDeliverySummary = {
    deliveryId: manifest.deliveryId,
    finalDeliveryEligible: true,
    finalDeliveryStatus: "delivered_local",
    manifestPath: path.relative(input.outputDir, manifestPath),
    summaryPath: path.relative(input.outputDir, summaryPath),
  };
  writeJson(summaryPath, summary);
  return summary;
}
