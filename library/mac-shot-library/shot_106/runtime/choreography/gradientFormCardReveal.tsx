import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_106_DURATION_FRAMES = 96;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
  subtitle?: string;
};

export const Shot106GradientFormCardRevealChoreography: React.FC<Props> = ({
  title = "Form",
  subtitle = "Defines focus",
}) => {
  const frame = useCurrentFrame();
  const spark = ease(frame, 0, 26);
  const card = ease(frame, 18, 58);
  const titleIn = ease(frame, 44, 76);
  const subtitleIn = ease(frame, 60, 92);
  const shimmer = ease(frame, 78, 96);

  const cardWidth = interpolate(card, [0, 1], [92, 430], clamp);
  const cardHeight = interpolate(card, [0, 1], [56, 168], clamp);
  const cardX = 360 - cardWidth / 2;
  const cardY = 548 - cardHeight / 2;
  const sparkX = interpolate(spark, [0, 1], [154, 246], clamp);
  const sparkY = interpolate(spark, [0, 1], [456, 540], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#020207",
        overflow: "hidden",
        color: "#f8fbff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(22,244,219,0.12), transparent 30%), radial-gradient(circle at 42% 52%, rgba(30,62,255,0.20), transparent 24%), #020207",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: sparkX - 13,
          top: sparkY - 13,
          width: 26,
          height: 26,
          opacity: spark,
          transform: `rotate(${interpolate(frame, [0, 96], [0, 140], clamp)}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 12, top: 0, width: 2, height: 26, borderRadius: 99, background: "#51fff0", boxShadow: "0 0 18px rgba(81,255,240,0.92)" }} />
        <div style={{ position: "absolute", top: 12, left: 0, width: 26, height: 2, borderRadius: 99, background: "#315dff", boxShadow: "0 0 18px rgba(49,93,255,0.92)" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: cardWidth,
          height: cardHeight,
          borderRadius: 10,
          opacity: interpolate(card, [0, 1], [0.42, 1], clamp),
          background: "linear-gradient(105deg, #1118ff 0%, #185bff 28%, #18f4dc 70%, #27f0cc 100%)",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow: "0 0 42px rgba(0,103,255,0.36), 0 0 62px rgba(0,245,208,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.34) 50%, transparent 100%)",
            opacity: shimmer,
            transform: `translateX(${interpolate(shimmer, [0, 1], [-440, 440], clamp)}px) skewX(-14deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 54,
            top: 48,
            opacity: titleIn,
            transform: `translateX(${interpolate(titleIn, [0, 1], [18, 0], clamp)}px)`,
            fontSize: 38,
            lineHeight: 1,
            fontWeight: 790,
            letterSpacing: 0,
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 92,
            opacity: subtitleIn,
            transform: `translateY(${interpolate(subtitleIn, [0, 1], [10, 0], clamp)}px)`,
            fontSize: 18,
            lineHeight: 1.2,
            fontWeight: 520,
            color: "rgba(248,251,255,0.70)",
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
