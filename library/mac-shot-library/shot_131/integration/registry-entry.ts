import {
  SHOT_131_DURATION_FRAMES,
  Shot131VideoCardLibraryGridSweepChoreography,
} from "../runtime/choreography/videoCardLibraryGridSweep";

export const videoCardLibraryGridSweepRegistryEntry = {
  id: "videoCardLibraryGridSweep",
  libraryId: "video-card-library-grid-sweep",
  sourceShotId: "shot_131",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_131_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_131/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_131/runtime/atomic/shot131-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_131/runtime/choreography/videoCardLibraryGridSweep.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_131/runtime/catalog-entry/video-card-library-grid-sweep.library-entry.ts",
  Component: Shot131VideoCardLibraryGridSweepChoreography,
} as const;
