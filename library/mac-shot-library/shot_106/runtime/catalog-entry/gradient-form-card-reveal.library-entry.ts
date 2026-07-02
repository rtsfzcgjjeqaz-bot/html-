import type { ShotLibraryEntry } from "./types";
import { shot106AtomicMotionIds } from "../atomic/shot106-atomic-motions";

export const gradientFormCardRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "gradient-form-card-reveal",
  choreographyId: "gradientFormCardReveal",
  sourceShotId: "shot_106",
  sceneType: "featureHighlight",
  title: "Gradient Form Card Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 96,
  actionBreakdownPath: "library/mac-shot-library/shot_106/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_106/runtime/atomic/shot106-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_106/runtime/choreography/gradientFormCardReveal.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_106/runtime/choreography/gradientFormCardReveal.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_106/gradientFormCardReveal.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-gradient-ai-brand/shot_106_featureHighlight_8p40-11p60.mp4",
  atomicMotionIds: [...shot106AtomicMotionIds],
};
