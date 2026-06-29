import type { ShotLibraryEntry } from "./types";
import { shot44AtomicMotionIds } from "../atomic/shot44-atomic-motions";

export const dualDeviceFeatureStageLibraryEntry: ShotLibraryEntry = {
  libraryId: "dual-device-feature-stage",
  choreographyId: "dualDeviceFeatureStage",
  sourceShotId: "shot_44",
  sceneType: "featureHighlight",
  title: "Dual Device Feature Stage",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 126,
  actionBreakdownPath: "src/motion/shot_44/shot44-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_44/shot44-atomic-motions.ts",
  choreographyPath: "src/motion/shot_44/shot44-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/dualDeviceFeatureStage.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_44/dualDeviceFeatureStage.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-software/shot_44_featureHighlight_65p70-69p90.mp4",
  atomicMotionIds: [...shot44AtomicMotionIds],
};
