import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const tick = spring({ frame: frame % 30, fps, config: { damping: 12, stiffness: 180 } });
  const entrance = interpolate(frame, [0, 12], [0.86, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [56, 66], [1, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const follow = config.cameraMode === "feed_follow" ? interpolate(frame % 90, [0, 90], [36, -36]) : 0;

  return {
    cameraSystem: {
      x: 0,
      y: follow,
      zoom: 1.01 + tick * 0.018,
      rotate: Math.sin(frame / 24) * 0.7,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: tick,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "stream_cut" ? interpolate(frame % 30, [0, 3, 12], [1.8, 0, 0], { extrapolateRight: "clamp" }) : 0,
      type: config.transitionType,
    },
  };
};
