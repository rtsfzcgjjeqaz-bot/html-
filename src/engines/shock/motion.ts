import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const hit = spring({ frame: frame % 45, fps, config: { damping: 7, stiffness: 260 } });
  const entrance = interpolate(frame, [0, 4], [1, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [62, 66], [1, 0.88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const impact = config.cameraMode === "impact_snap" ? hit : 0;

  return {
    cameraSystem: {
      x: Math.sin(frame * 0.38) * 10 * impact,
      y: Math.cos(frame * 0.5) * 7 * impact,
      zoom: 1 + impact * 0.095,
      rotate: impact * -1.8,
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: impact,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "smash_cut" ? interpolate(hit, [0, 1], [0, 2.2]) : 0,
      type: config.transitionType,
    },
  };
};
