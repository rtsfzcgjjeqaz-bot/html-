import {
  SHOT_55_DURATION_FRAMES,
  Shot55AiRequirementComposerChoreography,
} from "../runtime/choreography/aiRequirementComposer";

export const aiRequirementComposerRegistryEntry = {
  id: "aiRequirementComposer",
  libraryId: "ai-requirement-composer",
  sourceShotId: "shot_55",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_55_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_55/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_55/runtime/atomic/shot55-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_55/runtime/choreography/aiRequirementComposer.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_55/runtime/catalog-entry/ai-requirement-composer.library-entry.ts",
  Component: Shot55AiRequirementComposerChoreography,
} as const;
