import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_101_DURATION_FRAMES = 97;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
  focusStatus?: string;
};

const rows = [
  { name: "Annual Performance Review", status: "In review", color: "#e9d756" },
  { name: "Quarterly Goal Check", status: "Approved", color: "#79d77e" },
  { name: "Manager feedback", status: "Follow-up", color: "#69c8ed" },
  { name: "Team milestone", status: "On track", color: "#e95e75" },
];

export const Shot101SaasRowStreamOverviewChoreography: React.FC<Props> = ({
  title = "Review work in one clear list",
  focusStatus = "Approved",
}) => {
  const frame = useCurrentFrame();
  const rowsIn = ease(frame, 0, 34);
  const pills = ease(frame, 20, 58);
  const cursor = ease(frame, 38, 72);
  const blur = ease(frame, 54, 88);
  const settle = ease(frame, 78, 97);

  return (
    <AbsoluteFill
      style={{
        background: "#faf8fc",
        overflow: "hidden",
        color: "#202027",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 74% 72%, rgba(221,210,248,0.72), transparent 34%), radial-gradient(circle at 26% 18%, rgba(244,229,238,0.74), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f6f2fb 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 96,
          width: 390,
          opacity: rowsIn,
          transform: `translateY(${interpolate(rowsIn, [0, 1], [16, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 760, color: "#7267d7", textTransform: "uppercase" }}>Workflow overview</div>
        <div style={{ marginTop: 10, fontSize: 38, lineHeight: 1.06, fontWeight: 840, letterSpacing: 0 }}>{title}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 280,
          top: 240,
          width: 900,
          height: 300,
          transform: `translateX(${interpolate(rowsIn, [0, 1], [160, 0], clamp)}px) scale(${interpolate(settle, [0, 1], [1.01, 1], clamp)})`,
        }}
      >
        {rows.map((row, index) => {
          const p = ease(frame, index * 6, 34 + index * 6);
          const focus = index === 1;
          return (
            <div
              key={row.name}
              style={{
                position: "absolute",
                left: index * 46,
                top: index * 50,
                width: 720,
                height: 54,
                borderRadius: 16,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(221,216,234,0.92)",
                boxShadow: focus ? "0 18px 42px rgba(92,74,124,0.18)" : "0 12px 30px rgba(92,74,124,0.10)",
                opacity: p,
                filter: focus ? "none" : `blur(${interpolate(blur, [0, 1], [0, 1.4], clamp)}px)`,
                transform: `translateX(${interpolate(p, [0, 1], [90, 0], clamp)}px) rotate(${interpolate(p, [0, 1], [2, -1.5], clamp)}deg)`,
              }}
            >
              <div style={{ position: "absolute", left: 22, top: 16, width: 22, height: 22, borderRadius: 99, background: "#f0d7df" }} />
              <div style={{ position: "absolute", left: 58, top: 17, fontSize: 13, fontWeight: 720, color: "#393842" }}>{row.name}</div>
              <div
                style={{
                  position: "absolute",
                  right: 168,
                  top: 17,
                  width: 78,
                  height: 11,
                  borderRadius: 99,
                  background: "rgba(48,48,56,0.08)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 48,
                  top: 14,
                  padding: "5px 10px",
                  borderRadius: 99,
                  opacity: pills,
                  background: row.color,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 790,
                }}
              >
                {focus ? focusStatus : row.status}
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [980, 840], clamp),
          top: interpolate(cursor, [0, 1], [400, 350], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "18px solid #202027",
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-10, -18], clamp)}deg)`,
          filter: "drop-shadow(0 8px 12px rgba(32,32,39,0.18))",
        }}
      />
    </AbsoluteFill>
  );
};
