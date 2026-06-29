import type { ShotLibraryEntry } from "./types";
import { shot55AtomicMotionIds } from "../atomic/shot55-atomic-motions";

export const aiRequirementComposerLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-requirement-composer",
  choreographyId: "aiRequirementComposer",
  sourceShotId: "shot_55",
  sceneType: "searchDemo",
  title: "AI Requirement Composer",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 178,
  actionBreakdownPath: "src/motion/shot_55/shot55-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_55/shot55-atomic-motions.ts",
  choreographyPath: "src/motion/shot_55/shot55-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/aiRequirementComposer.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_55/aiRequirementComposer.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_55_searchDemo_40p85-46p79.mp4",
  atomicMotionIds: [...shot55AtomicMotionIds],
};
