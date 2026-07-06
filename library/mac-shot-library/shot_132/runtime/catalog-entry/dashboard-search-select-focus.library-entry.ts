import type { ShotLibraryEntry } from "./types";
import { shot132AtomicMotionIds } from "../atomic/shot132-atomic-motions";

export const dashboardSearchSelectFocusLibraryEntry: ShotLibraryEntry = {
  libraryId: "dashboard-search-select-focus",
  choreographyId: "dashboardSearchSelectFocus",
  sourceShotId: "shot_132",
  sceneType: "searchDemo",
  title: "Dashboard Search Select Focus",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 84,
  actionBreakdownPath: "src/motion/shot_132/shot132-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_132/shot132-atomic-motions.ts",
  choreographyPath: "src/motion/shot_132/shot132-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/dashboardSearchSelectFocus.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_132/dashboardSearchSelectFocus.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_132_searchDemo_14p6-17p4.mp4",
  atomicMotionIds: [...shot132AtomicMotionIds],
};
