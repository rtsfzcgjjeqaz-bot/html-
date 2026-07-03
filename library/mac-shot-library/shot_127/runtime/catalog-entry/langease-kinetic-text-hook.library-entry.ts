import type { ShotLibraryEntry } from "./types";
import { shot127AtomicMotionIds } from "../shot_127/shot127-atomic-motions";

export const langeaseKineticTextHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "langease-kinetic-text-hook",
  choreographyId: "langeaseKineticTextHook",
  sourceShotId: "shot_127",
  sceneType: "coverHook",
  title: "Langease Kinetic Text Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 66,
  actionBreakdownPath: "src/motion/shot_127/shot127-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_127/shot127-atomic-motions.ts",
  choreographyPath: "src/motion/shot_127/shot127-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/langeaseKineticTextHook.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_127/langeaseKineticTextHook.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_127_coverHook_0p0-2p2.mp4",
  atomicMotionIds: [...shot127AtomicMotionIds],
};
