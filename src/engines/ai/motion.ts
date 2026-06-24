import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const scan = spring({ frame, fps, config: { damping: 18, stiffness: 132 } });
  const entrance = interpolate(frame, [0, 20], [0.86, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [55, 66], [1, 0.76], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const push = config.cameraMode === "analysis_push" ? interpolate(frame, [0, 66], [34, -24], { extrapolateRight: "clamp" }) : 0;

  return {
    cameraSystem: {
      x: Math.sin(frame / 46) * 12,
      y: push,
      zoom: 1.02 + scan * 0.055,
      rotate: 0,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: interpolate(frame % 54, [0, 18, 54], [0, 1, 0]),
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "logic_morph" ? Math.abs(Math.sin(frame / 18)) * 1.4 : 0,
      type: config.transitionType,
    },
  };
};
