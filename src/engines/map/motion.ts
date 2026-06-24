import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const pinDrop = spring({ frame, fps, config: { damping: 16, stiffness: 150 } });
  const entrance = interpolate(frame, [0, 18], [0.84, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [54, 66], [1, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mapPan = config.cameraMode === "pan_scan" ? interpolate(frame, [0, 66], [-72, 72], { extrapolateRight: "clamp" }) : 0;

  return {
    cameraSystem: {
      x: mapPan,
      y: Math.sin(frame / 28) * 18,
      zoom: 1.04 + pinDrop * 0.025,
      rotate: Math.sin(frame / 70) * 2.4,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: pinDrop,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "map_wipe" ? interpolate(frame, [0, 18], [2.5, 0], { extrapolateRight: "clamp" }) : 0,
      type: config.transitionType,
    },
  };
};
