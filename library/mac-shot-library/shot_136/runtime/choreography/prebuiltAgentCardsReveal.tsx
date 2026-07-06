import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_136_DURATION_FRAMES = 140;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  cards?: string[];
  chipLabel?: string;
};

const positions = [
  { x: -390, y: -170, r: -7, s: 0.88 },
  { x: -110, y: -210, r: 5, s: 0.92 },
  { x: 220, y: -176, r: -5, s: 0.9 },
  { x: 430, y: -62, r: 7, s: 0.86 },
  { x: -440, y: 80, r: 6, s: 0.9 },
  { x: -210, y: 190, r: -5, s: 0.88 },
  { x: 150, y: 184, r: 5, s: 0.92 },
  { x: 390, y: 86, r: -6, s: 0.86 },
];

export const Shot136PrebuiltAgentCardsRevealChoreography: React.FC<Props> = ({
  headline = "Prebuilt Agents",
  cards = [
    "Sales Proposal",
    "Blog Generator",
    "IT Helpdesk",
    "Evaluation",
    "Programming",
    "Research",
    "Support",
    "Compliance",
  ],
  chipLabel = "Configure",
}) => {
  const frame = useCurrentFrame();
  const headlineIn = ease(frame, 24, 76);
  const settle = ease(frame, 48, 108);
  const chipPulse = ease(frame, 66, 122);
  const hold = ease(frame, 116, 140);

  return (
    <AbsoluteFill
      style={{
        background: "#f9f9ff",
        overflow: "hidden",
        color: "#111827",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(45,155,220,0.13), transparent 27%), radial-gradient(circle at 72% 76%, rgba(115,87,255,0.10), transparent 25%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      {positions.map((pos, index) => {
        const p = ease(frame, index * 5, 44 + index * 4);
        const drift = interpolate(settle, [0, 1], [20, 0], clamp);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 540,
              top: 286,
              width: 252,
              height: 132,
              borderRadius: 24,
              background: "#ffffff",
              border: "1px solid rgba(45,155,220,0.16)",
              boxShadow: "0 26px 80px rgba(40,72,120,0.12)",
              opacity: 0.08 + p * 0.88,
              transform: `translate(${interpolate(p, [0, 1], [pos.x * 0.38, pos.x], clamp)}px, ${interpolate(p, [0, 1], [pos.y * 0.34, pos.y + drift], clamp)}px) rotate(${interpolate(p, [0, 1], [0, pos.r], clamp)}deg) scale(${interpolate(p, [0, 1], [0.74, pos.s], clamp)})`,
              overflow: "hidden",
              zIndex: index === 1 || index === 4 ? 4 : 2,
            }}
          >
            <div style={{ position: "absolute", left: 18, top: 18, width: 42, height: 42, borderRadius: 14, background: index % 3 === 0 ? "#226eea" : "rgba(34,110,234,0.10)" }} />
            <div style={{ position: "absolute", left: 76, top: 24, fontSize: 16, fontWeight: 850, color: "#111827" }}>
              {cards[index] ?? `Agent ${index + 1}`}
            </div>
            <div style={{ position: "absolute", left: 76, top: 54, width: 112, height: 9, borderRadius: 999, background: "rgba(17,24,39,0.12)" }} />
            <div
              style={{
                position: "absolute",
                left: 18,
                bottom: 18,
                padding: "8px 14px",
                borderRadius: 999,
                background: index % 3 === 0 ? "#226eea" : "rgba(34,110,234,0.08)",
                color: index % 3 === 0 ? "#ffffff" : "#226eea",
                fontSize: 12,
                fontWeight: 820,
                opacity: interpolate(chipPulse, [0, 0.5, 1], [0.72, 1, 0.86], clamp),
              }}
            >
              {chipLabel}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 304,
          textAlign: "center",
          zIndex: 8,
          opacity: 0.12 + headlineIn * 0.88,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [32, 0], clamp)}px) scale(${interpolate(headlineIn, [0, 1], [0.94, 1], clamp)})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 58,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 0,
            padding: "18px 30px",
            borderRadius: 28,
            background: "rgba(255,255,255,0.78)",
            boxShadow: "0 24px 80px rgba(40,72,120,0.10)",
          }}
        >
          {headline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 420,
          right: 420,
          bottom: 92,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(45,155,220,0), rgba(45,155,220,0.34), rgba(115,87,255,0))",
          opacity: headlineIn * interpolate(hold, [0, 1], [0.62, 0.46], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
