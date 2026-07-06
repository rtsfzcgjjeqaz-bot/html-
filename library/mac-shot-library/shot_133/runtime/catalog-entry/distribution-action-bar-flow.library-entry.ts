import type { ShotLibraryEntry } from "./types";
import { shot133AtomicMotionIds } from "../atomic/shot133-atomic-motions";

export const distributionActionBarFlowLibraryEntry: ShotLibraryEntry = {
  libraryId: "distribution-action-bar-flow",
  choreographyId: "distributionActionBarFlow",
  sourceShotId: "shot_133",
  sceneType: "stepFlow",
  title: "Distribution Action Bar Flow",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 102,
  actionBreakdownPath: "src/motion/shot_133/shot133-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_133/shot133-atomic-motions.ts",
  choreographyPath: "src/motion/shot_133/shot133-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/distributionActionBarFlow.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_133/distributionActionBarFlow.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_133_stepFlow_17p4-20p8.mp4",
  atomicMotionIds: [...shot133AtomicMotionIds],
};
