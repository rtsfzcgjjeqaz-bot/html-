import type { ShotLibraryEntry } from "./types";
import { shot116AtomicMotionIds } from "../shot_116/shot116-atomic-motions";

export const darkAgentDashboardGridBuildLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-agent-dashboard-grid-build",
  choreographyId: "darkAgentDashboardGridBuild",
  sourceShotId: "shot_116",
  sceneType: "appGrid",
  title: "Dark Agent Dashboard Grid Build",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 81,
  actionBreakdownPath: "src/motion/shot_116/shot116-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_116/shot116-atomic-motions.ts",
  choreographyPath: "src/motion/shot_116/shot116-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkAgentDashboardGridBuild.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_116/darkAgentDashboardGridBuild.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_116_appGrid_11p00-13p70.mp4",
  atomicMotionIds: [...shot116AtomicMotionIds],
};
