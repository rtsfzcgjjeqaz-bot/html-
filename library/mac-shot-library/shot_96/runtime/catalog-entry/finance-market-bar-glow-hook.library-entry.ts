import type { ShotLibraryEntry } from "./types";
import { shot96AtomicMotionIds } from "../atomic/shot96-atomic-motions";

export const financeMarketBarGlowHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "finance-market-bar-glow-hook",
  choreographyId: "financeMarketBarGlowHook",
  sourceShotId: "shot_96",
  sceneType: "coverHook",
  title: "Finance Market Bar Glow Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 126,
  actionBreakdownPath: "library/mac-shot-library/shot_96/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_96/runtime/atomic/shot96-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_96/runtime/choreography/financeMarketBarGlowHook.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_96/runtime/choreography/financeMarketBarGlowHook.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_96/financeMarketBarGlowHook.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-currency-stock-infographics/shot_96_coverHook_0p00-4p20.mp4",
  atomicMotionIds: [...shot96AtomicMotionIds],
};
