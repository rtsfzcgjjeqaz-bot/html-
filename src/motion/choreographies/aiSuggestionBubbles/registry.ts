import { aiSuggestionBubblesTracks } from "./tracks";

export type AiSuggestionBubblesChoreography = {
  choreographyId: "aiSuggestionBubbles";
  shotId: "shot_28";
  sceneType: "aiRecommendation";
  approved: false;
  allowedInFactory: false;
  durationSeconds: number;
  animationTracks: typeof aiSuggestionBubblesTracks;
};

export const aiSuggestionBubbles: AiSuggestionBubblesChoreography = {
  choreographyId: "aiSuggestionBubbles",
  shotId: "shot_28",
  sceneType: "aiRecommendation",
  approved: false,
  allowedInFactory: false,
  durationSeconds: 4.8,
  animationTracks: aiSuggestionBubblesTracks,
};
