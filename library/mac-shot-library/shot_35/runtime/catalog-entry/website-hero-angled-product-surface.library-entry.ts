import type { ShotLibraryEntry } from "./types";
import { shot35AtomicMotionIds } from "../atomic/shot35-atomic-motions";

export const websiteHeroAngledProductSurfaceLibraryEntry: ShotLibraryEntry = {
  libraryId: "website-hero-angled-product-surface",
  choreographyId: "websiteHeroAngledProductSurface",
  sourceShotId: "shot_35",
  sceneType: "websiteHero",
  title: "Website Hero Angled Product Surface",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 188,
  actionBreakdownPath: "src/motion/shot_35/shot35-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_35/shot35-atomic-motions.ts",
  choreographyPath: "src/motion/shot_35/shot35-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/websiteHeroAngledProductSurface.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_35/websiteHeroAngledProductSurface.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_35_websiteHero_14p47-20p73.mp4",
  atomicMotionIds: [...shot35AtomicMotionIds],
};
