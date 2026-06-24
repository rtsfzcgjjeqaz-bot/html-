import type { StyleProfile } from "./defaultPromo";

export const saasProductPromo: StyleProfile = {
  profileId: "saas-product-promo",
  preferredChoreographies: ["coverHookImpact", "websiteHeroAngledPushIn", "websiteHeroCenterStage", "appGridCascade", "stepFlowCards", "stepFlowRail", "ctaCardsConverge", "finalCtaCardsConverge"],
  forbiddenChoreographies: ["randomDecoration", "heavyOrbit", "glitchFlicker", "cyberpunkNeon"],
  preferredVisualStyle: ["clean", "premium", "browser", "workflow"],
  forbiddenVisualStyle: ["random", "glitch", "cyberpunk", "decorative-only"],
};
