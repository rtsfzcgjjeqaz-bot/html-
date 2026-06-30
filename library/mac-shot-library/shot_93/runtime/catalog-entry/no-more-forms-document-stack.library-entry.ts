import type { ShotLibraryEntry } from "./types";
import { shot93AtomicMotionIds } from "../atomic/shot93-atomic-motions";

export const noMoreFormsDocumentStackLibraryEntry: ShotLibraryEntry = {
  libraryId: "no-more-forms-document-stack",
  choreographyId: "noMoreFormsDocumentStack",
  sourceShotId: "shot_93",
  sceneType: "resultComparison",
  title: "No More Forms Document Stack",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 75,
  actionBreakdownPath: "library/mac-shot-library/shot_93/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_93/runtime/atomic/shot93-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_93/runtime/choreography/noMoreFormsDocumentStack.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_93/runtime/choreography/noMoreFormsDocumentStack.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_93/noMoreFormsDocumentStack.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_93_resultComparison_14p00-16p37.mp4",
  atomicMotionIds: [...shot93AtomicMotionIds],
};
