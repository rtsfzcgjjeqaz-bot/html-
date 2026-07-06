import type { ShotLibraryEntry } from "./types";
import { shot130AtomicMotionIds } from "../atomic/shot130-atomic-motions";

export const completionCheckConfettiRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "completion-check-confetti-reveal",
  choreographyId: "completionCheckConfettiReveal",
  sourceShotId: "shot_130",
  sceneType: "aiRecommendation",
  title: "Completion Check Confetti Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 84,
  actionBreakdownPath: "src/motion/shot_130/shot130-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_130/shot130-atomic-motions.ts",
  choreographyPath: "src/motion/shot_130/shot130-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/completionCheckConfettiReveal.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_130/completionCheckConfettiReveal.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_130_aiRecommendation_8p5-11p3.mp4",
  atomicMotionIds: [...shot130AtomicMotionIds],
};
