export const alignmentRules = {
  safeArea: { left: 140, right: 140, top: 90, bottom: 90 },
  gridGap: { small: 18, medium: 26, large: 34 },
  card: { minWidth: 170, minHeight: 104, radius: 20 },
  text: { maxLines: 2, minGapFromPrimary: 40 },
  balance: { maxCenterDistance: 520, minOccupiedSafeAreaRatio: 0.34 },
} as const;
