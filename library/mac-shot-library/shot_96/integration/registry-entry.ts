import {
  SHOT_96_DURATION_FRAMES,
  Shot96FinanceMarketBarGlowHookChoreography,
} from "../runtime/choreography/financeMarketBarGlowHook";

export const financeMarketBarGlowHookRegistryEntry = {
  id: "financeMarketBarGlowHook",
  libraryId: "finance-market-bar-glow-hook",
  sourceShotId: "shot_96",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_96_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_96/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_96/runtime/atomic/shot96-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_96/runtime/choreography/financeMarketBarGlowHook.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_96/runtime/catalog-entry/finance-market-bar-glow-hook.library-entry.ts",
  Component: Shot96FinanceMarketBarGlowHookChoreography,
} as const;
