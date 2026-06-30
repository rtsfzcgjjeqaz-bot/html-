import {
  SHOT_93_DURATION_FRAMES,
  Shot93NoMoreFormsDocumentStackChoreography,
} from "../runtime/choreography/noMoreFormsDocumentStack";

export const noMoreFormsDocumentStackRegistryEntry = {
  id: "noMoreFormsDocumentStack",
  libraryId: "no-more-forms-document-stack",
  sourceShotId: "shot_93",
  sceneType: "resultComparison",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_93_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_93/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_93/runtime/atomic/shot93-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_93/runtime/choreography/noMoreFormsDocumentStack.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_93/runtime/catalog-entry/no-more-forms-document-stack.library-entry.ts",
  Component: Shot93NoMoreFormsDocumentStackChoreography,
} as const;
