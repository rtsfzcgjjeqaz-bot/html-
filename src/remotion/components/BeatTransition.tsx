import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type BeatTransitionProps = {
  durationFrames: number;
  children: React.ReactNode;
};

export const BeatTransition: React.FC<BeatTransitionProps> = ({ durationFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impact = spring({ frame, fps, config: { damping: 13, stiffness: 180 } });
  const opacity = interpolate(frame, [0, 8, durationFrames - 10, durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [0, 10], [8, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(impact, [0, 1], [1.035, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
