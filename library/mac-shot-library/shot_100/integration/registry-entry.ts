import {
  SHOT_100_DURATION_FRAMES,
  Shot100TeamflectHeroLaptopRevealChoreography,
} from "../runtime/choreography/teamflectHeroLaptopReveal";

export const teamflectHeroLaptopRevealRegistryEntry = {
  id: "teamflectHeroLaptopReveal",
  libraryId: "teamflect-hero-laptop-reveal",
  sourceShotId: "shot_100",
  sceneType: "websiteHero",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_100_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_100/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_100/runtime/atomic/shot100-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_100/runtime/choreography/teamflectHeroLaptopReveal.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_100/runtime/catalog-entry/teamflect-hero-laptop-reveal.library-entry.ts",
  Component: Shot100TeamflectHeroLaptopRevealChoreography,
} as const;
