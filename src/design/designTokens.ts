import { colors as baseColors } from "./colorSystem";

export const colors = {
  ...baseColors,
  surface: baseColors.card,
  line: baseColors.border,
  bgA: baseColors.background,
  bgB: baseColors.backgroundAlt,
  bgC: "#F5F7EB",
} as const;

export { canvas, isRegionInsideSafeArea, safeArea, safeBounds, type Region } from "./layoutSafeArea";
export { typography, type TypographyRole } from "./typography";
export { isSemanticRole, semanticRoles, visualRules, type SemanticRole } from "./visualRules";

export const layout = {
  radiusLg: 30,
  radiusMd: 20,
  shadow: "0 32px 90px rgba(15,23,42,0.12)",
  subtleShadow: "0 18px 60px rgba(15,23,42,0.09)",
} as const;
