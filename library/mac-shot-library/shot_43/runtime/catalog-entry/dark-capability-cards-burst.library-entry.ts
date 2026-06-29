import type { ShotLibraryEntry } from "./types";
import { shot43AtomicMotionIds } from "../atomic/shot43-atomic-motions";

export const darkCapabilityCardsBurstLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-capability-cards-burst",
  choreographyId: "darkCapabilityCardsBurst",
  sourceShotId: "shot_43",
  sceneType: "resultComparison",
  title: "Dark Capability Cards Burst",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 171,
  actionBreakdownPath: "src/motion/shot_43/shot43-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_43/shot43-atomic-motions.ts",
  choreographyPath: "src/motion/shot_43/shot43-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkCapabilityCardsBurst.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_43/darkCapabilityCardsBurst.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_43_resultComparison_60p00-65p70.mp4",
  atomicMotionIds: [...shot43AtomicMotionIds],
};
