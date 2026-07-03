import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_116_DURATION_FRAMES = 81;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
};

export const Shot116DarkAgentDashboardGridBuildChoreography: React.FC<Props> = ({
  title = "Dark mode",
}) => {
  const frame = useCurrentFrame();
  const backdrop = ease(frame, 0, 24);
  const panel = ease(frame, 10, 36);
  const cards = ease(frame, 20, 48);
  const cursor = ease(frame, 36, 62);
  const glow = ease(frame, 52, 75);
  const settle = ease(frame, 64, 81);

  return (
    <AbsoluteFill
      style={{
        background: "#eef6ff",
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
            "linear-gradient(135deg, #ffffff 0%, #edf6ff 48%, #ddd6ff 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 80,
          top: 66,
          width: 1120,
          height: 420,
          borderRadius: 28,
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(120,150,190,0.18)",
          boxShadow: "0 34px 84px rgba(74,118,164,0.14)",
          opacity: interpolate(backdrop, [0, 1], [1, 0.28], clamp),
          transform: `perspective(980px) rotateX(36deg) rotateZ(-7deg) translateY(${interpolate(backdrop, [0, 1], [0, -58], clamp)}px) scale(${interpolate(backdrop, [0, 1], [1, 0.96], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 70, top: 92, fontSize: 23, fontWeight: 640, color: "#26364a" }}>
          Draft context and interface preferences stay connected.
        </div>
        <div style={{ position: "absolute", left: 70, top: 150, width: 780, height: 12, borderRadius: 999, background: "rgba(38,84,130,0.12)" }} />
        <div style={{ position: "absolute", left: 70, top: 190, width: 620, height: 12, borderRadius: 999, background: "rgba(38,84,130,0.10)" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 354,
          top: 150,
          width: 574,
          height: 346,
          borderRadius: 34,
          background: "linear-gradient(135deg, #2c2630 0%, #15161e 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 38px 92px rgba(30,22,34,0.34)",
          opacity: panel,
          transform: `translateY(${interpolate(panel, [0, 1], [52, 0], clamp)}px) scale(${interpolate(panel, [0, 1], [0.92, interpolate(settle, [0, 1], [1, 1.025], clamp)], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 44, top: 34, fontSize: 34, fontWeight: 860, letterSpacing: 0 }}>{title}</div>
        <div style={{ position: "absolute", left: 54, top: 104, width: 200, height: 160, borderRadius: 22, background: "#eceff4", opacity: cards, transform: `translateY(${interpolate(cards, [0, 1], [30, 0], clamp)}px)` }}>
          <div style={{ position: "absolute", left: 28, top: 24, width: 42, height: 92, borderRadius: 8, background: "#d1d7e1" }} />
          <div style={{ position: "absolute", left: 84, top: 24, width: 42, height: 92, borderRadius: 8, background: "#f8f9fb" }} />
          <div style={{ position: "absolute", left: 140, top: 24, width: 32, height: 92, borderRadius: 8, background: "#d7dde8" }} />
        </div>
        <div style={{ position: "absolute", left: 326, top: 104, width: 200, height: 160, borderRadius: 22, background: "linear-gradient(135deg, #161922, #080a10)", border: `${interpolate(glow, [0, 1], [1, 5], clamp)}px solid rgba(255,145,43,${interpolate(glow, [0, 1], [0.22, 0.95], clamp)})`, boxShadow: `0 0 ${interpolate(glow, [0, 1], [0, 40], clamp)}px rgba(255,144,40,0.44)`, opacity: cards, transform: `translateY(${interpolate(cards, [0, 1], [30, 0], clamp)}px) scale(${interpolate(glow, [0, 1], [1, 1.04], clamp)})` }}>
          <div style={{ position: "absolute", left: 26, top: 24, width: 44, height: 96, borderRadius: 9, background: "#232938" }} />
          <div style={{ position: "absolute", left: 84, top: 24, width: 44, height: 96, borderRadius: 9, background: "#343b4c" }} />
          <div style={{ position: "absolute", left: 142, top: 24, width: 32, height: 96, borderRadius: 9, background: "#1d2230" }} />
          <div style={{ position: "absolute", left: 32, bottom: 24, width: 116, height: 10, borderRadius: 999, background: "#ff9d3d" }} />
        </div>
        <div style={{ position: "absolute", left: 118, bottom: 32, fontSize: 26, fontWeight: 780, color: "#ffffff" }}>Light</div>
        <div style={{ position: "absolute", left: 394, bottom: 32, fontSize: 26, fontWeight: 780, color: "#ffffff" }}>Dark</div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [760, 694], clamp),
          top: interpolate(cursor, [0, 1], [420, 338], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "30px solid #1197ff",
          borderTop: "18px solid transparent",
          borderBottom: "18px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-26, -9], clamp)}deg)`,
          filter: "drop-shadow(0 14px 20px rgba(17,151,255,0.34))",
        }}
      />
    </AbsoluteFill>
  );
};
