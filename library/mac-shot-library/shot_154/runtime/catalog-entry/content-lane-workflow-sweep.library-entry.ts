import type { ShotLibraryEntry } from "./types";
import { shot154AtomicMotionIds } from "../shot_154/shot154-atomic-motions";

export const contentLaneWorkflowSweepLibraryEntry: ShotLibraryEntry = {
  libraryId: "content-lane-workflow-sweep",
  choreographyId: "contentLaneWorkflowSweep",
  sourceShotId: "shot_154",
  sceneType: "stepFlow",
  title: "Content Lane Workflow Sweep",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 173,
  actionBreakdownPath: "src/motion/shot_154/shot154-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_154/shot154-atomic-motions.ts",
  choreographyPath: "src/motion/shot_154/shot154-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/contentLaneWorkflowSweep.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_154/contentLaneWorkflowSweep.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_154_stepFlow_38p27-44p07.mp4",
  atomicMotionIds: [...shot154AtomicMotionIds],
};
