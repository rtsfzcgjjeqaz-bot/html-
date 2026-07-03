import type { ShotLibraryEntry } from "./types";
import { shot117AtomicMotionIds } from "../shot_117/shot117-atomic-motions";

export const floatingWorkflowStepRailLibraryEntry: ShotLibraryEntry = {
  libraryId: "floating-workflow-step-rail",
  choreographyId: "floatingWorkflowStepRail",
  sourceShotId: "shot_117",
  sceneType: "stepFlow",
  title: "Floating Workflow Step Rail",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 78,
  actionBreakdownPath: "src/motion/shot_117/shot117-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_117/shot117-atomic-motions.ts",
  choreographyPath: "src/motion/shot_117/shot117-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/floatingWorkflowStepRail.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_117/floatingWorkflowStepRail.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_117_stepFlow_13p70-16p30.mp4",
  atomicMotionIds: [...shot117AtomicMotionIds],
};
