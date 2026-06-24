import { Easing, interpolate } from "remotion";
import { boundedProgressRange, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export const cameraPushIn = (
  args: MotionRange & {
    fromScale?: number;
    toScale?: number;
    distanceX?: number;
    distanceY?: number;
    rotateX?: number;
    rotateY?: number;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const {
    frame,
    fromScale = 0.965,
    toScale = 1.035,
    distanceX = 18,
    distanceY = 10,
    rotateX = 0,
    rotateY = -2,
    safeArea,
  } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  const x = interpolate(progress, [0, 1], [distanceX, 0]);
  const y = interpolate(progress, [0, 1], [distanceY, 0]);
  const guardX = safeArea ? Math.min(safeArea.left, safeArea.right) * 0.01 : 0;

  return {
    transform: `translate3d(${x + guardX}px, ${y}px, 80px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
  };
};
