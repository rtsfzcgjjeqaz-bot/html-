import type { ShotLibraryEntry } from "./types";
import { shot123AtomicMotionIds } from "../shot_123/shot123-atomic-motions";

export const languageNeedPromptFocusLibraryEntry: ShotLibraryEntry = {
  libraryId: "language-need-prompt-focus",
  choreographyId: "languageNeedPromptFocus",
  sourceShotId: "shot_123",
  sceneType: "searchDemo",
  title: "Language Need Prompt Focus",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 66,
  actionBreakdownPath: "src/motion/shot_123/shot123-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_123/shot123-atomic-motions.ts",
  choreographyPath: "src/motion/shot_123/shot123-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/languageNeedPromptFocus.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_123/languageNeedPromptFocus.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-google-ai-software/shot_123_searchDemo_6p20-8p40.mp4",
  atomicMotionIds: [...shot123AtomicMotionIds],
};
