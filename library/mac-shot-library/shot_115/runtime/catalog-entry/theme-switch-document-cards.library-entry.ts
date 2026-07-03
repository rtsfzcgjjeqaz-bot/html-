import type { ShotLibraryEntry } from "./types";
import { shot115AtomicMotionIds } from "../shot_115/shot115-atomic-motions";

export const themeSwitchDocumentCardsLibraryEntry: ShotLibraryEntry = {
  libraryId: "theme-switch-document-cards",
  choreographyId: "themeSwitchDocumentCards",
  sourceShotId: "shot_115",
  sceneType: "featureHighlight",
  title: "Theme Switch Document Cards",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 78,
  actionBreakdownPath: "src/motion/shot_115/shot115-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_115/shot115-atomic-motions.ts",
  choreographyPath: "src/motion/shot_115/shot115-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/themeSwitchDocumentCards.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_115/themeSwitchDocumentCards.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_115_featureHighlight_8p40-11p00.mp4",
  atomicMotionIds: [...shot115AtomicMotionIds],
};
