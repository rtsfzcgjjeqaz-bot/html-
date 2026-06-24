import { websiteHeroCenterStageTracks } from "./tracks";

export type WebsiteHeroCenterStageChoreography = {
  choreographyId: "websiteHeroCenterStage";
  shotId: "shot_37";
  sceneType: "websiteHero";
  approved: false;
  allowedInFactory: false;
  durationSeconds: number;
  animationTracks: typeof websiteHeroCenterStageTracks;
};

export const websiteHeroCenterStage: WebsiteHeroCenterStageChoreography = {
  choreographyId: "websiteHeroCenterStage",
  shotId: "shot_37",
  sceneType: "websiteHero",
  approved: false,
  allowedInFactory: false,
  durationSeconds: 4.2,
  animationTracks: websiteHeroCenterStageTracks,
};
