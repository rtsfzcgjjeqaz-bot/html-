import type { ShotLibraryEntry } from "./types";
import { shot71AtomicMotionIds } from "../shot/shot71-atomic-motions";

export const mobileQualityGovernanceStackLibraryEntry: ShotLibraryEntry = {
  libraryId: "mobile-quality-governance-stack",
  choreographyId: "mobileQualityGovernanceStack",
  sourceShotId: "shot_71",
  sceneType: "aiRecommendation",
  title: "Mobile Quality Governance Stack",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 213,
  actionBreakdownPath: "src/motion/shot_71/shot71-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_71/shot71-atomic-motions.ts",
  choreographyPath: "src/motion/shot_71/shot71-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/mobileQualityGovernanceStack.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_71/mobileQualityGovernanceStack.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-feishu-project/shot_71_aiRecommendation_120p6-127p67.mp4",
  atomicMotionIds: [...shot71AtomicMotionIds],
};
