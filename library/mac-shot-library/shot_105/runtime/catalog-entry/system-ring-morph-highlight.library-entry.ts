import type { ShotLibraryEntry } from "./types";
import { shot105AtomicMotionIds } from "../atomic/shot105-atomic-motions";

export const systemRingMorphHighlightLibraryEntry: ShotLibraryEntry = {
  libraryId: "system-ring-morph-highlight",
  choreographyId: "systemRingMorphHighlight",
  sourceShotId: "shot_105",
  sceneType: "featureHighlight",
  title: "System Ring Morph Highlight",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 156,
  actionBreakdownPath: "library/mac-shot-library/shot_105/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_105/runtime/atomic/shot105-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_105/runtime/choreography/systemRingMorphHighlight.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_105/runtime/choreography/systemRingMorphHighlight.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_105/systemRingMorphHighlight.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-gradient-ai-brand/shot_105_featureHighlight_3p20-8p40.mp4",
  atomicMotionIds: [...shot105AtomicMotionIds],
};
