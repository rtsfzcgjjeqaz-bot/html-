import {
  SHOT_36_DURATION_FRAMES,
  Shot36EmailDraftGenerationDemoChoreography,
} from "../runtime/choreography/emailDraftGenerationDemo";

export const emailDraftGenerationDemoRegistryEntry = {
  id: "emailDraftGenerationDemo",
  libraryId: "email-draft-generation-demo",
  sourceShotId: "shot_36",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_36_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_36/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_36/runtime/atomic/shot36-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_36/runtime/choreography/emailDraftGenerationDemo.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_36/runtime/catalog-entry/email-draft-generation-demo.library-entry.ts",
  Component: Shot36EmailDraftGenerationDemoChoreography,
} as const;
