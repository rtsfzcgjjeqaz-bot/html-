import { interpolate, spring } from "remotion";
import { boundedProgressRange, clampExtrapolate, type MotionRange, type MotionStyle } from "./types";

export const softSettle = (
  args: MotionRange & {
    amplitude?: number;
    damping?: number;
    mass?: number;
  },
): MotionStyle => {
  const { frame, fps, amplitude = 0.012, damping = 18, mass = 0.7 } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], clampExtrapolate);
  const springValue = spring({
    frame: Math.max(0, frame - args.startFrame),
    fps,
    config: { damping, mass, stiffness: 90 },
  });
  const scale = interpolate(progress, [0, 1], [1 + amplitude, 1], clampExtrapolate) * interpolate(springValue, [0, 1], [0.995, 1], clampExtrapolate);
  const y = interpolate(progress, [0, 1], [-4, 0], clampExtrapolate);

  return {
    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
  };
};
