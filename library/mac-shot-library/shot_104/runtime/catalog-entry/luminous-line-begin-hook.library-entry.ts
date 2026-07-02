import type { ShotLibraryEntry } from "./types";
import { shot104AtomicMotionIds } from "../atomic/shot104-atomic-motions";

export const luminousLineBeginHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "luminous-line-begin-hook",
  choreographyId: "luminousLineBeginHook",
  sourceShotId: "shot_104",
  sceneType: "coverHook",
  title: "Luminous Line Begin Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 96,
  actionBreakdownPath: "library/mac-shot-library/shot_104/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_104/runtime/atomic/shot104-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_104/runtime/choreography/luminousLineBeginHook.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_104/runtime/choreography/luminousLineBeginHook.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_104/luminousLineBeginHook.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-gradient-ai-brand/shot_104_coverHook_0p00-3p20.mp4",
  atomicMotionIds: [...shot104AtomicMotionIds],
};
