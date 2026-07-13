import type { ShotLibraryEntry } from "./types";
import { shot147AtomicMotionIds } from "../shot_147/shot147-atomic-motions";

export const quadrantGalleryGridRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "quadrant-gallery-grid-reveal",
  choreographyId: "quadrantGalleryGridReveal",
  sourceShotId: "shot_147",
  sceneType: "appGrid",
  title: "Quadrant Gallery Grid Reveal",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 96,
  actionBreakdownPath: "src/motion/shot_147/shot147-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_147/shot147-atomic-motions.ts",
  choreographyPath: "src/motion/shot_147/shot147-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/quadrantGalleryGridReveal.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_147/quadrantGalleryGridReveal.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_147_appGrid_7p77-9p90.mp4",
  atomicMotionIds: [...shot147AtomicMotionIds],
};
