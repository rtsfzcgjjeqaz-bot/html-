import { splitCompareCardsAtomicMotions } from "../../atomic/splitCompareCards";

export type SplitCompareCardsTrack = {
  trackId: string;
  motionId: (typeof splitCompareCardsAtomicMotions)[number];
  target: string;
  layer: "background" | "comparison" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const splitCompareCardsTracks: SplitCompareCardsTrack[] = [
  {
    trackId: "track-comparisonBackdropDrift",
    motionId: "comparisonBackdropDrift",
    target: "comparisonBackdrop",
    layer: "background",
    startPercent: 0,
    endPercent: 100,
    role: "depth-establish",
    purpose: "Create subtle spatial motion behind the comparison panels.",
  },
  {
    trackId: "track-splitPanelsReveal",
    motionId: "splitPanelsReveal",
    target: "splitPanels",
    layer: "comparison",
    startPercent: 8,
    endPercent: 34,
    role: "comparison-frame-entry",
    purpose: "Reveal the two comparison surfaces as the primary layout.",
    semanticTarget: "comparison.panels",
  },
  {
    trackId: "track-leftResultSlide",
    motionId: "leftResultSlide",
    target: "leftResult",
    layer: "comparison",
    startPercent: 18,
    endPercent: 46,
    role: "baseline-result",
    purpose: "Slide in the baseline or before state.",
    semanticTarget: "comparison.before",
  },
  {
    trackId: "track-rightResultSlide",
    motionId: "rightResultSlide",
    target: "rightResult",
    layer: "comparison",
    startPercent: 24,
    endPercent: 52,
    role: "improved-result",
    purpose: "Slide in the improved or after state.",
    semanticTarget: "comparison.after",
  },
  {
    trackId: "track-comparisonDividerSweep",
    motionId: "comparisonDividerSweep",
    target: "comparisonDivider",
    layer: "semantic",
    startPercent: 42,
    endPercent: 60,
    role: "contrast-boundary",
    purpose: "Draw the visual boundary between the compared results.",
    semanticTarget: "comparison.boundary",
  },
  {
    trackId: "track-winnerCardLift",
    motionId: "winnerCardLift",
    target: "winnerCard",
    layer: "semantic",
    startPercent: 58,
    endPercent: 82,
    role: "recommendation-proof",
    purpose: "Lift the winning result without overusing decorative badges.",
    semanticTarget: "comparison.winner",
  },
  {
    trackId: "track-comparisonSettle",
    motionId: "comparisonSettle",
    target: "fullComposition",
    layer: "camera",
    startPercent: 82,
    endPercent: 100,
    role: "readability-hold",
    purpose: "Settle the comparison for review and handoff.",
  },
];
