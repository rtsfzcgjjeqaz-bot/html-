import { aiSuggestionBubblesAtomicMotions } from "../../atomic/aiSuggestionBubbles";

export type AiSuggestionBubblesTrack = {
  trackId: string;
  motionId: (typeof aiSuggestionBubblesAtomicMotions)[number];
  target: string;
  layer: "background" | "context" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const aiSuggestionBubblesTracks: AiSuggestionBubblesTrack[] = [
  { trackId: "track-aiBackdropFloat", motionId: "aiBackdropFloat", target: "aiBackdrop", layer: "background", startPercent: 0, endPercent: 100, role: "depth-establish", purpose: "Create a soft AI suggestion stage." },
  { trackId: "track-contextPanelReveal", motionId: "contextPanelReveal", target: "contextPanel", layer: "context", startPercent: 8, endPercent: 34, role: "context-entry", purpose: "Reveal the source context panel.", semanticTarget: "ai.context" },
  { trackId: "track-suggestionBubbleFloat", motionId: "suggestionBubbleFloat", target: "suggestionBubbles", layer: "semantic", startPercent: 28, endPercent: 74, role: "ai-suggestion-build", purpose: "Float AI suggestion bubbles in a readable sequence.", semanticTarget: "ai.suggestions" },
  { trackId: "track-connectionLineDraw", motionId: "connectionLineDraw", target: "connectionLine", layer: "semantic", startPercent: 48, endPercent: 70, role: "reasoning-connection", purpose: "Connect context to generated suggestions.", semanticTarget: "ai.reasoningConnection" },
  { trackId: "track-recommendationEmphasis", motionId: "recommendationEmphasis", target: "recommendationCard", layer: "semantic", startPercent: 66, endPercent: 86, role: "recommendation-proof", purpose: "Emphasize the selected recommendation.", semanticTarget: "ai.recommendation" },
  { trackId: "track-aiSuggestionSettle", motionId: "aiSuggestionSettle", target: "fullComposition", layer: "camera", startPercent: 86, endPercent: 100, role: "readability-hold", purpose: "Settle the AI suggestion composition for review." },
];
