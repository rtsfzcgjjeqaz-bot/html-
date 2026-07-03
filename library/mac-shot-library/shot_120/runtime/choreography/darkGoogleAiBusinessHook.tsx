import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_120_DURATION_FRAMES = 98;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  subline?: string;
};

const panelData = [
  { x: 126, y: 80, w: 244, h: 146, r: -8, accent: "#41d67c" },
  { x: 806, y: 72, w: 312, h: 178, r: 8, accent: "#7a72ff" },
  { x: 710, y: 358, w: 282, h: 150, r: -6, accent: "#30c5ff" },
  { x: 246, y: 372, w: 350, h: 162, r: 5, accent: "#f1c45a" },
];

export const Shot120DarkGoogleAiBusinessHookChoreography: React.FC<Props> = ({
  headline = "Power up your business",
  subline = "with AI",
}) => {
  const frame = useCurrentFrame();
  const bloom = ease(frame, 0, 28);
  const panels = ease(frame, 8, 58);
  const mark = ease(frame, 20, 48);
  const text = ease(frame, 32, 74);
  const chips = ease(frame, 46, 86);
  const settle = ease(frame, 82, 98);

  return (
    <AbsoluteFill
      style={{
        background: "#050806",
        overflow: "hidden",
        color: "#f4fbf7",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 72% 26%, rgba(68,255,151,0.16), transparent 30%), radial-gradient(circle at 26% 72%, rgba(72,98,255,0.14), transparent 30%), linear-gradient(135deg, #050806 0%, #0b1210 100%)",
          opacity: interpolate(bloom, [0, 1], [0.35, 1], clamp),
        }}
      />
      {panelData.map((panel, index) => {
        const p = ease(frame, 8 + index * 7, 42 + index * 7);
        return (
          <div
            key={panel.x}
            style={{
              position: "absolute",
              left: panel.x,
              top: panel.y,
              width: panel.w,
              height: panel.h,
              borderRadius: 24,
              background: "rgba(12,18,20,0.86)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: `0 26px 70px rgba(0,0,0,0.34), 0 0 42px ${panel.accent}24`,
              opacity: p,
              transform: `perspective(900px) rotateX(${interpolate(panels, [0, 1], [18, 4], clamp)}deg) rotateZ(${panel.r}deg) translateY(${interpolate(p, [0, 1], [44, interpolate(settle, [0, 1], [0, -4], clamp)], clamp)}px) scale(${interpolate(p, [0, 1], [0.86, 1], clamp)})`,
            }}
          >
            <div style={{ position: "absolute", left: 22, top: 20, width: 42, height: 42, borderRadius: 14, background: panel.accent }} />
            <div style={{ position: "absolute", left: 78, top: 28, width: panel.w * 0.42, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.42)" }} />
            <div style={{ position: "absolute", left: 22, top: 84, width: panel.w - 62, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.16)" }} />
            <div style={{ position: "absolute", left: 22, top: 112, width: panel.w - 120, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.12)" }} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 590,
          top: 286,
          width: 100,
          height: 100,
          borderRadius: 30,
          background: "linear-gradient(135deg, #35e47d, #116d3d)",
          opacity: mark,
          transform: `translate(-50%, -50%) scale(${interpolate(mark, [0, 1], [0.72, 1], clamp)})`,
          boxShadow: "0 0 70px rgba(53,228,125,0.24)",
        }}
      >
        <div style={{ position: "absolute", left: 28, top: 25, width: 44, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.90)" }} />
        <div style={{ position: "absolute", left: 40, top: 38, width: 20, height: 20, borderRadius: 999, background: "#28c76f" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          bottom: 86,
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [24, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 46, lineHeight: 1.02, fontWeight: 860, letterSpacing: 0 }}>{headline}</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 790, color: "#b7f8cf" }}>{subline}</div>
      </div>

      {["Summarize", "Generate", "Analyze"].map((chip, index) => {
        const p = ease(frame, 46 + index * 6, 70 + index * 6);
        return (
          <div
            key={chip}
            style={{
              position: "absolute",
              right: 110,
              bottom: 106 + index * 52,
              width: 164,
              height: 36,
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#dfffea",
              fontSize: 13,
              fontWeight: 820,
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              opacity: p * chips,
              transform: `translateX(${interpolate(p, [0, 1], [42, 0], clamp)}px)`,
            }}
          >
            {chip}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
