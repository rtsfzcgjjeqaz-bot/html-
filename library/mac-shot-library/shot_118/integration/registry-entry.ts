import {
  SHOT_118_DURATION_FRAMES,
  Shot118AgentCommandBoardShowcaseChoreography,
} from "../runtime/choreography/agentCommandBoardShowcase";

export const agentCommandBoardShowcaseRegistryEntry = {
  id: "agentCommandBoardShowcase",
  libraryId: "agent-command-board-showcase",
  sourceShotId: "shot_118",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
  durationInFrames: SHOT_118_DURATION_FRAMES,
  actionBreakdownPath: "library/mac-shot-library/shot_118/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_118/runtime/atomic/shot118-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_118/runtime/choreography/agentCommandBoardShowcase.tsx",
  catalogEntryPath: "library/mac-shot-library/shot_118/runtime/catalog-entry/agent-command-board-showcase.library-entry.ts",
  Component: Shot118AgentCommandBoardShowcaseChoreography,
} as const;
