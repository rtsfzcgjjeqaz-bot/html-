import {
  SHOT_136_DURATION_FRAMES,
  Shot136PrebuiltAgentCardsRevealChoreography,
} from "../runtime/choreography/prebuiltAgentCardsReveal";

export const prebuiltAgentCardsRevealRegistryEntry = {
  id: "prebuiltAgentCardsReveal",
  libraryId: "prebuilt-agent-cards-reveal",
  sourceShotId: "shot_136",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_136_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_136/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_136/runtime/atomic/shot136-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_136/runtime/choreography/prebuiltAgentCardsReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_136/runtime/catalog-entry/prebuilt-agent-cards-reveal.library-entry.ts",
  Component: Shot136PrebuiltAgentCardsRevealChoreography,
} as const;
