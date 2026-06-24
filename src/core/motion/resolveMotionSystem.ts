import { interpolate } from "remotion";
import type { EngineConfig } from "../config/types";
import type { MotionSystem } from "./types";

const cameraByMode = (cameraMode: string, frame: number): MotionSystem["cameraSystem"] => {
  switch (cameraMode) {
    case "shake_zoom":
      return {
        x: Math.sin(frame * 0.85) * 18,
        y: Math.cos(frame * 0.7) * 12,
        zoom: 1 + Math.sin(frame * 0.28) * 0.035,
      };
    case "slow_push":
      return { x: 0, y: 0, zoom: interpolate(frame, [0, 120], [1, 1.08], { extrapolateRight: "clamp" }) };
    case "orbit":
      return { x: Math.cos(frame / 38) * 42, y: Math.sin(frame / 42) * 24, zoom: 1.04 };
    case "map_pan":
      return { x: interpolate(frame, [0, 120], [-42, 42], { extrapolateRight: "clamp" }), y: 0, zoom: 1.03 };
    case "analysis_push":
      return { x: 0, y: interpolate(frame, [0, 120], [24, -14], { extrapolateRight: "clamp" }), zoom: 1.06 };
    case "impact_snap":
      return { x: Math.sin(frame * 0.5) * 8, y: 0, zoom: frame % 45 < 6 ? 1.08 : 1.01 };
    case "fixed_dashboard":
      return { x: 0, y: 0, zoom: 1 };
    case "case_dolly":
      return { x: interpolate(frame, [0, 120], [36, -18], { extrapolateRight: "clamp" }), y: 0, zoom: 1.045 };
    case "feed_follow":
      return { x: 0, y: interpolate(frame % 120, [0, 120], [28, -28]), zoom: 1.02 };
    case "ui_step":
      return { x: interpolate(frame, [0, 120], [-18, 18], { extrapolateRight: "clamp" }), y: 0, zoom: 1.025 };
    default:
      return { x: 0, y: 0, zoom: 1 };
  }
};

const animationByStyle = (motionStyle: string): MotionSystem["animationSystem"] => {
  switch (motionStyle) {
    case "fast_snappy":
      return { entrance: "burst", exit: "snap-out", emphasis: "scale-pop" };
    case "smooth":
      return { entrance: "fade-up", exit: "fade", emphasis: "soft-focus" };
    case "smooth_depth":
      return { entrance: "z-depth-rise", exit: "zoom-through", emphasis: "parallax-glow" };
    case "geo_trace":
      return { entrance: "pin-drop", exit: "map-wipe", emphasis: "route-pulse" };
    case "analysis_scan":
      return { entrance: "scan-in", exit: "scan-out", emphasis: "beam-highlight" };
    case "impact_contrast":
      return { entrance: "hard-slam", exit: "cut-away", emphasis: "price-shock" };
    case "panel_build":
      return { entrance: "panel-assemble", exit: "panel-collapse", emphasis: "status-pulse" };
    case "case_reveal":
      return { entrance: "story-card", exit: "page-turn", emphasis: "evidence-ring" };
    case "stream":
      return { entrance: "feed-roll", exit: "feed-flush", emphasis: "anomaly-flash" };
    case "guided_steps":
      return { entrance: "step-slide", exit: "next-step", emphasis: "cursor-tap" };
    default:
      return { entrance: "fade", exit: "fade", emphasis: "pulse" };
  }
};

export const resolveMotionSystem = (config: EngineConfig, frame: number): MotionSystem => ({
  cameraSystem: cameraByMode(config.cameraMode, frame),
  animationSystem: animationByStyle(config.motionStyle),
  transitionSystem: { type: config.transitionStyle },
});
