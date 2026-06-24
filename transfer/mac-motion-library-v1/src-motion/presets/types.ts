import type React from "react";

export type MotionRange = {
  frame: number;
  startFrame: number;
  endFrame: number;
  fps: number;
};

export type SafeArea = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type MotionStyle = Partial<Pick<
  React.CSSProperties,
  "opacity" | "transform" | "filter" | "clipPath" | "boxShadow"
>>;

export const clampExtrapolate = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const boundedProgressRange = ({ startFrame, endFrame }: Pick<MotionRange, "startFrame" | "endFrame">) => [
  startFrame,
  Math.max(startFrame + 1, endFrame),
];
