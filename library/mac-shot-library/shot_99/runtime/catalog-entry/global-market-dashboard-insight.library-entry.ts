import type { ShotLibraryEntry } from "./types";
import { shot99AtomicMotionIds } from "../atomic/shot99-atomic-motions";

export const globalMarketDashboardInsightLibraryEntry: ShotLibraryEntry = {
  libraryId: "global-market-dashboard-insight",
  choreographyId: "globalMarketDashboardInsight",
  sourceShotId: "shot_99",
  sceneType: "priceInsight",
  title: "Global Market Dashboard Insight",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 175,
  actionBreakdownPath: "library/mac-shot-library/shot_99/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_99/runtime/atomic/shot99-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_99/runtime/choreography/globalMarketDashboardInsight.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_99/runtime/choreography/globalMarketDashboardInsight.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_99/globalMarketDashboardInsight.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-currency-stock-infographics/shot_99_priceInsight_15p84-21p68.mp4",
  atomicMotionIds: [...shot99AtomicMotionIds],
};
