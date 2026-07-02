import {
  SHOT_113_DURATION_FRAMES,
  Shot113AttachmentCaptureFocusChoreography,
} from "../runtime/choreography/attachmentCaptureFocus";

export const attachmentCaptureFocusRegistryEntry = {
  id: "attachmentCaptureFocus",
  libraryId: "attachment-capture-focus",
  sourceShotId: "shot_113",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_113_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_113/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_113/runtime/atomic/shot113-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_113/runtime/choreography/attachmentCaptureFocus.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_113/runtime/catalog-entry/attachment-capture-focus.library-entry.ts",
  Component: Shot113AttachmentCaptureFocusChoreography,
} as const;
