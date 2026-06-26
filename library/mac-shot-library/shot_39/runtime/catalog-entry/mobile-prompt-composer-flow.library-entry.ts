import type { ShotLibraryEntry } from "./types";
import { shot39AtomicMotionIds } from "../shot_39/shot39-atomic-motions";

export const mobilePromptComposerFlowLibraryEntry: ShotLibraryEntry = {
  libraryId: "mobile-prompt-composer-flow",
  choreographyId: "mobilePromptComposerFlow",
  sourceShotId: "shot_39",
  sceneType: "searchDemo",
  title: "Mobile Prompt Composer Flow",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 111,
  actionBreakdownPath: "src/motion/shot_39/shot39-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_39/shot39-atomic-motions.ts",
  choreographyPath: "src/motion/shot_39/shot39-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/mobilePromptComposerFlow.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_39/mobilePromptComposerFlow.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_39_searchDemo_39p37-43p07.mp4",
  atomicMotionIds: [...shot39AtomicMotionIds],
};
