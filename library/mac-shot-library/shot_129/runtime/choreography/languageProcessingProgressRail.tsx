import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_129_DURATION_FRAMES = 102;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  instruction?: string;
  modes?: string[];
  progressLabel?: string;
};

const surfaces = [
  { left: -70, top: 380, rotate: -18, scale: 1.05 },
  { left: 350, top: 346, rotate: 14, scale: 0.92 },
  { left: 760, top: 356, rotate: -14, scale: 1.02 },
];

export const Shot129LanguageProcessingProgressRailChoreography: React.FC<Props> = ({
  instruction = "Just drop and go",
  modes = ["Books", "Audio", "Video"],
  progressLabel = "Processing",
}) => {
  const frame = useCurrentFrame();
  const drop = ease(frame, 0, 24);
  const copy = ease(frame, 18, 46);
  const sweep = ease(frame, 32, 78);
  const labels = ease(frame, 48, 88);
  const rail = ease(frame, 58, 102);

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
            "radial-gradient(circle at 50% 60%, rgba(62, 161, 255, 0.13), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f5f7ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 118,
          width: 400,
          height: 96,
          borderRadius: 18,
          border: "2px solid rgba(45, 155, 220, 0.20)",
          background: "rgba(255,255,255,0.72)",
          boxShadow: "0 30px 70px rgba(62, 91, 130, 0.08)",
          opacity: drop,
          transform: `translateY(${interpolate(drop, [0, 1], [-24, 0], clamp)}px) scaleX(${interpolate(drop, [0, 1], [0.86, 1], clamp)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 584,
          top: 84,
          width: 120,
          height: 90,
          borderRadius: 20,
          background: "linear-gradient(180deg, #4aa9ff 0%, #226eea 100%)",
          boxShadow: "0 28px 66px rgba(43, 121, 232, 0.24)",
          opacity: drop,
          transform: `translateY(${interpolate(drop, [0, 1], [-38, 24], clamp)}px) scale(${interpolate(drop, [0, 1], [0.72, 0.92], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 16, top: 16, width: 30, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.72)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          textAlign: "center",
          opacity: copy,
          transform: `translateY(${interpolate(copy, [0, 1], [20, 0], clamp)}px)`,
        }}
      >
        <span style={{ color: "#2d9bdc", fontSize: 30, fontWeight: 520 }}>{instruction.split(" ")[0]}</span>
        <span style={{ fontSize: 30, fontWeight: 520 }}> {instruction.split(" ").slice(1).join(" ")}</span>
      </div>
      {surfaces.map((surface, index) => {
        const p = ease(frame, 32 + index * 5, 64 + index * 7);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: interpolate(sweep, [0, 1], [surface.left - 160, surface.left], clamp),
              top: surface.top,
              width: 360,
              height: 210,
              borderRadius: 30,
              background: "#ffffff",
              border: "3px solid #111827",
              opacity: p * 0.86,
              transform: `rotate(${surface.rotate}deg) scale(${surface.scale})`,
              boxShadow: "0 30px 80px rgba(28, 41, 61, 0.10)",
              overflow: "hidden",
            }}
          >
            {[0, 1, 2, 3, 4].map((line) => (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: 38,
                  top: 34 + line * 28,
                  width: 210 - line * 16,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(17, 24, 39, 0.12)",
                }}
              />
            ))}
            <div style={{ position: "absolute", right: 34, top: 50, width: 92, height: 78, borderRadius: 18, background: "linear-gradient(135deg, #dff0ff, #9cc9ff)" }} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 442,
          top: 342,
          opacity: labels,
          fontSize: 27,
          fontWeight: 560,
          letterSpacing: 0,
        }}
      >
        {modes.slice(0, 3).map((mode, index) => (
          <span
            key={mode}
            style={{
              color: index === 0 ? "#2d9bdc" : "#111827",
              opacity: ease(frame, 48 + index * 9, 66 + index * 9),
              marginRight: 10,
            }}
          >
            {mode}{index < modes.length - 1 ? "." : ""}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 356,
          bottom: 86,
          width: 568,
          height: 24,
          borderRadius: 999,
          background: "rgba(40, 121, 221, 0.10)",
          opacity: rail,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${interpolate(rail, [0, 1], [8, 92], clamp)}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #7357ff, #36c5e8)",
            boxShadow: "0 12px 32px rgba(54, 197, 232, 0.28)",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 594, bottom: 124, color: "#2d9bdc", fontSize: 18, fontWeight: 700, opacity: rail }}>
        {progressLabel}
      </div>
    </AbsoluteFill>
  );
};
