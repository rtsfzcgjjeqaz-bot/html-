import {
  SHOT_134_DURATION_FRAMES,
  Shot134MultiLanguageCardFanoutChoreography,
} from "../runtime/choreography/multiLanguageCardFanout";

export const multiLanguageCardFanoutRegistryEntry = {
  id: "multiLanguageCardFanout",
  libraryId: "multi-language-card-fanout",
  sourceShotId: "shot_134",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_134_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_134/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_134/runtime/atomic/shot134-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_134/runtime/choreography/multiLanguageCardFanout.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_134/runtime/catalog-entry/multi-language-card-fanout.library-entry.ts",
  Component: Shot134MultiLanguageCardFanoutChoreography,
} as const;
