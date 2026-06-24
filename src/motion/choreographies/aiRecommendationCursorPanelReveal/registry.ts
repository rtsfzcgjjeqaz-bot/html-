import { aiRecommendationCursorPanelRevealTracks } from "./tracks";

export type AiRecommendationCursorPanelRevealChoreography = {
  choreographyId: "aiRecommendationCursorPanelReveal";
  shotId: "shot_51";
  sceneType: "aiRecommendation";
  approved: true;
  allowedInFactory: true;
  durationFrames: {
    min: number;
    preferred: number;
    max: number;
  };
  animationTracks: typeof aiRecommendationCursorPanelRevealTracks;
};

export const aiRecommendationCursorPanelReveal: AiRecommendationCursorPanelRevealChoreography = {
  choreographyId: "aiRecommendationCursorPanelReveal",
  shotId: "shot_51",
  sceneType: "aiRecommendation",
  approved: true,
  allowedInFactory: true,
  durationFrames: {
    min: 132,
    preferred: 140,
    max: 150,
  },
  animationTracks: aiRecommendationCursorPanelRevealTracks,
};
