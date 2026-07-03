import type { ShotLibraryEntry } from "./types";
import { shot120AtomicMotionIds } from "../shot_120/shot120-atomic-motions";

export const darkGoogleAiBusinessHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-google-ai-business-hook",
  choreographyId: "darkGoogleAiBusinessHook",
  sourceShotId: "shot_120",
  sceneType: "coverHook",
  title: "Dark Google AI Business Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 98,
  actionBreakdownPath: "src/motion/shot_120/shot120-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_120/shot120-atomic-motions.ts",
  choreographyPath: "src/motion/shot_120/shot120-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkGoogleAiBusinessHook.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_120/darkGoogleAiBusinessHook.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-google-ai-software/shot_120_coverHook_0p00-3p27.mp4",
  atomicMotionIds: [...shot120AtomicMotionIds],
};
