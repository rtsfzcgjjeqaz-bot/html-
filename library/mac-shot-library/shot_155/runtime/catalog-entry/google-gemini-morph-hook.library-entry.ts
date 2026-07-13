import type { ShotLibraryEntry } from "./types";
import { shot155AtomicMotionIds } from "../shot_155/shot155-atomic-motions";

export const googleGeminiMorphHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "google-gemini-morph-hook",
  choreographyId: "googleGeminiMorphHook",
  sourceShotId: "shot_155",
  sceneType: "coverHook",
  title: "Google Gemini Morph Hook",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 82,
  actionBreakdownPath: "src/motion/shot_155/shot155-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_155/shot155-atomic-motions.ts",
  choreographyPath: "src/motion/shot_155/shot155-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/googleGeminiMorphHook.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_155/googleGeminiMorphHook.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-gemini-era-launch/shot_155_coverHook_0p00-2p73.mp4",
  atomicMotionIds: [...shot155AtomicMotionIds],
};
