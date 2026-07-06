import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_134_DURATION_FRAMES = 105;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  label?: string;
  languages?: string[];
};

const cardTargets = [
  { x: -360, y: -118, r: -10, s: 0.96 },
  { x: -170, y: -180, r: 8, s: 0.9 },
  { x: 104, y: -168, r: -7, s: 0.94 },
  { x: 322, y: -88, r: 11, s: 0.98 },
  { x: -300, y: 132, r: 8, s: 0.92 },
  { x: -42, y: 170, r: -5, s: 1 },
  { x: 246, y: 128, r: 7, s: 0.94 },
];

const gradients = [
  "linear-gradient(135deg,#dff0ff,#7fb7ff)",
  "linear-gradient(135deg,#e9e5ff,#9a8cff)",
  "linear-gradient(135deg,#dffbf5,#5fd0bf)",
  "linear-gradient(135deg,#f1f5ff,#b8c6e8)",
];

export const Shot134MultiLanguageCardFanoutChoreography: React.FC<Props> = ({
  label = "Multiple languages",
  languages = ["EN", "ES", "FR", "DE", "JP", "KR", "PT"],
}) => {
  const frame = useCurrentFrame();
  const labelIn = ease(frame, 0, 28);
  const fan = ease(frame, 18, 66);
  const settle = ease(frame, 36, 82);
  const pill = ease(frame, 54, 92);
  const hold = ease(frame, 90, 105);

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
            "radial-gradient(circle at 50% 50%, rgba(45,155,220,0.15), transparent 28%), radial-gradient(circle at 62% 72%, rgba(115,87,255,0.10), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 314,
          textAlign: "center",
          opacity: 0.18 + labelIn * 0.82,
          transform: `translateY(${interpolate(labelIn, [0, 1], [22, 0], clamp)}px) scale(${interpolate(labelIn, [0, 1], [0.96, 1], clamp)})`,
          zIndex: 5,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 30px", borderRadius: 999, background: "#ffffff", border: "1px solid rgba(45,155,220,0.18)", boxShadow: "0 28px 80px rgba(40,72,120,0.13)" }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, background: "linear-gradient(135deg,#226eea,#36c5e8)" }} />
          <span style={{ fontSize: 31, fontWeight: 860, letterSpacing: 0 }}>{label}</span>
        </div>
      </div>
      {cardTargets.map((target, index) => {
        const item = ease(frame, 18 + index * 4, 58 + index * 4);
        const x = interpolate(item, [0, 1], [0, target.x], clamp);
        const y = interpolate(item, [0, 1], [0, target.y + interpolate(settle, [0, 1], [18, 0], clamp)], clamp);
        const rotation = interpolate(item, [0, 1], [0, target.r], clamp) + interpolate(hold, [0, 1], [0, index % 2 ? -1 : 1], clamp);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 540,
              top: 286,
              width: 210,
              height: 118,
              borderRadius: 24,
              background: "#ffffff",
              border: "1px solid rgba(45,155,220,0.16)",
              boxShadow: "0 26px 72px rgba(40,72,120,0.12)",
              opacity: item,
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${interpolate(item, [0, 1], [0.72, target.s], clamp)})`,
              zIndex: index === 5 ? 4 : 2,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 14, top: 14, right: 14, height: 54, borderRadius: 16, background: gradients[index % gradients.length] }} />
            <div style={{ position: "absolute", left: 24, top: 30, width: 20, height: 20, borderRadius: 999, background: "rgba(255,255,255,0.84)" }} />
            <div style={{ position: "absolute", left: 18, bottom: 28, width: 86, height: 9, borderRadius: 999, background: "rgba(17,24,39,0.14)" }} />
            <div style={{ position: "absolute", left: 18, bottom: 13, width: 54, height: 7, borderRadius: 999, background: "rgba(45,155,220,0.18)" }} />
            <div
              style={{
                position: "absolute",
                right: 14,
                bottom: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: index === 0 ? "#226eea" : "rgba(34,110,234,0.08)",
                color: index === 0 ? "#ffffff" : "#226eea",
                fontSize: 13,
                fontWeight: 840,
                opacity: pill,
              }}
            >
              {languages[index] ?? `L${index + 1}`}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 400,
          right: 400,
          bottom: 80,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(45,155,220,0), rgba(45,155,220,0.28), rgba(115,87,255,0))",
          opacity: fan * interpolate(hold, [0, 1], [0.68, 0.5], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
