import type { ShotLibraryEntry } from "./types";
import { shot64AtomicMotionIds } from "../shot_64/shot64-atomic-motions";

export const bigNumberInvestmentImpactLibraryEntry: ShotLibraryEntry = {
  libraryId: "big-number-investment-impact",
  choreographyId: "bigNumberInvestmentImpact",
  sourceShotId: "shot_64",
  sceneType: "resultComparison",
  title: "Big Number Investment Impact",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 57,
  actionBreakdownPath: "src/motion/shot_64/shot64-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_64/shot64-atomic-motions.ts",
  choreographyPath: "src/motion/shot_64/shot64-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/bigNumberInvestmentImpact.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_64/bigNumberInvestmentImpact.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_64_resultComparison_80p13-82p0.mp4",
  atomicMotionIds: [...shot64AtomicMotionIds],
};
