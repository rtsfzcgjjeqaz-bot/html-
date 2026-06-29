import {
  SHOT_35_DURATION_FRAMES,
  Shot35WebsiteHeroAngledProductSurfaceChoreography,
} from "../runtime/choreography/websiteHeroAngledProductSurface";

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
  actionBreakdownPath: "library/mac-shot-library/shot_35/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_35/runtime/atomic/shot35-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_35/runtime/choreography/websiteHeroAngledProductSurface.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_35/runtime/catalog-entry/website-hero-angled-product-surface.library-entry.ts",
  Component: Shot35WebsiteHeroAngledProductSurfaceChoreography,
} as const;
