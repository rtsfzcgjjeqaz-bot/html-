import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot139MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot139Ease = ({ frame, startFrame, endFrame }: Shot139MotionArgs) =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot139AtomicMotions: AtomicMotion[] = [
  { id: "centralAiOrbBloom", label: "Central AI Orb Bloom", frameRange: [0, 22], purpose: "Introduce the central AI hub with glow and scale.", reusable: true, reviewRisk: "Glow should not wash out the text." },
  { id: "providerLogoOrbit", label: "Provider Logo Orbit", frameRange: [10, 44], purpose: "Bring surrounding provider nodes into an orbital network.", reusable: true, reviewRisk: "Orbit spacing must stay readable." },
  { id: "integrationNodeSettle", label: "Integration Node Settle", frameRange: [26, 58], purpose: "Settle supporting nodes and connection cues around the hub.", reusable: true, reviewRisk: "Nodes should not feel random." },
  { id: "featuredProviderPulse", label: "Featured Provider Pulse", frameRange: [38, 62], purpose: "Lightly emphasize one selected provider/integration node.", reusable: true, reviewRisk: "Pulse must stay subtle and product-like." },
  { id: "hubHold", label: "Hub Hold", frameRange: [58, 71], purpose: "Hold the final ecosystem state for reading.", reusable: true, reviewRisk: "Avoid late drift or orbit wobble." },
];

export const shot139AtomicMotionIds = shot139AtomicMotions.map((motion) => motion.id);

export const shot139MotionPackageStatus = {
  shotId: "shot_139",
  libraryId: "ai-provider-ecosystem-orbit",
  choreographyId: "aiProviderEcosystemOrbit",
  sceneType: "aiRecommendation",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

