import type { ShotLibraryEntry } from "./types";
import { shot38AtomicMotionIds } from "../atomic/shot38-atomic-motions";

export const mobileAiBriefCardRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "mobile-ai-brief-card-reveal",
  choreographyId: "mobileAiBriefCardReveal",
  sourceShotId: "shot_38",
  sceneType: "aiRecommendation",
  title: "Mobile AI Brief Card Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 189,
  actionBreakdownPath: "src/motion/shot_38/shot38-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_38/shot38-atomic-motions.ts",
  choreographyPath: "src/motion/shot_38/shot38-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/mobileAiBriefCardReveal.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_38/mobileAiBriefCardReveal.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_38_aiRecommendation_33p10-39p37.mp4",
  atomicMotionIds: [...shot38AtomicMotionIds],
};
