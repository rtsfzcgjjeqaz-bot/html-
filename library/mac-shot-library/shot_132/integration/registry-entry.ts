import {
  SHOT_132_DURATION_FRAMES,
  Shot132DashboardSearchSelectFocusChoreography,
} from "../runtime/choreography/dashboardSearchSelectFocus";

export const dashboardSearchSelectFocusRegistryEntry = {
  id: "dashboardSearchSelectFocus",
  libraryId: "dashboard-search-select-focus",
  sourceShotId: "shot_132",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_132_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_132/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_132/runtime/atomic/shot132-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_132/runtime/choreography/dashboardSearchSelectFocus.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_132/runtime/catalog-entry/dashboard-search-select-focus.library-entry.ts",
  Component: Shot132DashboardSearchSelectFocusChoreography,
} as const;
