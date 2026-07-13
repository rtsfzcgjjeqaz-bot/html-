import type { ShotLibraryEntry } from "./types";
import { shot159AtomicMotionIds } from "../atomic/shot159-atomic-motions";

export const emailContextAssistPanelLibraryEntry: ShotLibraryEntry = {
  libraryId: "email-context-assist-panel",
  choreographyId: "emailContextAssistPanel",
  sourceShotId: "shot_159",
  sceneType: "aiRecommendation",
  title: "Email Context Assist Panel",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 180,
  actionBreakdownPath: "src/motion/shot_159/shot159-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_159/shot159-atomic-motions.ts",
  choreographyPath: "src/motion/shot_159/shot159-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/emailContextAssistPanel.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_159/emailContextAssistPanel.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-gemini-era-launch/shot_159_aiRecommendation_13p23-19p23.mp4",
  atomicMotionIds: [...shot159AtomicMotionIds],
};
