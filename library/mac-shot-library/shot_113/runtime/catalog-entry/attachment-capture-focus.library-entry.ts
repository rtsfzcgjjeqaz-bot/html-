import type { ShotLibraryEntry } from "./types";
import { shot113AtomicMotionIds } from "../shot_113/shot113-atomic-motions";

export const attachmentCaptureFocusLibraryEntry: ShotLibraryEntry = {
  libraryId: "attachment-capture-focus",
  choreographyId: "attachmentCaptureFocus",
  sourceShotId: "shot_113",
  sceneType: "searchDemo",
  title: "Attachment Capture Focus",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 93,
  actionBreakdownPath: "src/motion/shot_113/shot113-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_113/shot113-atomic-motions.ts",
  choreographyPath: "src/motion/shot_113/shot113-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/attachmentCaptureFocus.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_113/attachmentCaptureFocus.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_113_searchDemo_2p70-5p80.mp4",
  atomicMotionIds: [...shot113AtomicMotionIds],
};
