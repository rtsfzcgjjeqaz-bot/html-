import { aiToolPromo } from "../templates/styleProfiles/aiToolPromo";
import { defaultPromo, type StyleProfile } from "../templates/styleProfiles/defaultPromo";
import { ecommerceProductPromo } from "../templates/styleProfiles/ecommerceProductPromo";
import { saasProductPromo } from "../templates/styleProfiles/saasProductPromo";
import type { ChoreographyRegistryEntry, StyleProfileId } from "./choreographyTypes";

export const styleProfiles: Record<StyleProfileId, StyleProfile> = {
  "ai-tool-promo": aiToolPromo,
  "saas-product-promo": saasProductPromo,
  "ecommerce-product-promo": ecommerceProductPromo,
  "default-promo": defaultPromo,
};

export function normalizeStyleProfile(value?: string): StyleProfileId {
  if (value === "ai-tool-promo" || value === "saas-product-promo" || value === "ecommerce-product-promo") {
    return value;
  }
  return "default-promo";
}

export function getStyleProfile(profile: StyleProfileId) {
  return styleProfiles[profile] ?? defaultPromo;
}

export function isChoreographyAllowedByProfile(entry: ChoreographyRegistryEntry, profile: StyleProfileId) {
  const styleProfile = getStyleProfile(profile);
  if (styleProfile.forbiddenChoreographies.includes(entry.choreographyId)) return false;
  if (entry.visualStyle.some((style) => styleProfile.forbiddenVisualStyle.includes(style))) return false;
  return entry.compatibleProfiles.includes(profile);
}

export function profilePreferenceScore(entry: ChoreographyRegistryEntry, profile: StyleProfileId) {
  const styleProfile = getStyleProfile(profile);
  const choreographyScore = styleProfile.preferredChoreographies.includes(entry.choreographyId) ? 100 : 0;
  const visualScore = entry.visualStyle.filter((style) => styleProfile.preferredVisualStyle.includes(style)).length * 8;
  const riskScore = entry.riskLevel === "low" ? 10 : entry.riskLevel === "medium" ? 4 : -8;
  return choreographyScore + visualScore + riskScore;
}
