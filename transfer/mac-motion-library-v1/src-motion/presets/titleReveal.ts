import { Easing, interpolate } from "remotion";
import { boundedProgressRange, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export const titleReveal = (
  args: MotionRange & {
    distanceY?: number;
    distanceX?: number;
    blurPx?: number;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const { frame, distanceY = 28, distanceX = -18, blurPx = 8, safeArea } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(progress, [0, 0.22, 1], [0, 1, 1]);
  const guardY = safeArea ? safeArea.top * 0.01 : 0;

  return {
    opacity,
    transform: `translate3d(${interpolate(progress, [0, 1], [distanceX, 0])}px, ${interpolate(progress, [0, 1], [distanceY + guardY, 0])}px, 220px)`,
    filter: `blur(${interpolate(progress, [0, 1], [blurPx, 0])}px)`,
  };
};
