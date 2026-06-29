import type { ShotLibraryEntry } from "./types";
import { shot40AtomicMotionIds } from "../atomic/shot40-atomic-motions";

export const mobileGeneratedResultCardPopLibraryEntry: ShotLibraryEntry = {
  libraryId: "mobile-generated-result-card-pop",
  choreographyId: "mobileGeneratedResultCardPop",
  sourceShotId: "shot_40",
  sceneType: "aiRecommendation",
  title: "Mobile Generated Result Card Pop",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 52,
  actionBreakdownPath: "src/motion/shot_40/shot40-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_40/shot40-atomic-motions.ts",
  choreographyPath: "src/motion/shot_40/shot40-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/mobileGeneratedResultCardPop.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_40/mobileGeneratedResultCardPop.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_40_aiRecommendation_43p07-44p80.mp4",
  atomicMotionIds: [...shot40AtomicMotionIds],
};
