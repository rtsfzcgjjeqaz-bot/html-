import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const depth = spring({ frame, fps, config: { damping: 24, stiffness: 94 } });
  const entrance = interpolate(frame, [0, 22], [0.86, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [54, 66], [1, 0.76], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbit = config.cameraMode === "orbit_depth" ? 1 : 0;

  return {
    cameraSystem: {
      x: Math.cos(frame / 34) * 54 * orbit,
      y: Math.sin(frame / 40) * 30 * orbit,
      zoom: 1.06 + depth * 0.035,
      rotate: Math.sin(frame / 54) * 3.5 * orbit,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: depth,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "zoom_tunnel" ? interpolate(frame, [0, 24], [2.5, 0], { extrapolateRight: "clamp" }) : 0,
      type: config.transitionType,
    },
  };
};
