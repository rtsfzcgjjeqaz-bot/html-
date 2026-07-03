import type { ShotLibraryEntry } from "./types";
import { shot114AtomicMotionIds } from "../shot_114/shot114-atomic-motions";

export const documentActionPanelRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "document-action-panel-reveal",
  choreographyId: "documentActionPanelReveal",
  sourceShotId: "shot_114",
  sceneType: "featureHighlight",
  title: "Document Action Panel Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 78,
  actionBreakdownPath: "src/motion/shot_114/shot114-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_114/shot114-atomic-motions.ts",
  choreographyPath: "src/motion/shot_114/shot114-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/documentActionPanelReveal.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_114/documentActionPanelReveal.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-saas-agent-mainstream/shot_114_featureHighlight_5p80-8p40.mp4",
  atomicMotionIds: [...shot114AtomicMotionIds],
};
