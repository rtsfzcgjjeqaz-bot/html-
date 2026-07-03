import type { ShotLibraryEntry } from "./types";
import { shot118AtomicMotionIds } from "../shot_118/shot118-atomic-motions";

export const agentCommandBoardShowcaseLibraryEntry: ShotLibraryEntry = {
  libraryId: "agent-command-board-showcase",
  choreographyId: "agentCommandBoardShowcase",
  sourceShotId: "shot_118",
  sceneType: "appGrid",
  title: "Agent Command Board Showcase",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 66,
  actionBreakdownPath: "src/motion/shot_118/shot118-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_118/shot118-atomic-motions.ts",
  choreographyPath: "src/motion/shot_118/shot118-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/agentCommandBoardShowcase.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_118/agentCommandBoardShowcase.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_118_appGrid_16p30-18p50.mp4",
  atomicMotionIds: [...shot118AtomicMotionIds],
};
