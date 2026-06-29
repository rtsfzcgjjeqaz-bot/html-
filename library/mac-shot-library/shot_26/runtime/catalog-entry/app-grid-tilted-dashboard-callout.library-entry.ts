import type { ShotLibraryEntry } from "./types";
import { shot26AtomicMotionIds } from "../atomic/shot26-atomic-motions";

export const appGridTiltedDashboardCalloutLibraryEntry: ShotLibraryEntry = {
  libraryId: "app-grid-tilted-dashboard-callout",
  choreographyId: "appGridTiltedDashboardCallout",
  sourceShotId: "shot_26",
  sceneType: "appGrid",
  title: "App Grid Tilted Dashboard Callout",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 194,
  actionBreakdownPath: "src/motion/shot_26/shot26-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_26/shot26-atomic-motions.ts",
  choreographyPath: "src/motion/shot_26/shot26-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/appGridTiltedDashboardCallout.tsx",
  certificationPreviewPath: "references/shot-certification/shot_26_appGrid/preview.mp4",
  sourceReferencePath: "references/shot-certification/shot_26_appGrid",
  atomicMotionIds: [...shot26AtomicMotionIds],
};
