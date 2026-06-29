import type { ShotLibraryEntry } from "./types";
import { shot76AtomicMotionIds } from "../atomic/shot76-atomic-motions";

export const darkAssistantDeviceHeroLibraryEntry: ShotLibraryEntry = {
  libraryId: "dark-assistant-device-hero",
  choreographyId: "darkAssistantDeviceHero",
  sourceShotId: "shot_76",
  sceneType: "websiteHero",
  title: "Dark Assistant Device Hero",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 85,
  actionBreakdownPath: "src/motion/shot_76/shot76-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_76/shot76-atomic-motions.ts",
  choreographyPath: "src/motion/shot_76/shot76-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/darkAssistantDeviceHero.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_76/darkAssistantDeviceHero.preview.mp4",
  sourceReferencePath:
    "references/extracted-shots/new-reference-ai-interaction/shot_76_websiteHero_1p45-4p3.mp4",
  atomicMotionIds: [...shot76AtomicMotionIds],
};
