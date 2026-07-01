import type { ShotLibraryEntry } from "./types";
import { shot95AtomicMotionIds } from "../atomic/shot95-atomic-motions";

export const kitaabhBrandFinalCtaLibraryEntry: ShotLibraryEntry = {
  libraryId: "kitaabh-brand-final-cta",
  choreographyId: "kitaabhBrandFinalCta",
  sourceShotId: "shot_95",
  sceneType: "finalCTA",
  title: "Kitaabh Brand Final CTA",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 70,
  actionBreakdownPath: "library/mac-shot-library/shot_95/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_95/runtime/atomic/shot95-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_95/runtime/choreography/kitaabhBrandFinalCta.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_95/runtime/choreography/kitaabhBrandFinalCta.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_95/kitaabhBrandFinalCta.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_95_finalCTA_18p00-20p34.mp4",
  atomicMotionIds: [...shot95AtomicMotionIds],
};
