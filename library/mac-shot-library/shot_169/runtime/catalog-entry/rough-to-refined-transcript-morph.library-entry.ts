import type {ShotLibraryEntry} from "./types";
import {shot169AtomicMotionIds} from "../atomic/shot169-atomic-motions";

export const roughToRefinedTranscriptMorphLibraryEntry: ShotLibraryEntry = {
  libraryId: "rough-to-refined-transcript-morph", choreographyId: "roughToRefinedTranscriptMorph", sourceShotId: "shot_169", sceneType: "resultComparison", title: "Rough To Refined Transcript Morph", approved: true, allowedInFactory: true, implementationVerified: true, durationFrames: 201,
  actionBreakdownPath: "src/motion/shot_169/shot169-action-breakdown.md", atomicMotionsPath: "src/motion/shot_169/shot169-atomic-motions.ts", choreographyPath: "src/motion/shot_169/shot169-choreography.tsx", executableChoreographyPath: "src/motion/choreographies/roughToRefinedTranscriptMorph.tsx", certificationPreviewPath: "outputs/motion-catalog/review/shot_169/roughToRefinedTranscriptMorph.preview.mp4", sourceReferencePath: "references/extracted-shots/new-reference-remotion-code-promo/shot_169_resultComparison_11p80-18p50.mp4", atomicMotionIds: [...shot169AtomicMotionIds],
};
