import type { ShotLibraryEntry } from "./types";
import { shot78AtomicMotionIds } from "../atomic/shot78-atomic-motions";

export const documentSelectionAiToolbarLibraryEntry: ShotLibraryEntry = {
  libraryId: "document-selection-ai-toolbar",
  choreographyId: "documentSelectionAiToolbar",
  sourceShotId: "shot_78",
  sceneType: "aiRecommendation",
  title: "Document Selection AI Toolbar",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 53,
  actionBreakdownPath: "src/motion/shot_78/shot78-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_78/shot78-atomic-motions.ts",
  choreographyPath: "src/motion/shot_78/shot78-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/documentSelectionAiToolbar.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_78/documentSelectionAiToolbar.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-interaction/shot_78_searchDemo_5p6-7p35.mp4",
  atomicMotionIds: [...shot78AtomicMotionIds],
};
