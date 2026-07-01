import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_96_DURATION_FRAMES = 126;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type FinanceHookProps = {
  headline?: string;
  eyebrow?: string;
  metricLabel?: string;
};

const bars = [
  { h: 88, color: "#23d6f3", delay: 0 },
  { h: 104, color: "#1cd3ee", delay: 6 },
  { h: 62, color: "#20c5e7", delay: 12 },
  { h: 116, color: "#ff315f", delay: 18 },
  { h: 82, color: "#22d4ef", delay: 24 },
  { h: 134, color: "#24e0ff", delay: 30 },
];

export const Shot96FinanceMarketBarGlowHookChoreography: React.FC<FinanceHookProps> = ({
  headline = "Live market moves, simplified",
  eyebrow = "FX and equities signal",
  metricLabel = "+2.4% intraday shift",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const field = ease(frame, 0, 24);
  const map = ease(frame, 10, 54);
  const chart = ease(frame, 28, 76);
  const headlineIn = ease(frame, 42, 82);
  const chip = ease(frame, 62, 98);
  const settle = ease(frame, 98, 126);

  const cameraX = interpolate(frame, [0, SHOT_96_DURATION_FRAMES], [0, -34], clamp);
  const cameraScale = interpolate(frame, [0, SHOT_96_DURATION_FRAMES], [1.02, 1.08], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#03080b",
        overflow: "hidden",
        color: "#f5fbff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: field,
          background:
            "radial-gradient(circle at 67% 43%, rgba(24,96,112,0.42), transparent 34%), radial-gradient(circle at 40% 70%, rgba(6,66,96,0.28), transparent 38%), linear-gradient(180deg, #031014 0%, #041015 62%, #020608 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -120 + cameraX,
          top: 286,
          width: width + 260,
          height: 280,
          opacity: interpolate(field, [0, 1], [0, 0.78], clamp),
          transform: `perspective(900px) rotateX(62deg) scale(${cameraScale})`,
          transformOrigin: "50% 0%",
          backgroundImage:
            "linear-gradient(rgba(36,194,218,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(36,194,218,0.14) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          borderTop: "1px solid rgba(83,229,255,0.18)",
        }}
      />
      {[0, 1, 2, 3, 4].map((line) => (
        <div
          key={line}
          aria-hidden
          style={{
            position: "absolute",
            left: 150 + line * 180 + cameraX * 2,
            top: 370 + Math.sin(line) * 28,
            width: 180,
            height: 2,
            opacity: map * (0.28 + line * 0.06),
            background: line % 2 ? "rgba(29,210,236,0.34)" : "rgba(224,31,80,0.28)",
            transform: `rotate(${line % 2 ? -16 : 12}deg)`,
            boxShadow: "0 0 12px rgba(36,210,236,0.26)",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: width / 2 - 138,
          top: 132,
          width: 276,
          height: 210,
          opacity: chart,
          transform: `translateY(${interpolate(chart, [0, 1], [28, 0], clamp)}px) scale(${interpolate(settle, [0, 1], [1.02, 1], clamp)})`,
        }}
      >
        {bars.map((bar, index) => {
          const p = ease(frame, 28 + bar.delay, 58 + bar.delay);
          return (
            <div
              key={`${bar.color}-${index}`}
              style={{
                position: "absolute",
                left: 16 + index * 38,
                bottom: 18 + Math.sin(index) * 8,
                width: 18,
                height: interpolate(p, [0, 1], [12, bar.h], clamp),
                borderRadius: 999,
                background: bar.color,
                boxShadow: `0 0 22px ${bar.color}`,
                opacity: p,
              }}
            />
          );
        })}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 6,
            right: 10,
            bottom: 10,
            height: 1,
            opacity: chart,
            background: "rgba(153,239,255,0.24)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          top: 176,
          width: 430,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 760,
            color: "#31d9ef",
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 43,
            lineHeight: 1.03,
            fontWeight: 840,
            letterSpacing: 0,
            color: "#f7fbff",
            textShadow: "0 0 28px rgba(33,204,232,0.25)",
          }}
        >
          {headline}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 92,
          top: 336,
          opacity: chip,
          transform: `translateY(${interpolate(chip, [0, 1], [14, 0], clamp)}px)`,
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid rgba(86,231,255,0.24)",
          background: "rgba(2,17,24,0.68)",
          boxShadow: "0 0 24px rgba(26,203,232,0.14)",
          fontSize: 12,
          fontWeight: 760,
          color: "rgba(231,250,255,0.88)",
        }}
      >
        {metricLabel}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.32,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.62))",
        }}
      />
    </AbsoluteFill>
  );
};
