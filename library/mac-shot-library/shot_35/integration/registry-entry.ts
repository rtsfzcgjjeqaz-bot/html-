import {
  SHOT_35_DURATION_FRAMES,
  Shot35WebsiteHeroAngledProductSurfaceChoreography,
} from "./choreographies/websiteHeroAngledProductSurface";

export const websiteHeroAngledProductSurfaceRegistryEntry = {
  id: "websiteHeroAngledProductSurface",
  libraryId: "website-hero-angled-product-surface",
  sourceShotId: "shot_35",
  sceneType: "websiteHero",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_35_DURATION_FRAMES,
  actionBreakdownPath: "src/motion/shot_35/shot35-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_35/shot35-atomic-motions.ts",
  choreographyPath: "src/motion/shot_35/shot35-choreography.tsx",
  catalogEntryPath: "src/motion/catalog/website-hero-angled-product-surface.library-entry.ts",
  Component: Shot35WebsiteHeroAngledProductSurfaceChoreography,
};
