import type {ShotLibraryEntry} from "./types";
import {shot156AtomicMotionIds} from "../shot_156/shot156-atomic-motions";

export const multimodalPromptExploreBarLibraryEntry: ShotLibraryEntry = {
  libraryId: "multimodal-prompt-explore-bar",
  choreographyId: "multimodalPromptExploreBar",
  sourceShotId: "shot_156",
  sceneType: "searchDemo",
  title: "Multimodal Prompt Explore Bar",
  approved: false,
  allowedInFactory: false,
  implementationVerified: true,
  durationFrames: 117,
  actionBreakdownPath: "src/motion/shot_156/shot156-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_156/shot156-atomic-motions.ts",
  choreographyPath: "src/motion/shot_156/shot156-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/multimodalPromptExploreBar.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_156/multimodalPromptExploreBar.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-gemini-era-launch/shot_156_searchDemo_2p73-6p60.mp4",
  atomicMotionIds: [...shot156AtomicMotionIds],
};
