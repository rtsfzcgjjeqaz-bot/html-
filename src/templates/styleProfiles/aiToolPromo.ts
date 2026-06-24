import type { StyleProfile } from "./defaultPromo";

export const aiToolPromo: StyleProfile = {
  profileId: "ai-tool-promo",
  preferredChoreographies: [
    "coverHookImpact",
    "websiteHeroAngledPushIn",
    "websiteHeroCenterStage",
    "websiteHeroFocusScan",
    "appGridCascade",
    "searchTypingThenRows",
    "aiRecommendationConnection",
    "priceInsightSnap",
    "stepFlowRail",
    "chartInsightReveal",
    "ctaCardsConverge",
    "finalCtaCardsConverge",
  ],
  forbiddenChoreographies: ["randomDecoration", "heavyOrbit", "glitchFlicker", "cyberpunkNeon"],
  preferredVisualStyle: ["clean", "premium", "browser", "ai", "data"],
  forbiddenVisualStyle: ["random", "glitch", "cyberpunk", "decorative-only"],
};
