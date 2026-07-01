import type { ShotLibraryEntry } from "./types";
import { shot101AtomicMotionIds } from "../atomic/shot101-atomic-motions";

export const saasRowStreamOverviewLibraryEntry: ShotLibraryEntry = {
  libraryId: "saas-row-stream-overview",
  choreographyId: "saasRowStreamOverview",
  sourceShotId: "shot_101",
  sceneType: "appGrid",
  title: "SaaS Row Stream Overview",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 97,
  actionBreakdownPath: "library/mac-shot-library/shot_101/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_101/runtime/atomic/shot101-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_101/runtime/choreography/saasRowStreamOverview.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_101/runtime/choreography/saasRowStreamOverview.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_101/saasRowStreamOverview.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-software-feature-clarity/shot_101_appGrid_3p30-6p53.mp4",
  atomicMotionIds: [...shot101AtomicMotionIds],
};
