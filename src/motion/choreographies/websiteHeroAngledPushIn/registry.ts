import { websiteHeroAngledPushInTracks } from "./tracks";

export type WebsiteHeroAngledPushInChoreography = {
  choreographyId: "websiteHeroAngledPushIn";
  sceneType: "websiteHero";
  approved: true;
  allowedInFactory: true;
  durationSeconds: number;
  animationTracks: typeof websiteHeroAngledPushInTracks;
};

export const websiteHeroAngledPushIn: WebsiteHeroAngledPushInChoreography = {
  choreographyId: "websiteHeroAngledPushIn",
  sceneType: "websiteHero",
  approved: true,
  allowedInFactory: true,
  durationSeconds: 4.5,
  animationTracks: websiteHeroAngledPushInTracks,
};
