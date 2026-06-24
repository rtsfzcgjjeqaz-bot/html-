import type { StyleProfileId } from "../../motion/choreographyTypes";

export type StyleProfile = {
  profileId: StyleProfileId;
  preferredChoreographies: string[];
  forbiddenChoreographies: string[];
  preferredVisualStyle: string[];
  forbiddenVisualStyle: string[];
};

export const defaultPromo: StyleProfile = {
  profileId: "default-promo",
  preferredChoreographies: ["websiteHeroAngledPushIn"],
  forbiddenChoreographies: ["randomDecoration", "heavyOrbit", "glitchFlicker", "cyberpunkNeon"],
  preferredVisualStyle: ["clean", "premium", "browser"],
  forbiddenVisualStyle: ["random", "glitch", "cyberpunk", "decorative-only"],
};
