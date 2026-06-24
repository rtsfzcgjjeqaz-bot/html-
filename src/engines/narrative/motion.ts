import { interpolate, spring } from "remotion";
import type { EngineMotionSystem } from "../../core/motionLayerTypes";
import { config } from "./config";

export const getMotion = (frame: number, fps: number): EngineMotionSystem => {
  const page = spring({ frame, fps, config: { damping: 22, stiffness: 88 } });
  const entrance = interpolate(frame, [0, 26], [0.88, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [55, 66], [1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dolly = config.cameraMode === "story_dolly" ? interpolate(frame, [0, 66], [-34, 24], { extrapolateRight: "clamp" }) : 0;

  return {
    cameraSystem: {
      x: dolly,
      y: Math.sin(frame / 55) * 8,
      zoom: 1.015 + page * 0.035,
      rotate: interpolate(frame, [0, 180], [-1.5, 1.5], { extrapolateRight: "clamp" }),
    },
    animationSystem: {
      entrance,
      exit,
      emphasis: page,
    },
    transitionSystem: {
      opacity: entrance * exit,
      blur: config.transitionType === "page_turn" ? (1 - entrance) * 2 : 0,
      type: config.transitionType,
    },
  };
};
