import type { ShotLibraryEntry } from "./types";
import { shot150AtomicMotionIds } from "../shot_150/shot150-atomic-motions";

export const promptCommandBarMacroLibraryEntry: ShotLibraryEntry = {
  libraryId: "prompt-command-bar-macro",
  choreographyId: "promptCommandBarMacro",
  sourceShotId: "shot_150",
  sceneType: "searchDemo",
  title: "Prompt Command Bar Macro",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 150,
  actionBreakdownPath: "src/motion/shot_150/shot150-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_150/shot150-atomic-motions.ts",
  choreographyPath: "src/motion/shot_150/shot150-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/promptCommandBarMacro.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_150/promptCommandBarMacro.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_150_searchDemo_18p43-24p70.mp4",
  atomicMotionIds: [...shot150AtomicMotionIds],
};
