import type { ShotLibraryEntry } from "./types";
import { shot152AtomicMotionIds } from "../shot_152/shot152-atomic-motions";

export const assistantPanelConfirmFlowLibraryEntry: ShotLibraryEntry = {
  libraryId: "assistant-panel-confirm-flow",
  choreographyId: "assistantPanelConfirmFlow",
  sourceShotId: "shot_152",
  sceneType: "aiRecommendation",
  title: "Assistant Panel Confirm Flow",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 189,
  actionBreakdownPath: "src/motion/shot_152/shot152-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_152/shot152-atomic-motions.ts",
  choreographyPath: "src/motion/shot_152/shot152-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/assistantPanelConfirmFlow.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_152/assistantPanelConfirmFlow.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_152_aiRecommendation_28p93-35p20.mp4",
  atomicMotionIds: [...shot152AtomicMotionIds],
};
