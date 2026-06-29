import type { ShotLibraryEntry } from "./types";
import { shot79AtomicMotionIds } from "../atomic/shot79-atomic-motions";

export const aiSuggestionCardFromSelectionLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-suggestion-card-from-selection",
  choreographyId: "aiSuggestionCardFromSelection",
  sourceShotId: "shot_79",
  sceneType: "aiRecommendation",
  title: "AI Suggestion Card From Selection",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 89,
  actionBreakdownPath: "src/motion/shot_79/shot79-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_79/shot79-atomic-motions.ts",
  choreographyPath: "src/motion/shot_79/shot79-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/aiSuggestionCardFromSelection.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_79/aiSuggestionCardFromSelection.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-interaction/shot_79_aiRecommendation_7p35-10p35.mp4",
  atomicMotionIds: [...shot79AtomicMotionIds],
};
