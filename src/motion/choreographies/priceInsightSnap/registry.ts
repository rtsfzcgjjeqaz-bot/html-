import { priceInsightSnapTracks } from "./tracks";

export type PriceInsightSnapChoreography = {
  choreographyId: "priceInsightSnap";
  shotId: "shot_50";
  sceneType: "priceInsight";
  approved: false;
  allowedInFactory: false;
  durationSeconds: number;
  animationTracks: typeof priceInsightSnapTracks;
};

export const priceInsightSnap: PriceInsightSnapChoreography = {
  choreographyId: "priceInsightSnap",
  shotId: "shot_50",
  sceneType: "priceInsight",
  approved: false,
  allowedInFactory: false,
  durationSeconds: 4.4,
  animationTracks: priceInsightSnapTracks,
};
