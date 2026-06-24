import { Easing, interpolate } from "remotion";
import { boundedProgressRange, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export const featureCardReveal = (
  args: MotionRange & {
    index?: number;
    staggerFrames?: number;
    distanceY?: number;
    distanceX?: number;
    initialScale?: number;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const {
    frame,
    index = 0,
    staggerFrames = 5,
    distanceY = 34,
    distanceX = 14,
    initialScale = 0.96,
    safeArea,
  } = args;
  const startFrame = args.startFrame + index * staggerFrames;
  const endFrame = args.endFrame + index * staggerFrames;
  const progress = interpolate(frame, boundedProgressRange({ startFrame, endFrame }), [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(progress, [0, 0.24, 1], [0, 1, 1]);
  const guardX = safeArea ? safeArea.right * 0.01 : 0;

  return {
    opacity,
    transform: `translate3d(${interpolate(progress, [0, 1], [distanceX + guardX, 0])}px, ${interpolate(progress, [0, 1], [distanceY, 0])}px, ${140 + index * 12}px) scale(${interpolate(progress, [0, 1], [initialScale, 1])})`,
  };
};
