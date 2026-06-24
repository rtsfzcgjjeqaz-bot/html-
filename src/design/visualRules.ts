export const semanticRoles = [
  "connector",
  "focusMarker",
  "highlightBox",
  "stepLine",
  "chartGuide",
  "priceDeltaArrow",
] as const;

export type SemanticRole = (typeof semanticRoles)[number];

export const visualRules = {
  maxSemanticShapesPerScene: 2,
  maxScreenshotUsesPerVideo: 1,
  minScenesPerVideo: 8,
  maxTextLinesPerScene: 2,
  maxWordsPerTextLine: 8,
  minAnimationEventsPerScene: 3,
  minPrimaryVisualArea: 260000,
  minOccupiedSafeAreaRatio: 0.34,
  minSceneComponents: 2,
} as const;

export function isSemanticRole(value: unknown): value is SemanticRole {
  return typeof value === "string" && (semanticRoles as readonly string[]).includes(value);
}
