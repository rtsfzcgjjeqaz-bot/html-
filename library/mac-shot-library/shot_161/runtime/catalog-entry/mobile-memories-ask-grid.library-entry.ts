import type {ShotLibraryEntry} from "./types";
import {shot161AtomicMotionIds} from "../atomic/shot161-atomic-motions";

export const mobileMemoriesAskGridLibraryEntry: ShotLibraryEntry = {
  libraryId: "mobile-memories-ask-grid",
  choreographyId: "mobileMemoriesAskGrid",
  sourceShotId: "shot_161",
  sceneType: "appGrid",
  title: "Mobile Memories Ask Grid",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 90,
  actionBreakdownPath: "src/motion/shot_161/shot161-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_161/shot161-atomic-motions.ts",
  choreographyPath: "src/motion/shot_161/shot161-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/mobileMemoriesAskGrid.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_161/mobileMemoriesAskGrid.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-gemini-era-launch/shot_161_appGrid_21p27-22p27.mp4",
  atomicMotionIds: [...shot161AtomicMotionIds],
};
