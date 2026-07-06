import type { ShotLibraryEntry } from "./types";
import { shot137AtomicMotionIds } from "../atomic/shot137-atomic-motions";

export const workflowStepperBridgeLibraryEntry: ShotLibraryEntry = {
  libraryId: "workflow-stepper-bridge",
  choreographyId: "workflowStepperBridge",
  sourceShotId: "shot_137",
  sceneType: "stepFlow",
  title: "Workflow Stepper Bridge",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 87,
  actionBreakdownPath: "src/motion/shot_137/shot137-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_137/shot137-atomic-motions.ts",
  choreographyPath: "src/motion/shot_137/shot137-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/workflowStepperBridge.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_137/workflowStepperBridge.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_137_stepFlow_4p6-7p4.mp4",
  atomicMotionIds: [...shot137AtomicMotionIds],
};
