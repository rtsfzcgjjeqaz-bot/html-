import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const build = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const entrance = interpolate(frame, [0, 24], [0.88, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [56, 66], [1, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const locked = config.cameraMode === "locked_wide";

  return {
    cameraSystem: {
      x: locked ? 0 : Math.sin(frame / 60) * 20,
      y: locked ? 0 : Math.cos(frame / 60) * 10,
      zoom: 1 + build * 0.015,
      rotate: 0,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: interpolate(frame, [0, 60, 120, 180], [0, 1, 0.5, 1], { extrapolateRight: "clamp" }),
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "panel_swap" ? (1 - entrance) * 2 : 0,
      type: config.transitionType,
    },
  };
};
