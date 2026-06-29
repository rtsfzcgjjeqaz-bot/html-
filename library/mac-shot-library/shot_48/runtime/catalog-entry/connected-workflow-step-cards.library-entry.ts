import type { ShotLibraryEntry } from "./types";
import { shot48AtomicMotionIds } from "../atomic/shot48-atomic-motions";

export const connectedWorkflowStepCardsLibraryEntry: ShotLibraryEntry = {
  libraryId: "connected-workflow-step-cards",
  choreographyId: "connectedWorkflowStepCards",
  sourceShotId: "shot_48",
  sceneType: "stepFlow",
  title: "Connected Workflow Step Cards",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 162,
  actionBreakdownPath: "src/motion/shot_48/shot48-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_48/shot48-atomic-motions.ts",
  choreographyPath: "src/motion/shot_48/shot48-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/connectedWorkflowStepCards.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_48/connectedWorkflowStepCards.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_48_stepFlow_5p2-10p57.mp4",
  atomicMotionIds: [...shot48AtomicMotionIds],
};
