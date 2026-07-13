import type { ShotLibraryEntry } from "./types";
import { shot146AtomicMotionIds } from "../shot_146/shot146-atomic-motions";

export const darkWordmarkOrbitHeroLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-wordmark-orbit-hero",
  choreographyId: "darkWordmarkOrbitHero",
  sourceShotId: "shot_146",
  sceneType: "websiteHero",
  title: "Dark Wordmark Orbit Hero",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 132,
  actionBreakdownPath: "src/motion/shot_146/shot146-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_146/shot146-atomic-motions.ts",
  choreographyPath: "src/motion/shot_146/shot146-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkWordmarkOrbitHero.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_146/darkWordmarkOrbitHero.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_146_websiteHero_3p37-7p77.mp4",
  atomicMotionIds: [...shot146AtomicMotionIds],
};
