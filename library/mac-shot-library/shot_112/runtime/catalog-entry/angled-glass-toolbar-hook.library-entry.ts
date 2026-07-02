import type { ShotLibraryEntry } from "./types";
import { shot112AtomicMotionIds } from "../atomic/shot112-atomic-motions";

export const angledGlassToolbarHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "angled-glass-toolbar-hook",
  choreographyId: "angledGlassToolbarHook",
  sourceShotId: "shot_112",
  sceneType: "coverHook",
  title: "Angled Glass Toolbar Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 81,
  actionBreakdownPath: "library/mac-shot-library/shot_112/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_112/runtime/atomic/shot112-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_112/runtime/choreography/angledGlassToolbarHook.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_112/runtime/choreography/angledGlassToolbarHook.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_112/angledGlassToolbarHook.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-saas-agent-mainstream/shot_112_coverHook_0p00-2p70.mp4",
  atomicMotionIds: [...shot112AtomicMotionIds],
};
