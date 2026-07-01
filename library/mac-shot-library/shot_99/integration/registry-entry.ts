import {
  SHOT_99_DURATION_FRAMES,
  Shot99GlobalMarketDashboardInsightChoreography,
} from "../runtime/choreography/globalMarketDashboardInsight";

export const globalMarketDashboardInsightRegistryEntry = {
  id: "globalMarketDashboardInsight",
  libraryId: "global-market-dashboard-insight",
  sourceShotId: "shot_99",
  sceneType: "priceInsight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_99_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_99/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_99/runtime/atomic/shot99-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_99/runtime/choreography/globalMarketDashboardInsight.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_99/runtime/catalog-entry/global-market-dashboard-insight.library-entry.ts",
  Component: Shot99GlobalMarketDashboardInsightChoreography,
} as const;
