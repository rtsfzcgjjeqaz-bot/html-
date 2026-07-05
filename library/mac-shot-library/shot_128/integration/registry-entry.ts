import {
  SHOT_128_DURATION_FRAMES,
  Shot128BookAudioDropTransformChoreography,
} from "../runtime/choreography/bookAudioDropTransform";

export const bookAudioDropTransformRegistryEntry = {
  id: "bookAudioDropTransform",
  libraryId: "book-audio-drop-transform",
  sourceShotId: "shot_128",
  sceneType: "featureHighlight",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_128_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_128/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_128/runtime/atomic/shot128-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_128/runtime/choreography/bookAudioDropTransform.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_128/runtime/catalog-entry/book-audio-drop-transform.library-entry.ts",
  Component: Shot128BookAudioDropTransformChoreography,
} as const;
