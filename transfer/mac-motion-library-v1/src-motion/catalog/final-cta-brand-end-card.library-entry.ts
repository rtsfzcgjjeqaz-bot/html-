import type { ShotLibraryEntry } from "./types";
import { shot31AtomicMotionIds } from "../shot_31/shot31-atomic-motions";

export const finalCtaBrandEndCardLibraryEntry: ShotLibraryEntry = {
  libraryId: "final-cta-brand-end-card",
  choreographyId: "finalCtaBrandEndCard",
  sourceShotId: "shot_31",
  sceneType: "finalCTA",
  title: "Final CTA Brand End Card",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 64,
  actionBreakdownPath: "src/motion/shot_31/shot31-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_31/shot31-atomic-motions.ts",
  choreographyPath: "src/motion/shot_31/shot31-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/finalCtaBrandEndCard.tsx",
  certificationPreviewPath: "references/shot-certification/shot_31_finalCTA/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_31_finalCTA",
  atomicMotionIds: [...shot31AtomicMotionIds],
};
