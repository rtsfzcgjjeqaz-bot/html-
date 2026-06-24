export const canvas = {
  width: 1920,
  height: 1080,
} as const;

export const safeArea = {
  left: 140,
  right: 140,
  top: 90,
  bottom: 90,
  titleMaxWidth: 760,
  bodyMaxWidth: 680,
  cardMaxWidth: 760,
} as const;

export const safeBounds = {
  x: safeArea.left,
  y: safeArea.top,
  width: canvas.width - safeArea.left - safeArea.right,
  height: canvas.height - safeArea.top - safeArea.bottom,
} as const;

export type Region = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function isRegionInsideSafeArea(region?: Region) {
  if (!region) return false;
  return (
    region.x >= safeArea.left &&
    region.y >= safeArea.top &&
    region.x + region.width <= canvas.width - safeArea.right &&
    region.y + region.height <= canvas.height - safeArea.bottom
  );
}
