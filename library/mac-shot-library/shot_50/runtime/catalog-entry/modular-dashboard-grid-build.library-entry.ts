import type { ShotLibraryEntry } from "./types";
import { shot50AtomicMotionIds } from "../shot_50/shot50-atomic-motions";

export const modularDashboardGridBuildLibraryEntry: ShotLibraryEntry = {
  libraryId: "modular-dashboard-grid-build",
  choreographyId: "modularDashboardGridBuild",
  sourceShotId: "shot_50",
  sceneType: "appGrid",
  title: "Modular Dashboard Grid Build",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 162,
  actionBreakdownPath: "src/motion/shot_50/shot50-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_50/shot50-atomic-motions.ts",
  choreographyPath: "src/motion/shot_50/shot50-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/modularDashboardGridBuild.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_50/modularDashboardGridBuild.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_50_appGrid_15p93-21p3.mp4",
  atomicMotionIds: [...shot50AtomicMotionIds],
};
