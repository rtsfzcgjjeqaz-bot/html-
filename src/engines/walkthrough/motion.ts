import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const tap = spring({ frame: frame % 60, fps, config: { damping: 15, stiffness: 160 } });
  const entrance = interpolate(frame, [0, 18], [0.88, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [55, 66], [1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step = config.cameraMode === "step_focus" ? Math.floor(frame / 45) : 0;

  return {
    cameraSystem: {
      x: interpolate(step, [0, 1, 2, 3], [-44, -12, 18, 44], { extrapolateRight: "clamp" }),
      y: interpolate(step, [0, 1, 2, 3], [16, -10, 12, -8], { extrapolateRight: "clamp" }),
      zoom: 1.02 + tap * 0.025,
      rotate: 0,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: tap,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "step_slide" ? (1 - entrance) * 2 : 0,
      type: config.transitionType,
    },
  };
};
