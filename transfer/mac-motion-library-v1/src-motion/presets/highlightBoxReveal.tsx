import React from "react";
import { Easing, interpolate } from "remotion";
import { colors, layout } from "../../remotion/styles/tokens";
import { boundedProgressRange, type MotionRange, type MotionStyle, type SafeArea } from "./types";

export type HighlightBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getHighlightBoxRevealStyle = (
  args: MotionRange & {
    bounds: HighlightBounds;
    safeArea?: SafeArea;
  },
): MotionStyle => {
  const { frame, safeArea = { left: layout.safeX, right: layout.safeX, top: layout.safeY, bottom: layout.safeY } } = args;
  const progress = interpolate(frame, boundedProgressRange(args), [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(progress, [0, 0.16, 0.82, 1], [0, 1, 1, 0.82]);
  const inset = interpolate(progress, [0, 1], [18, 0]);
  const leftGuard = Math.max(args.bounds.x, safeArea.left * 0.5);
  const topGuard = Math.max(args.bounds.y, safeArea.top * 0.5);

  return {
    opacity,
    transform: `translate3d(${leftGuard}px, ${topGuard}px, 240px)`,
    clipPath: `inset(${inset}px round ${Math.max(12, Math.min(args.bounds.height, args.bounds.width) * 0.14)}px)`,
    boxShadow: `0 0 0 8px rgba(47,128,237,0.1), 0 22px 58px ${colors.shadowSoft}`,
  };
};

type HighlightBoxRevealProps = MotionRange & {
  bounds: HighlightBounds;
  safeArea?: SafeArea;
  color?: string;
};

export const HighlightBoxReveal: React.FC<HighlightBoxRevealProps> = ({
  bounds,
  color = colors.blueAccent,
  frame,
  startFrame,
  endFrame,
  fps,
  safeArea,
}) => {
  const style = getHighlightBoxRevealStyle({ frame, startFrame, endFrame, fps, safeArea, bounds });

  return (
    <div
      style={{
        position: "absolute",
        width: bounds.width,
        height: bounds.height,
        borderRadius: Math.max(12, Math.min(bounds.height, bounds.width) * 0.14),
        border: `3px solid ${color}`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

export const highlightBoxReveal = getHighlightBoxRevealStyle;
