import {
  SHOT_115_DURATION_FRAMES,
  Shot115ThemeSwitchDocumentCardsChoreography,
} from "../runtime/choreography/themeSwitchDocumentCards";

export const themeSwitchDocumentCardsRegistryEntry = {
  id: "themeSwitchDocumentCards",
  libraryId: "theme-switch-document-cards",
  sourceShotId: "shot_115",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_115_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_115/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_115/runtime/atomic/shot115-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_115/runtime/choreography/themeSwitchDocumentCards.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_115/runtime/catalog-entry/theme-switch-document-cards.library-entry.ts",
  Component: Shot115ThemeSwitchDocumentCardsChoreography,
} as const;
