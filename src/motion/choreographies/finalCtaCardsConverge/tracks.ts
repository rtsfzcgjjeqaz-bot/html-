import { finalCtaCardsConvergeAtomicMotions } from "../../atomic/finalCtaCardsConverge";
export type FinalCtaCardsConvergeTrack = { trackId: string; motionId: (typeof finalCtaCardsConvergeAtomicMotions)[number]; target: string; layer: "background" | "semantic" | "title" | "cta" | "camera"; startPercent: number; endPercent: number; role: string; purpose: string; semanticTarget?: string };
export const finalCtaCardsConvergeTracks: FinalCtaCardsConvergeTrack[] = [
  { trackId: "track-ctaBackdropGlow", motionId: "ctaBackdropGlow", target: "ctaBackdrop", layer: "background", startPercent: 0, endPercent: 100, role: "depth-establish", purpose: "Create a clean final CTA stage." },
  { trackId: "track-ctaCardsConverge", motionId: "ctaCardsConverge", target: "ctaCards", layer: "semantic", startPercent: 6, endPercent: 36, role: "final-card-build", purpose: "Converge supporting cards toward the CTA.", semanticTarget: "finalCTA.cards" },
  { trackId: "track-finalTitleReveal", motionId: "finalTitleReveal", target: "finalTitle", layer: "title", startPercent: 28, endPercent: 56, role: "message-hierarchy", purpose: "Reveal the final CTA headline.", semanticTarget: "finalCTA.title" },
  { trackId: "track-primaryButtonPop", motionId: "primaryButtonPop", target: "primaryButton", layer: "cta", startPercent: 48, endPercent: 72, role: "conversion-emphasis", purpose: "Pop the primary CTA button once.", semanticTarget: "finalCTA.primaryButton" },
  { trackId: "track-proofChipsOrbitIn", motionId: "proofChipsOrbitIn", target: "proofChips", layer: "semantic", startPercent: 62, endPercent: 84, role: "supporting-proof", purpose: "Bring proof chips into stable positions.", semanticTarget: "finalCTA.proofChips" },
  { trackId: "track-finalCtaSettle", motionId: "finalCtaSettle", target: "fullComposition", layer: "camera", startPercent: 84, endPercent: 100, role: "readability-hold", purpose: "Hold the final CTA for readability." },
];
