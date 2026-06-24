import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type DepthLayerProps = {
  zDepth: number;
  parallaxSpeed: number;
  durationFrames?: number;
  opacity?: number;
  blur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const DepthLayer: React.FC<DepthLayerProps> = ({ zDepth, parallaxSpeed, durationFrames, opacity = 1, blur = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const localDuration = Math.max(1, durationFrames ?? Math.min(durationInFrames, 150));
  const travel = interpolate(frame, [0, localDuration], [-1, 1], { extrapolateRight: "clamp" });
  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const x = travel * parallaxSpeed * 18;
  const y = (1 - enter) * 22;
  const scale = interpolate(enter, [0, 1], [0.985, 1]);

  return (
    <div
      style={{
        position: "absolute",
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y}px, ${zDepth}px) scale(${scale})`,
        opacity: opacity * enter,
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
