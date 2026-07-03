import type { ShotLibraryEntry } from "./types";
import { shot124AtomicMotionIds } from "../shot_124/shot124-atomic-motions";

export const translationAiResponsePanelLibraryEntry: ShotLibraryEntry = {
  libraryId: "translation-ai-response-panel",
  choreographyId: "translationAiResponsePanel",
  sourceShotId: "shot_124",
  sceneType: "aiRecommendation",
  title: "Translation AI Response Panel",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 74,
  actionBreakdownPath: "src/motion/shot_124/shot124-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_124/shot124-atomic-motions.ts",
  choreographyPath: "src/motion/shot_124/shot124-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/translationAiResponsePanel.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_124/translationAiResponsePanel.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-google-ai-software/shot_124_aiRecommendation_8p40-10p87.mp4",
  atomicMotionIds: [...shot124AtomicMotionIds],
};
