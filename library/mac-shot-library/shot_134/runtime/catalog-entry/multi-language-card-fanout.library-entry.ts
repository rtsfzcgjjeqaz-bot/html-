import type { ShotLibraryEntry } from "./types";
import { shot134AtomicMotionIds } from "../atomic/shot134-atomic-motions";

export const multiLanguageCardFanoutLibraryEntry: ShotLibraryEntry = {
  libraryId: "multi-language-card-fanout",
  choreographyId: "multiLanguageCardFanout",
  sourceShotId: "shot_134",
  sceneType: "featureHighlight",
  title: "Multi Language Card Fanout",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 105,
  actionBreakdownPath: "src/motion/shot_134/shot134-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_134/shot134-atomic-motions.ts",
  choreographyPath: "src/motion/shot_134/shot134-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/multiLanguageCardFanout.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_134/multiLanguageCardFanout.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-langease-saas-ai/shot_134_featureHighlight_20p8-24p3.mp4",
  atomicMotionIds: [...shot134AtomicMotionIds],
};
