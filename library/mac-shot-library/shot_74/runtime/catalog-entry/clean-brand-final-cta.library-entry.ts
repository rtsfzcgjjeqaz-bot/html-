import type { ShotLibraryEntry } from "./types";
import { shot74AtomicMotionIds } from "../atomic/shot74-atomic-motions";

export const cleanBrandFinalCtaLibraryEntry: ShotLibraryEntry = {
  libraryId: "clean-brand-final-cta",
  choreographyId: "cleanBrandFinalCta",
  sourceShotId: "shot_74",
  sceneType: "finalCTA",
  title: "Clean Brand Final CTA",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 64,
  actionBreakdownPath: "src/motion/shot_74/shot74-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_74/shot74-atomic-motions.ts",
  choreographyPath: "src/motion/shot_74/shot74-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/cleanBrandFinalCta.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_74/cleanBrandFinalCta.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_74_finalCTA_142p0-144p13.mp4",
  atomicMotionIds: [...shot74AtomicMotionIds],
};
