import type { ShotLibraryEntry } from "./types";
import { shot36AtomicMotionIds } from "../shot_36/shot36-atomic-motions";

export const emailDraftGenerationDemoLibraryEntry: ShotLibraryEntry = {
  libraryId: "email-draft-generation-demo",
  choreographyId: "emailDraftGenerationDemo",
  sourceShotId: "shot_36",
  sceneType: "searchDemo",
  title: "Email Draft Generation Demo",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 288,
  actionBreakdownPath: "src/motion/shot_36/shot36-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_36/shot36-atomic-motions.ts",
  choreographyPath: "src/motion/shot_36/shot36-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/emailDraftGenerationDemo.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_36/emailDraftGenerationDemo.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_36_searchDemo_20p73-30p33.mp4",
  atomicMotionIds: [...shot36AtomicMotionIds],
};
