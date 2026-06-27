import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_64_DURATION_FRAMES = 57;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const backgroundCards = [
  { label: "长期周期", number: "02", x: -390, y: -205, scale: 0.72, rotate: -2 },
  { label: "严格质量管控", number: "03", x: 260, y: -190, scale: 0.74, rotate: 2 },
  { label: "质量链路", number: "03", x: -420, y: 160, scale: 0.66, rotate: 2 },
  { label: "资源投入", number: "04", x: 360, y: 140, scale: 0.58, rotate: -2 },
] as const;

const CardSurface: React.FC<{ label: string; number: string; active?: boolean }> = ({
  label,
  number,
  active = false,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: active ? 26 : 20,
        background:
          "linear-gradient(135deg, rgba(18, 30, 37, 0.96), rgba(5, 8, 13, 0.96)), radial-gradient(circle at 70% 38%, rgba(244, 63, 94, 0.24), transparent 32%)",
        border: active ? "2px solid rgba(223, 245, 255, 0.62)" : "1px solid rgba(223, 245, 255, 0.28)",
        boxShadow: active
          ? "0 28px 96px rgba(0,0,0,0.58), 0 0 34px rgba(205,240,255,0.42)"
          : "0 18px 60px rgba(0,0,0,0.46)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          bottom: 56,
          height: active ? 120 : 92,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(95, 170, 190, 0.2)), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 18px)",
          borderRadius: 16,
          opacity: 0.75,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: active ? 136 : 100,
          top: active ? 112 : 86,
          width: active ? 86 : 64,
          height: active ? 120 : 90,
          borderRadius: 999,
          background: "linear-gradient(180deg, #17202a, #05070b)",
          boxShadow: "0 0 40px rgba(255,255,255,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: active ? 30 : 22,
          top: active ? 28 : 22,
          color: "#ffffff",
          fontSize: active ? 43 : 30,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: 0,
          textShadow: "0 0 18px rgba(255,255,255,0.24)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          right: active ? 28 : 22,
          bottom: active ? 20 : 18,
          color: "#ffffff",
          fontSize: active ? 44 : 28,
          fontWeight: 880,
          letterSpacing: 0,
        }}
      >
        {number}
      </div>
    </div>
  );
};

export const Shot64BigNumberInvestmentImpactChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stack = ease(frame, 0, 18);
  const active = ease(frame, 12, 34);
  const label = ease(frame, 24, 44);
  const settle = ease(frame, 44, 57);

  return (
    <AbsoluteFill
      style={{
        background: "#030609",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: stack,
          background:
            "radial-gradient(circle at 50% 48%, rgba(76, 140, 170, 0.22), transparent 34%), radial-gradient(circle at 72% 32%, rgba(244, 63, 94, 0.18), transparent 24%), linear-gradient(180deg, #071014, #020305)",
        }}
      />

      <div style={{ position: "absolute", left: width / 2, top: height / 2 }}>
        {backgroundCards.map((card, index) => {
          const drift = ease(frame, 6 + index * 2, 36);
          return (
            <div
              key={`${card.label}-${card.number}`}
              style={{
                position: "absolute",
                left: card.x,
                top: card.y,
                width: 430,
                height: 232,
                opacity: interpolate(stack, [0, 1], [0, 0.58], clamp) * interpolate(drift, [0, 1], [1, 0.68], clamp),
                transform: `translateX(${interpolate(drift, [0, 1], [0, card.x > 0 ? 34 : -34], clamp)}px) scale(${interpolate(drift, [0, 1], [card.scale, card.scale * 0.88], clamp)}) rotate(${card.rotate}deg)`,
                filter: `blur(${interpolate(stack, [0, 1], [10, 2.5], clamp)}px)`,
              }}
            >
              <CardSurface label={card.label} number={card.number} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 300,
          top: height / 2 - 142,
          width: 600,
          height: 285,
          opacity: active,
          transform: `translateY(${interpolate(active, [0, 1], [26, 0], clamp)}px) scale(${interpolate(active, [0, 1], [0.92, 1.02], clamp) * interpolate(settle, [0, 1], [1.01, 1], clamp)})`,
        }}
      >
        <CardSurface label="高投入" number="04" active />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.72)",
            opacity: interpolate(label, [0, 1], [0, 0.72], clamp),
            boxShadow: `0 0 ${interpolate(label, [0, 1], [0, 34], clamp)}px rgba(220, 246, 255, 0.42)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
