import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_122_DURATION_FRAMES = 43;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
};

const tiles = [
  { x: 365, y: 118, c: "#2ed56f", r: -18 },
  { x: 810, y: 126, c: "#ff7a42", r: 18 },
  { x: 270, y: 266, c: "#755cff", r: 14 },
  { x: 914, y: 278, c: "#2aa7ff", r: -16 },
  { x: 442, y: 392, c: "#ffcc3f", r: 24 },
];

export const Shot122PhoneCarouselPerformanceFanChoreography: React.FC<Props> = ({
  headline = "Extraordinary value",
}) => {
  const frame = useCurrentFrame();
  const wash = ease(frame, 0, 16);
  const phone = ease(frame, 6, 28);
  const fan = ease(frame, 12, 36);
  const ui = ease(frame, 20, 42);
  const text = ease(frame, 28, 43);

  return (
    <AbsoluteFill
      style={{
        background: "#fbfdff",
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
            "radial-gradient(circle at 54% 42%, rgba(76,178,255,0.18), transparent 24%), radial-gradient(circle at 34% 28%, rgba(98,227,141,0.18), transparent 20%), linear-gradient(135deg, #ffffff 0%, #f5fbff 100%)",
          opacity: wash,
        }}
      />
      {tiles.map((tile, index) => {
        const p = ease(frame, 12 + index * 3, 28 + index * 3);
        return (
          <div
            key={tile.c}
            style={{
              position: "absolute",
              left: interpolate(fan, [0, 1], [610, tile.x], clamp),
              top: interpolate(fan, [0, 1], [290, tile.y], clamp),
              width: 76,
              height: 54,
              borderRadius: 20,
              background: tile.c,
              opacity: p * 0.92,
              transform: `rotate(${interpolate(p, [0, 1], [0, tile.r], clamp)}deg) scale(${interpolate(p, [0, 1], [0.5, 1], clamp)})`,
              filter: "blur(0.2px)",
              boxShadow: `0 20px 50px ${tile.c}44`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 516,
          top: 274,
          width: 250,
          height: 382,
          borderRadius: 38,
          background: "#14181f",
          border: "8px solid #242a32",
          boxShadow: "0 40px 90px rgba(40,55,70,0.25)",
          opacity: phone,
          transformOrigin: "50% 88%",
          transform: `perspective(900px) rotateX(62deg) rotateZ(${interpolate(phone, [0, 1], [-10, 4], clamp)}deg) translateY(${interpolate(phone, [0, 1], [72, 0], clamp)}px) scale(${interpolate(phone, [0, 1], [0.82, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 12, borderRadius: 28, background: "linear-gradient(180deg, #f8fbff, #eaf3ff)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 34 + i * 54, top: 70 + i * 8, width: 42, height: 42, borderRadius: 999, background: ["#ffcc3f", "#755cff", "#2ed56f"][i], opacity: ui }} />
          ))}
          <div style={{ position: "absolute", left: 36, bottom: 64, width: 152, height: 16, borderRadius: 999, background: "rgba(17,24,39,0.14)", opacity: ui }} />
          <div style={{ position: "absolute", left: 56, bottom: 32, width: 108, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.10)", opacity: ui }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 84,
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [-18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 45, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0 }}>{headline}</div>
      </div>
    </AbsoluteFill>
  );
};
