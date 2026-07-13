import type {ShotLibraryEntry} from "./types";
import {shot167AtomicMotionIds} from "../atomic/shot167-atomic-motions";

export const kineticQuestionBrandResolveLibraryEntry: ShotLibraryEntry = {
  libraryId: "kinetic-question-brand-resolve",
  choreographyId: "kineticQuestionBrandResolve",
  sourceShotId: "shot_167",
  sceneType: "coverHook",
  title: "Kinetic Question Brand Resolve",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 210,
  actionBreakdownPath: "src/motion/shot_167/shot167-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_167/shot167-atomic-motions.ts",
  choreographyPath: "src/motion/shot_167/shot167-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/kineticQuestionBrandResolve.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_167/kineticQuestionBrandResolve.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-remotion-code-promo/shot_167_coverHook_0p00-7p50.mp4",
  atomicMotionIds: [...shot167AtomicMotionIds],
};
