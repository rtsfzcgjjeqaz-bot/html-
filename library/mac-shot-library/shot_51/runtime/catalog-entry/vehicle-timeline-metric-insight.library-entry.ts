import type { ShotLibraryEntry } from "./types";
import { shot51AtomicMotionIds } from "../shot_51/shot51-atomic-motions";

export const vehicleTimelineMetricInsightLibraryEntry: ShotLibraryEntry = {
  libraryId: "vehicle-timeline-metric-insight",
  choreographyId: "vehicleTimelineMetricInsight",
  sourceShotId: "shot_51",
  sceneType: "priceInsight",
  title: "Vehicle Timeline Metric Insight",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 102,
  actionBreakdownPath: "src/motion/shot_51/shot51-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_51/shot51-atomic-motions.ts",
  choreographyPath: "src/motion/shot_51/shot51-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/vehicleTimelineMetricInsight.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_51/vehicleTimelineMetricInsight.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_51_priceInsight_21p3-24p67.mp4",
  atomicMotionIds: [...shot51AtomicMotionIds],
};
