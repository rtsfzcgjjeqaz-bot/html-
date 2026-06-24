import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const burst = spring({ frame, fps, config: { damping: 9, stiffness: 210 } });
  const shake = config.cameraMode === "shake_zoom" ? 1 : 0;
  const entrance = interpolate(frame, [0, 14], [0.82, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [54, 66], [1, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return {
    cameraSystem: {
      x: Math.sin(frame * 0.72) * 20 * shake,
      y: Math.cos(frame * 0.91) * 14 * shake,
      zoom: 1 + burst * 0.08 + Math.sin(frame * 0.2) * 0.025,
      rotate: Math.sin(frame * 0.3) * 1.2 * shake,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: burst,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "flash_cut" ? interpolate(frame % 45, [0, 5, 12], [2, 0, 0], { extrapolateRight: "clamp" }) : 0,
      type: config.transitionType,
    },
  };
};
