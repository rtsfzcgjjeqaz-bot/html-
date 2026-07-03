import type { ShotLibraryEntry } from "./types";
import { shot125AtomicMotionIds } from "../shot_125/shot125-atomic-motions";

export const needNotCopyMorphLibraryEntry: ShotLibraryEntry = {
  libraryId: "need-not-copy-morph",
  choreographyId: "needNotCopyMorph",
  sourceShotId: "shot_125",
  sceneType: "featureHighlight",
  title: "Need Not Copy Morph",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 63,
  actionBreakdownPath: "src/motion/shot_125/shot125-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_125/shot125-atomic-motions.ts",
  choreographyPath: "src/motion/shot_125/shot125-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/needNotCopyMorph.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_125/needNotCopyMorph.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-google-ai-software/shot_125_featureHighlight_10p87-12p87.mp4",
  atomicMotionIds: [...shot125AtomicMotionIds],
};
