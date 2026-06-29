import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_79_DURATION_FRAMES = 89;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const cardLines = [
  "Consider starting with a stronger opening hook.",
  "For example: Imagine a world where every",
  "conversation leads to understanding and connection.",
  "That world starts with mastering communication.",
];

export const Shot79AiSuggestionCardFromSelectionChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const context = ease(frame, 0, 22);
  const toolbar = ease(frame, 12, 34);
  const tooltipA = ease(frame, 24, 40);
  const tooltipB = ease(frame, 34, 52);
  const card = ease(frame, 42, 68);
  const copy = ease(frame, 58, 82);
  const settle = ease(frame, 78, SHOT_79_DURATION_FRAMES);

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
            "radial-gradient(circle at 70% 45%, rgba(94, 92, 255, 0.24), transparent 34%), radial-gradient(circle at 34% 38%, rgba(56, 130, 246, 0.16), transparent 34%), linear-gradient(180deg, #050914 0%, #02040a 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 470,
          top: height / 2 - 214,
          width: 660,
          height: 360,
          opacity: context,
          filter: `blur(${interpolate(context, [0, 1], [8, 0], clamp)}px)`,
          transform: "rotateZ(-1deg)",
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(15,19,28,0.96), rgba(5,7,13,0.96))",
          border: "1px solid rgba(180,203,255,0.16)",
          boxShadow: "0 40px 110px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 44, borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
        <div style={{ padding: "34px 40px" }}>
          <div style={{ position: "relative", height: 92, marginBottom: 28 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "78%",
                height: 68,
                borderRadius: 8,
                opacity: context,
                background: "rgba(91, 108, 255, 0.42)",
                boxShadow: "0 0 24px rgba(91,108,255,0.38)",
              }}
            />
            {[0, 1, 2].map((line) => (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12 + line * 20,
                  width: `${62 + line * 8}%`,
                  height: 5,
                  borderRadius: 99,
                  background: "rgba(236,240,255,0.78)",
                }}
              />
            ))}
          </div>
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              style={{
                width: `${74 - line * 6}%`,
                height: 5,
                borderRadius: 99,
                background: "rgba(255,255,255,0.22)",
                marginBottom: 14,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 174,
          top: height / 2 - 112,
          opacity: toolbar,
          transform: `translateX(${interpolate(toolbar, [0, 1], [18, 0], clamp)}px) scale(${interpolate(toolbar, [0, 1], [0.94, 1], clamp)})`,
          width: 58,
          height: 176,
          borderRadius: 24,
          background: "rgba(8,12,22,0.94)",
          border: "1px solid rgba(130,170,255,0.34)",
          boxShadow: "0 0 36px rgba(83,132,255,0.5)",
          display: "grid",
          placeItems: "center",
          padding: 12,
        }}
      >
        {["↕", "≡", "✦"].map((icon) => (
          <div key={icon} style={{ color: "#f7f9ff", fontSize: 19, fontWeight: 840 }}>
            {icon}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 244,
          top: height / 2 - 64,
          opacity: tooltipA * (1 - ease(frame, 42, 50)),
          padding: "9px 13px",
          borderRadius: 9,
          background: "#f6f8ff",
          color: "#202634",
          fontSize: 12,
          fontWeight: 760,
        }}
      >
        Longer
      </div>
      <div
        style={{
          position: "absolute",
          left: width / 2 + 216,
          top: height / 2 + 74,
          opacity: tooltipB,
          padding: "9px 13px",
          borderRadius: 9,
          background: "#f6f8ff",
          color: "#202634",
          fontSize: 12,
          fontWeight: 760,
        }}
      >
        Suggest Edits
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + 30,
          top: height / 2 + 28,
          width: 330,
          height: 188,
          opacity: card,
          transform: `translateY(${interpolate(card, [0, 1], [18, 0], clamp)}px) scale(${interpolate(card, [0, 1], [0.72, 1], clamp) * interpolate(settle, [0, 1], [1.012, 1], clamp)})`,
          borderRadius: 24,
          background: "rgba(15,20,34,0.96)",
          border: "1px solid rgba(152,190,255,0.34)",
          boxShadow: "0 0 42px rgba(85,130,255,0.5), 0 30px 80px rgba(0,0,0,0.46)",
          padding: 22,
        }}
      >
        <div style={{ color: "#f7f9ff", fontSize: 18, fontWeight: 860, marginBottom: 18 }}>
          ✦ Suggestion
        </div>
        {cardLines.map((line, index) => {
          const row = ease(frame, 58 + index * 4, 72 + index * 4);
          return (
            <div
              key={line}
              style={{
                opacity: row * copy,
                color: "rgba(241,246,255,0.84)",
                fontSize: 12,
                fontWeight: 680,
                lineHeight: 1.35,
                marginBottom: 5,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
