import { interpolate } from "remotion";
import { colors, layout } from "../../remotion/styles/tokens";
import { boundedProgressRange, clampExtrapolate, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export const backgroundParallax = (
  args: MotionRange & {
    depth?: number;
    distanceX?: number;
    distanceY?: number;
    opacityFrom?: number;
    opacityTo?: number;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const {
    frame,
    depth = -160,
    distanceX = 22,
    distanceY = -10,
    opacityFrom = 0.72,
    opacityTo = 1,
    safeArea = { left: layout.safeX, right: layout.safeX, top: layout.safeY, bottom: layout.safeY },
  } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], clampExtrapolate);
  const x = interpolate(progress, [0, 1], [-distanceX, distanceX], clampExtrapolate);
  const y = interpolate(progress, [0, 1], [distanceY, -distanceY], clampExtrapolate);
  const opacity = interpolate(progress, [0, 1], [opacityFrom, opacityTo], clampExtrapolate);

  return {
    opacity,
    transform: `translate3d(${x + safeArea.left * 0.02}px, ${y - safeArea.top * 0.01}px, ${depth}px)`,
    filter: `drop-shadow(0 28px 90px ${colors.shadowSoft})`,
  };
};
