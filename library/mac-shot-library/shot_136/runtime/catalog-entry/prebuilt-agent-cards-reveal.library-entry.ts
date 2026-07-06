import type { ShotLibraryEntry } from "./types";
import { shot136AtomicMotionIds } from "../atomic/shot136-atomic-motions";

export const prebuiltAgentCardsRevealLibraryEntry: ShotLibraryEntry = {
  libraryId: "prebuilt-agent-cards-reveal",
  choreographyId: "prebuiltAgentCardsReveal",
  sourceShotId: "shot_136",
  sceneType: "coverHook",
  title: "Prebuilt Agent Cards Reveal",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 140,
  actionBreakdownPath: "src/motion/shot_136/shot136-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_136/shot136-atomic-motions.ts",
  choreographyPath: "src/motion/shot_136/shot136-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/prebuiltAgentCardsReveal.tsx",
  certificationPreviewPath:
    "outputs/motion-catalog/review/shot_136/prebuiltAgentCardsReveal.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_136_coverHook_0-4p6.mp4",
  atomicMotionIds: [...shot136AtomicMotionIds],
};
