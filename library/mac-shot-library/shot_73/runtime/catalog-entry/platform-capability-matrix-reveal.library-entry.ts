import type { ShotLibraryEntry } from "./types";
import { shot73AtomicMotionIds } from "../atomic/shot73-atomic-motions";

export const platformCapabilityMatrixRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "platform-capability-matrix-reveal",
  choreographyId: "platformCapabilityMatrixReveal",
  sourceShotId: "shot_73",
  sceneType: "resultComparison",
  title: "Platform Capability Matrix Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 219,
  actionBreakdownPath: "src/motion/shot_73/shot73-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_73/shot73-atomic-motions.ts",
  choreographyPath: "src/motion/shot_73/shot73-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/platformCapabilityMatrixReveal.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_73/platformCapabilityMatrixReveal.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_73_resultComparison_134p73-142p0.mp4",
  atomicMotionIds: [...shot73AtomicMotionIds],
};
