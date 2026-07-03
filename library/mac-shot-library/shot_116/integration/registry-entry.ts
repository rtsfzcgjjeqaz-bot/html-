import {
  SHOT_116_DURATION_FRAMES,
  Shot116DarkAgentDashboardGridBuildChoreography,
} from "../runtime/choreography/darkAgentDashboardGridBuild";

export const darkAgentDashboardGridBuildRegistryEntry = {
  id: "darkAgentDashboardGridBuild",
  libraryId: "dark-agent-dashboard-grid-build",
  sourceShotId: "shot_116",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_116_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_116/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_116/runtime/atomic/shot116-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_116/runtime/choreography/darkAgentDashboardGridBuild.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_116/runtime/catalog-entry/dark-agent-dashboard-grid-build.library-entry.ts",
  Component: Shot116DarkAgentDashboardGridBuildChoreography,
} as const;
