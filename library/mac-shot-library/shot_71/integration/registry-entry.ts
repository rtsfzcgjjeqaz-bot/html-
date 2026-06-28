import {
  SHOT_71_DURATION_FRAMES,
  Shot71MobileQualityGovernanceStackChoreography,
} from "../runtime/choreography/mobileQualityGovernanceStack";

export const mobileQualityGovernanceStackRegistryEntry = {
  id: "mobileQualityGovernanceStack",
  libraryId: "mobile-quality-governance-stack",
  sourceShotId: "shot_71",
  sceneType: "aiRecommendation",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_71_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_71/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_71/runtime/shot/shot71-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_71/runtime/shot/shot71-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_71/runtime/catalog-entry/mobile-quality-governance-stack.library-entry.ts",
  Component: Shot71MobileQualityGovernanceStackChoreography,
} as const;
