import type { ShotLibraryEntry } from "./types";

export const agentBuilderPanelFocusLibraryEntry: ShotLibraryEntry = {
  libraryId: "agent-builder-panel-focus",
  choreographyId: "agentBuilderPanelFocus",
  sourceShotId: "shot_138",
  sceneType: "appGrid",
  title: "Agent Builder Panel Focus",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 74,
  actionBreakdownPath: "src/motion/shot_138/shot138-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_138/shot138-atomic-motions.ts",
  choreographyPath: "src/motion/shot_138/shot138-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/agentBuilderPanelFocus.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_138/agentBuilderPanelFocus.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_138_appGrid_7p4-9p8.mp4",
  atomicMotionIds: ["builderPanelSlide", "configRowHighlight", "sideCardStackIn", "selectedControlLift", "cameraFocusSettle"],
};
