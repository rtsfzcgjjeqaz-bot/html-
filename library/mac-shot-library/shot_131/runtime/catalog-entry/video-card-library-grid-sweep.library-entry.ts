import type { ShotLibraryEntry } from "./types";
import { shot131AtomicMotionIds } from "../atomic/shot131-atomic-motions";

export const videoCardLibraryGridSweepLibraryEntry: ShotLibraryEntry = {
  libraryId: "video-card-library-grid-sweep",
  choreographyId: "videoCardLibraryGridSweep",
  sourceShotId: "shot_131",
  sceneType: "appGrid",
  title: "Video Card Library Grid Sweep",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 99,
  actionBreakdownPath: "src/motion/shot_131/shot131-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_131/shot131-atomic-motions.ts",
  choreographyPath: "src/motion/shot_131/shot131-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/videoCardLibraryGridSweep.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_131/videoCardLibraryGridSweep.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_131_appGrid_11p3-14p6.mp4",
  atomicMotionIds: [...shot131AtomicMotionIds],
};
