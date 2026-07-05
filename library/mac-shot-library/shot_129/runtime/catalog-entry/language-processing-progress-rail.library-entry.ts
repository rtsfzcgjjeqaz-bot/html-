import type { ShotLibraryEntry } from "./types";
import { shot129AtomicMotionIds } from "../shot_129/shot129-atomic-motions";

export const languageProcessingProgressRailLibraryEntry: ShotLibraryEntry = {
  libraryId: "language-processing-progress-rail",
  choreographyId: "languageProcessingProgressRail",
  sourceShotId: "shot_129",
  sceneType: "stepFlow",
  title: "Language Processing Progress Rail",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 102,
  actionBreakdownPath: "src/motion/shot_129/shot129-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_129/shot129-atomic-motions.ts",
  choreographyPath: "src/motion/shot_129/shot129-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/languageProcessingProgressRail.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_129/languageProcessingProgressRail.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_129_stepFlow_5p1-8p5.mp4",
  atomicMotionIds: [...shot129AtomicMotionIds],
};
