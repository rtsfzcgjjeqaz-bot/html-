import type { ShotLibraryEntry } from "./types";
import { shot11AtomicMotionIds } from "../atomic/shot11-atomic-motions";

export const resultComparisonBigNumberBurstLibraryEntry: ShotLibraryEntry = {
  libraryId: "result-comparison-big-number-burst",
  choreographyId: "resultComparisonBigNumberBurst",
  sourceShotId: "shot_11",
  sceneType: "resultComparison",
  title: "Result Comparison Big Number Burst",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 45,
  actionBreakdownPath: "src/motion/shot_11/shot11-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_11/shot11-atomic-motions.ts",
  choreographyPath: "src/motion/shot_11/shot11-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/resultComparisonBigNumberBurst.tsx",
  certificationPreviewPath: "references/shot-certification/shot_11_resultComparison/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_11_resultComparison",
  atomicMotionIds: [...shot11AtomicMotionIds],
};
