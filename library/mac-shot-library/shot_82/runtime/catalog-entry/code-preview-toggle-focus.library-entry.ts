import type { ShotLibraryEntry } from "./types";
import { shot82AtomicMotionIds } from "../atomic/shot82-atomic-motions";

export const codePreviewToggleFocusLibraryEntry: ShotLibraryEntry = {
  libraryId: "code-preview-toggle-focus",
  choreographyId: "codePreviewToggleFocus",
  sourceShotId: "shot_82",
  sceneType: "featureHighlight",
  title: "Code Preview Toggle Focus",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 67,
  actionBreakdownPath: "src/motion/shot_82/shot82-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_82/shot82-atomic-motions.ts",
  choreographyPath: "src/motion/shot_82/shot82-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/codePreviewToggleFocus.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_82/codePreviewToggleFocus.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-interaction/shot_82_featureHighlight_14p45-16p7.mp4",
  atomicMotionIds: [...shot82AtomicMotionIds],
};
