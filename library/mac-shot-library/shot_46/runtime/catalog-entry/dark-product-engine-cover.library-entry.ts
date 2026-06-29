import type { ShotLibraryEntry } from "./types";
import { shot46AtomicMotionIds } from "../atomic/shot46-atomic-motions";

export const darkProductEngineCoverLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-product-engine-cover",
  choreographyId: "darkProductEngineCover",
  sourceShotId: "shot_46",
  sceneType: "coverHook",
  title: "Dark Product Engine Cover",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 67,
  actionBreakdownPath: "src/motion/shot_46/shot46-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_46/shot46-atomic-motions.ts",
  choreographyPath: "src/motion/shot_46/shot46-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkProductEngineCover.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_46/darkProductEngineCover.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-feishu-project/shot_46_coverHook_0p0-2p23.mp4",
  atomicMotionIds: [...shot46AtomicMotionIds],
};
