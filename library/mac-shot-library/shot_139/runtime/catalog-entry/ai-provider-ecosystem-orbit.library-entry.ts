import type { ShotLibraryEntry } from "./types";

export const aiProviderEcosystemOrbitLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-provider-ecosystem-orbit",
  choreographyId: "aiProviderEcosystemOrbit",
  sourceShotId: "shot_139",
  sceneType: "aiRecommendation",
  title: "AI Provider Ecosystem Orbit",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 71,
  actionBreakdownPath: "src/motion/shot_139/shot139-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_139/shot139-atomic-motions.ts",
  choreographyPath: "src/motion/shot_139/shot139-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/aiProviderEcosystemOrbit.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_139/aiProviderEcosystemOrbit.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_139_aiRecommendation_9p8-12.mp4",
  atomicMotionIds: ["centralAiOrbBloom", "providerLogoOrbit", "integrationNodeSettle", "featuredProviderPulse", "hubHold"],
};
