import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const smooth = spring({ frame, fps, config: { damping: 28, stiffness: 72 } });
  const entrance = interpolate(frame, [0, 30], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [56, 66], [1, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const minimalScale = config.density === "low" ? 0.045 : 0.02;

  return {
    cameraSystem: {
      x: 0,
      y: interpolate(frame, [0, 180], [18, -8], { extrapolateRight: "clamp" }),
      zoom: 1 + smooth * minimalScale,
      rotate: 0,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: interpolate(frame, [60, 100, 140], [0.2, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "soft_fade" ? (1 - entrance) * 3 : 0,
      type: config.transitionType,
    },
  };
};
