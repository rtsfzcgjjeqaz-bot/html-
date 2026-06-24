import type { ShotLibraryEntry } from "./types";
import { shot28AtomicMotionIds } from "../shot_28/shot28-atomic-motions";

export const stepFlowTimelineCalculationLibraryEntry: ShotLibraryEntry = {
  libraryId: "step-flow-timeline-calculation",
  choreographyId: "stepFlowTimelineCalculation",
  sourceShotId: "shot_28",
  sceneType: "stepFlow",
  title: "Step Flow Timeline Calculation",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 292,
  actionBreakdownPath: "src/motion/shot_28/shot28-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_28/shot28-atomic-motions.ts",
  choreographyPath: "src/motion/shot_28/shot28-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/stepFlowTimelineCalculation.tsx",
  certificationPreviewPath: "references/shot-certification/shot_28_stepFlow/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_28_stepFlow",
  atomicMotionIds: [...shot28AtomicMotionIds],
};
