import type { StyleProfile } from "./defaultPromo";

export const ecommerceProductPromo: StyleProfile = {
  profileId: "ecommerce-product-promo",
  preferredChoreographies: ["coverHookImpact", "productHeroSlideIn", "websiteHeroCenterStage", "priceInsightReveal", "priceInsightSnap", "resultComparisonCards", "ctaCardsConverge", "finalCtaCardsConverge"],
  forbiddenChoreographies: ["randomDecoration", "heavyOrbit", "glitchFlicker", "cyberpunkNeon"],
  preferredVisualStyle: ["clean", "product", "price", "conversion"],
  forbiddenVisualStyle: ["random", "glitch", "cyberpunk", "decorative-only"],
};
