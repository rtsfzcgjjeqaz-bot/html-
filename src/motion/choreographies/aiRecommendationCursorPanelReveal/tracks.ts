import { aiRecommendationCursorPanelRevealAtomicMotions } from "../../atomic/aiRecommendationCursorPanelReveal";

export type AiRecommendationCursorPanelRevealTrack = {
  trackId: string;
  motionId: (typeof aiRecommendationCursorPanelRevealAtomicMotions)[number];
  target: string;
  layer: "background" | "context" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const aiRecommendationCursorPanelRevealTracks: AiRecommendationCursorPanelRevealTrack[] = [
  {
    trackId: "track-aiBackdropFloat",
    motionId: "aiBackdropFloat",
    target: "aiBackdrop",
    layer: "background",
    startPercent: 0,
    endPercent: 100,
    role: "depth-establish",
    purpose: "Create the soft AI workspace atmosphere.",
  },
  {
    trackId: "track-cursorTriggerPanel",
    motionId: "cursorTriggerPanel",
    target: "recommendationCursor",
    layer: "context",
    startPercent: 18,
    endPercent: 74,
    role: "context-entry",
    purpose: "Move the cursor deliberately toward the recommendation trigger.",
  },
  {
    trackId: "track-aiPillPop",
    motionId: "aiPillPop",
    target: "aiPill",
    layer: "semantic",
    startPercent: 42,
    endPercent: 78,
    role: "message-hierarchy",
    purpose: "Introduce a compact AI label before the panel finishes landing.",
    semanticTarget: "aiRecommendation.pill",
  },
  {
    trackId: "track-aiCardSlideIn",
    motionId: "aiCardSlideIn",
    target: "recommendationPanel",
    layer: "semantic",
    startPercent: 56,
    endPercent: 84,
    role: "primary-evidence-entry",
    purpose: "Slide the recommendation panel into the main reading position.",
    semanticTarget: "aiRecommendation.panel",
  },
  {
    trackId: "track-aiRecommendationRowsReveal",
    motionId: "aiRecommendationRowsReveal",
    target: "recommendationRows",
    layer: "semantic",
    startPercent: 72,
    endPercent: 94,
    role: "supporting-value-proof",
    purpose: "Cascade evidence rows inside the recommendation panel.",
    semanticTarget: "aiRecommendation.rows",
  },
  {
    trackId: "track-aiRecommendationSettle",
    motionId: "aiRecommendationSettle",
    target: "fullComposition",
    layer: "camera",
    startPercent: 86,
    endPercent: 100,
    role: "readability-hold",
    purpose: "Settle the full AI recommendation composition for review.",
  },
];
