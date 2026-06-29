import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_78_DURATION_FRAMES = 53;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const lines = [
  { w: 0.72, hot: false },
  { w: 0.62, hot: false },
  { w: 0.82, hot: true },
  { w: 0.76, hot: true },
  { w: 0.68, hot: false },
  { w: 0.84, hot: false },
  { w: 0.58, hot: false },
];

export const Shot78DocumentSelectionAiToolbarChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const surface = ease(frame, 0, 20);
  const highlight = ease(frame, 18, 36);
  const toolbar = ease(frame, 26, 44);
  const tooltip = ease(frame, 34, 50);
  const settle = ease(frame, 44, SHOT_78_DURATION_FRAMES);

  return (
    <AbsoluteFill
      style={{
        background: "#02040a",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 72% 48%, rgba(111, 91, 255, 0.23), transparent 32%), radial-gradient(circle at 36% 36%, rgba(59, 130, 246, 0.18), transparent 34%), linear-gradient(180deg, #050914 0%, #02040a 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 430,
          top: height / 2 - 230,
          width: 760,
          height: 410,
          opacity: surface,
          transform: `translateX(${interpolate(surface, [0, 1], [-36, 0], clamp)}px) rotateZ(${interpolate(surface, [0, 1], [-3, -1], clamp)}deg) scale(${interpolate(surface, [0, 1], [0.96, 1], clamp)})`,
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(16,20,30,0.98), rgba(5,7,13,0.98))",
          border: "1px solid rgba(180, 203, 255, 0.18)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.56), 0 0 44px rgba(99,102,241,0.24)",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 46, display: "flex", alignItems: "center", paddingLeft: 28, color: "rgba(242,246,255,0.76)", fontSize: 13, fontWeight: 780, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          Comms 101: Effectiveness of Different Communication Styles
        </div>
        <div style={{ padding: "30px 36px" }}>
          <div style={{ color: "#f7f9ff", fontSize: 18, fontWeight: 840, marginBottom: 20 }}>
            Introduction - 0:00-0:30
          </div>
          {lines.map((line, index) => {
            const row = ease(frame, 8 + index * 3, 24 + index * 3);
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  height: 22,
                  marginBottom: 9,
                  opacity: row,
                }}
              >
                {line.hot ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: `${interpolate(highlight, [0, 1], [0, line.w * 100], clamp)}%`,
                      height: 22,
                      borderRadius: 5,
                      background: "rgba(91, 108, 255, 0.46)",
                      boxShadow: `0 0 ${interpolate(settle, [0, 1], [20, 12], clamp)}px rgba(91,108,255,0.42)`,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    width: `${line.w * 100}%`,
                    height: 5,
                    borderRadius: 99,
                    background: line.hot ? "rgba(230,236,255,0.82)" : "rgba(255,255,255,0.24)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 330,
          top: height / 2 - 74,
          opacity: toolbar,
          transform: `translateX(${interpolate(toolbar, [0, 1], [18, 0], clamp)}px) scale(${interpolate(toolbar, [0, 1], [0.94, 1], clamp)})`,
          width: 56,
          height: 162,
          borderRadius: 22,
          background: "rgba(8, 12, 22, 0.92)",
          border: "1px solid rgba(130,170,255,0.34)",
          boxShadow: "0 0 34px rgba(83,132,255,0.46)",
          display: "grid",
          placeItems: "center",
          gap: 6,
          padding: 12,
        }}
      >
        {["↕", "≡", "✎"].map((icon) => (
          <div key={icon} style={{ color: "#f6f9ff", fontSize: 18, fontWeight: 800 }}>
            {icon}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 248,
          top: height / 2 - 12,
          opacity: tooltip,
          transform: `translateY(${interpolate(tooltip, [0, 1], [8, 0], clamp)}px)`,
          padding: "10px 14px",
          borderRadius: 9,
          background: "#f6f8ff",
          color: "#1f2430",
          fontSize: 13,
          fontWeight: 760,
          boxShadow: "0 10px 34px rgba(0,0,0,0.34)",
        }}
      >
        Change tone
      </div>
    </AbsoluteFill>
  );
};
