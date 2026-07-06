import type { ShotLibraryEntry } from "./types";
import { shot135AtomicMotionIds } from "../atomic/shot135-atomic-motions";

export const translateDubDistributeFinalCtaLibraryEntry: ShotLibraryEntry = {
  libraryId: "translate-dub-distribute-final-cta",
  choreographyId: "translateDubDistributeFinalCta",
  sourceShotId: "shot_135",
  sceneType: "finalCTA",
  title: "Translate Dub Distribute Final CTA",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 106,
  actionBreakdownPath: "src/motion/shot_135/shot135-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_135/shot135-atomic-motions.ts",
  choreographyPath: "src/motion/shot_135/shot135-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/translateDubDistributeFinalCta.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_135/translateDubDistributeFinalCta.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_135_finalCTA_24p3-27p84.mp4",
  atomicMotionIds: [...shot135AtomicMotionIds],
};
