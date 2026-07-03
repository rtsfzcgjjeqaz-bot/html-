import type { ShotLibraryEntry } from "./types";
import { shot122AtomicMotionIds } from "../shot_122/shot122-atomic-motions";

export const phoneCarouselPerformanceFanLibraryEntry: ShotLibraryEntry = {
  libraryId: "phone-carousel-performance-fan",
  choreographyId: "phoneCarouselPerformanceFan",
  sourceShotId: "shot_122",
  sceneType: "appGrid",
  title: "Phone Carousel Performance Fan",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 43,
  actionBreakdownPath: "src/motion/shot_122/shot122-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_122/shot122-atomic-motions.ts",
  choreographyPath: "src/motion/shot_122/shot122-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/phoneCarouselPerformanceFan.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_122/phoneCarouselPerformanceFan.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-google-ai-software/shot_122_appGrid_4p77-6p20.mp4",
  atomicMotionIds: [...shot122AtomicMotionIds],
};
