import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_31_DURATION_FRAMES = 64;

export const Shot31FinalCTAChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 28], [0, 1], clamp);
  const logoY = interpolate(frame, [0, 34], [12, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoScale = interpolate(frame, [0, 34], [0.96, 1], clamp);
  const sloganOpacity = interpolate(frame, [22, 48], [0, 1], clamp);
  const sloganY = interpolate(frame, [22, 50], [10, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 34,
          top: height * 0.41 - 34 + logoY,
          width: 68,
          height: 68,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 6,
            width: 52,
            height: 26,
            borderRadius: "26px 26px 8px 8px",
            background: "linear-gradient(135deg, #2f80ed, #22a06b)",
            transform: "rotate(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 29,
            width: 42,
            height: 26,
            borderRadius: "8px 8px 24px 24px",
            background: "linear-gradient(135deg, #22a06b, #2f80ed)",
            transform: "rotate(8deg)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.54 + sloganY,
          opacity: sloganOpacity,
          textAlign: "center",
          color: "#17202a",
          fontSize: 24,
          lineHeight: 1.2,
          fontWeight: 760,
          letterSpacing: 0,
        }}
      >
        Build clearly. Finish confidently.
      </div>
    </AbsoluteFill>
  );
};
