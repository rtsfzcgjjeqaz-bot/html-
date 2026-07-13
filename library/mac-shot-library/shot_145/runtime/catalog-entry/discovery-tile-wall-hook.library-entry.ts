import type { ShotLibraryEntry } from "./types";
import { shot145AtomicMotionIds } from "../shot_145/shot145-atomic-motions";

export const discoveryTileWallHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "discovery-tile-wall-hook",
  choreographyId: "discoveryTileWallHook",
  sourceShotId: "shot_145",
  sceneType: "coverHook",
  title: "Discovery Tile Wall Hook",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 108,
  actionBreakdownPath: "src/motion/shot_145/shot145-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_145/shot145-atomic-motions.ts",
  choreographyPath: "src/motion/shot_145/shot145-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/discoveryTileWallHook.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_145/discoveryTileWallHook.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ui-brand-story/shot_145_coverHook_0p00-3p37.mp4",
  atomicMotionIds: [...shot145AtomicMotionIds],
};
