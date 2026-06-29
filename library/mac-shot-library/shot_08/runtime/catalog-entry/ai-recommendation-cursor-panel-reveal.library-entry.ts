import type { ShotLibraryEntry } from "./types";
import { shot08AtomicMotionIds } from "../atomic/shot08-atomic-motions";

export const aiRecommendationCursorPanelRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-recommendation-cursor-panel-reveal",
  choreographyId: "aiRecommendationCursorPanelReveal",
  sourceShotId: "shot_08",
  sceneType: "aiRecommendation",
  title: "AI Recommendation Cursor Panel Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 140,
  actionBreakdownPath: "src/motion/shot_08/shot08-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_08/shot08-atomic-motions.ts",
  choreographyPath: "src/motion/shot_08/shot08-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/aiRecommendationCursorPanelReveal.tsx",
  certificationPreviewPath: "references/shot-certification/shot_08_aiRecommendation/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_08_aiRecommendation",
  atomicMotionIds: [...shot08AtomicMotionIds],
};
