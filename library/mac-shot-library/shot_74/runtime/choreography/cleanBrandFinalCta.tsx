import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_74_DURATION_FRAMES = 64;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const Shot74CleanBrandFinalCtaChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 10);
  const logo = ease(frame, 4, 30);
  const crisp = ease(frame, 18, 42);
  const text = ease(frame, 22, 46);
  const hold = ease(frame, 46, SHOT_74_DURATION_FRAMES);

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        opacity: stage,
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(hold, [0, 1], [1.002, 1], clamp)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          aria-label="brand mark"
          style={{
            width: 64,
            height: 48,
            opacity: logo,
            transform: `translateY(${interpolate(logo, [0, 1], [10, 0], clamp)}px) scale(${interpolate(logo, [0, 1], [0.9, 1], clamp) * interpolate(crisp, [0, 1], [1.015, 1], clamp)})`,
            filter: `saturate(${interpolate(crisp, [0, 1], [0.94, 1], clamp)})`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 9,
              width: 34,
              height: 25,
              borderRadius: "6px 6px 22px 6px",
              background: "linear-gradient(135deg, #39c77f 0%, #1dbbda 100%)",
              transform: "rotate(0deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 27,
              top: 12,
              width: 31,
              height: 25,
              borderRadius: "6px 6px 6px 22px",
              background: "linear-gradient(135deg, #2079ff 0%, #183bd6 100%)",
              transform: "rotate(-6deg)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 18,
            opacity: text,
            transform: `translateY(${interpolate(text, [0, 1], [8, 0], clamp)}px)`,
            color: "#111111",
            fontSize: 18,
            fontWeight: 820,
            letterSpacing: 0,
            whiteSpace: "nowrap",
          }}
        >
          先进团队 先用飞书
        </div>
      </div>
    </AbsoluteFill>
  );
};
