import type { ShotLibraryEntry } from "./types";
import { shot88AtomicMotionIds } from "../atomic/shot88-atomic-motions";

export const aiPromptCardStackHookLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-prompt-card-stack-hook",
  choreographyId: "aiPromptCardStackHook",
  sourceShotId: "shot_88",
  sceneType: "coverHook",
  title: "AI Prompt Card Stack Hook",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 114,
  actionBreakdownPath: "library/mac-shot-library/shot_88/docs/action-breakdown.md",
  atomicMotionsPath: "library/mac-shot-library/shot_88/runtime/atomic/shot88-atomic-motions.ts",
  choreographyPath: "library/mac-shot-library/shot_88/runtime/choreography/aiPromptCardStackHook.tsx",
  executableChoreographyPath: "library/mac-shot-library/shot_88/runtime/choreography/aiPromptCardStackHook.tsx",
  certificationPreviewPath:
    "local-only: outputs/motion-catalog/review/shot_88/aiPromptCardStackHook.preview.mp4",
  sourceReferencePath:
    "local-only: references/extracted-shots/new-reference-ai-promo-ui/shot_88_coverHook_1p53-3p70.mp4",
  atomicMotionIds: [...shot88AtomicMotionIds],
};
