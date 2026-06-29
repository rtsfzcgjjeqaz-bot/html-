import {
  SHOT_76_DURATION_FRAMES,
  Shot76DarkAssistantDeviceHeroChoreography,
} from "../runtime/choreography/darkAssistantDeviceHero";

export const darkAssistantDeviceHeroRegistryEntry = {
  id: "darkAssistantDeviceHero",
  libraryId: "dark-assistant-device-hero",
  sourceShotId: "shot_76",
  sceneType: "websiteHero",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_76_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_76/analysis/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_76/runtime/shot/shot76-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_76/runtime/shot/shot76-choreography.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_76/runtime/catalog-entry/dark-assistant-device-hero.library-entry.ts",
  Component: Shot76DarkAssistantDeviceHeroChoreography,
} as const;
