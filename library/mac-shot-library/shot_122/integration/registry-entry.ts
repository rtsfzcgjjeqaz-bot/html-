import {
  SHOT_122_DURATION_FRAMES,
  Shot122PhoneCarouselPerformanceFanChoreography,
} from "../runtime/choreography/phoneCarouselPerformanceFan";

export const phoneCarouselPerformanceFanRegistryEntry = {
  id: "phoneCarouselPerformanceFan",
  libraryId: "phone-carousel-performance-fan",
  sourceShotId: "shot_122",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_122_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_122/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_122/runtime/atomic/shot122-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_122/runtime/choreography/phoneCarouselPerformanceFan.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_122/runtime/catalog-entry/phone-carousel-performance-fan.library-entry.ts",
  Component: Shot122PhoneCarouselPerformanceFanChoreography,
} as const;
