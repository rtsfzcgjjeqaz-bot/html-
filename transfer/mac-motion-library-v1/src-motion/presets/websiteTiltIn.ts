import { Easing, interpolate } from "remotion";
import { boundedProgressRange, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export const websiteTiltIn = (
  args: MotionRange & {
    distanceX?: number;
    distanceY?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    initialScale?: number;
    finalScale?: number;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const {
    frame,
    distanceX = 72,
    distanceY = 34,
    rotateX = 3,
    rotateY = -10,
    rotateZ = -2,
    initialScale = 0.92,
    finalScale = 1,
    safeArea,
  } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(progress, [0, 0.18, 1], [0, 1, 1]);
  const x = interpolate(progress, [0, 1], [distanceX, 0]);
  const y = interpolate(progress, [0, 1], [distanceY, 0]);
  const scale = interpolate(progress, [0, 1], [initialScale, finalScale]);
  const safeOffset = safeArea ? Math.max(0, safeArea.left - 96) * 0.02 : 0;

  return {
    opacity,
    transform: `translate3d(${x + safeOffset}px, ${y}px, 120px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
    filter: `blur(${interpolate(progress, [0, 1], [8, 0])}px)`,
  };
};
