import { splitCompareCardsTracks } from "./tracks";

export type SplitCompareCardsChoreography = {
  choreographyId: "splitCompareCards";
  shotId: "shot_27";
  sceneType: "resultComparison";
  approved: true;
  allowedInFactory: true;
  durationSeconds: number;
  animationTracks: typeof splitCompareCardsTracks;
};

export const splitCompareCards: SplitCompareCardsChoreography = {
  choreographyId: "splitCompareCards",
  shotId: "shot_27",
  sceneType: "resultComparison",
  approved: true,
  allowedInFactory: true,
  durationSeconds: 4.8,
  animationTracks: splitCompareCardsTracks,
};
