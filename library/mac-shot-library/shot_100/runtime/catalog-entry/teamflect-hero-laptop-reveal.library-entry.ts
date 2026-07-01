import type { ShotLibraryEntry } from "./types";
import { shot100AtomicMotionIds } from "../atomic/shot100-atomic-motions";

export const teamflectHeroLaptopRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "teamflect-hero-laptop-reveal",
  choreographyId: "teamflectHeroLaptopReveal",
  sourceShotId: "shot_100",
  sceneType: "websiteHero",
  title: "Teamflect Hero Laptop Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 99,
  actionBreakdownPath: "library/mac-shot-library/shot_100/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_100/runtime/atomic/shot100-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_100/runtime/choreography/teamflectHeroLaptopReveal.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_100/runtime/choreography/teamflectHeroLaptopReveal.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_100/teamflectHeroLaptopReveal.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-software-feature-clarity/shot_100_websiteHero_0p00-3p30.mp4",
  atomicMotionIds: [...shot100AtomicMotionIds],
};
