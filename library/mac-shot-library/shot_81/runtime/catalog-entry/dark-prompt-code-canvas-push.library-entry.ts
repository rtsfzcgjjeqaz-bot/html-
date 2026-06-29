import type { ShotLibraryEntry } from "./types";
import { shot81AtomicMotionIds } from "../shot/shot81-atomic-motions";

export const darkPromptCodeCanvasPushLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-prompt-code-canvas-push",
  choreographyId: "darkPromptCodeCanvasPush",
  sourceShotId: "shot_81",
  sceneType: "searchDemo",
  title: "Dark Prompt Code Canvas Push",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 62,
  actionBreakdownPath: "src/motion/shot_81/shot81-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_81/shot81-atomic-motions.ts",
  choreographyPath: "src/motion/shot_81/shot81-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkPromptCodeCanvasPush.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_81/darkPromptCodeCanvasPush.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-interaction/shot_81_searchDemo_12p4-14p45.mp4",
  atomicMotionIds: [...shot81AtomicMotionIds],
};
