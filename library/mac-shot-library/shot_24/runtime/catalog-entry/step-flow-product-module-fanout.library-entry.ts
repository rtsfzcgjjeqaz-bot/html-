import type { ShotLibraryEntry } from "./types";
import { shot24AtomicMotionIds } from "../atomic/shot24-atomic-motions";

export const stepFlowProductModuleFanoutLibraryEntry: ShotLibraryEntry = {
  libraryId: "step-flow-product-module-fanout",
  choreographyId: "stepFlowProductModuleFanout",
  sourceShotId: "shot_24",
  sceneType: "stepFlow",
  title: "Step Flow Product Module Fanout",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 146,
  actionBreakdownPath: "src/motion/shot_24/shot24-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_24/shot24-atomic-motions.ts",
  choreographyPath: "src/motion/shot_24/shot24-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/stepFlowProductModuleFanout.tsx",
  certificationPreviewPath: "references/shot-certification/shot_24_stepFlow/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_24_stepFlow",
  atomicMotionIds: [...shot24AtomicMotionIds],
};
