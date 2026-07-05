import type { ShotLibraryEntry } from "./types";
import { shot128AtomicMotionIds } from "../shot_128/shot128-atomic-motions";

export const bookAudioDropTransformLibraryEntry: ShotLibraryEntry = {
  libraryId: "book-audio-drop-transform",
  choreographyId: "bookAudioDropTransform",
  sourceShotId: "shot_128",
  sceneType: "featureHighlight",
  title: "Book Audio Drop Transform",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 87,
  actionBreakdownPath: "src/motion/shot_128/shot128-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_128/shot128-atomic-motions.ts",
  choreographyPath: "src/motion/shot_128/shot128-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/bookAudioDropTransform.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_128/bookAudioDropTransform.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_128_featureHighlight_2p2-5p1.mp4",
  atomicMotionIds: [...shot128AtomicMotionIds],
};
