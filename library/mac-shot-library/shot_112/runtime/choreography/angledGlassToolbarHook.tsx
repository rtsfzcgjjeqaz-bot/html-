import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_112_DURATION_FRAMES = 81;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  productLabel?: string;
};

const toolbar = ["mail", "reply", "link", "ai", "save", "send"];
const rows = ["Draft quarterly plan", "Review agent task", "Summarize inbox"];

export const Shot112AngledGlassToolbarHookChoreography: React.FC<Props> = ({
  headline = "Your agent begins in the flow",
  productLabel = "AI workspace",
}) => {
  const frame = useCurrentFrame();
  const surface = ease(frame, 0, 28);
  const icons = ease(frame, 12, 46);
  const cursor = ease(frame, 28, 64);
  const panels = ease(frame, 36, 72);
  const text = ease(frame, 54, 81);

  return (
    <AbsoluteFill
      style={{
        background: "#f6fbff",
        overflow: "hidden",
        color: "#172034",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 24% 18%, rgba(66,198,255,0.32), transparent 26%), radial-gradient(circle at 76% 44%, rgba(206,223,255,0.76), transparent 32%), linear-gradient(135deg, #ffffff 0%, #edf8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 72,
          width: 1080,
          height: 560,
          borderRadius: 34,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(95,150,210,0.24)",
          boxShadow: "0 34px 80px rgba(88,143,190,0.22)",
          transformOrigin: "48% 50%",
          opacity: interpolate(surface, [0, 1], [0.4, 1], clamp),
          transform: `perspective(900px) rotateX(58deg) rotateZ(-18deg) translateX(${interpolate(surface, [0, 1], [160, 0], clamp)}px) translateY(${interpolate(surface, [0, 1], [-50, 0], clamp)}px) scale(${interpolate(surface, [0, 1], [1.08, 1], clamp)})`,
          overflow: "hidden",
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 82, background: "rgba(255,255,255,0.86)", borderBottom: "1px solid rgba(104,150,198,0.18)" }} />
        <div style={{ position: "absolute", left: 34, top: 25, width: 142, height: 34, borderRadius: 999, background: "#ffffff", boxShadow: "0 8px 20px rgba(60,116,170,0.10)" }} />
        {toolbar.map((item, index) => {
          const p = ease(frame, 12 + index * 4, 36 + index * 4);
          return (
            <div
              key={item}
              style={{
                position: "absolute",
                left: 222 + index * 78,
                top: 27,
                width: 32,
                height: 32,
                borderRadius: 10,
                background: item === "ai" ? "#1d8cff" : "rgba(23,32,52,0.08)",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [12, 0], clamp)}px) scale(${interpolate(p, [0, 1], [0.8, 1], clamp)})`,
                color: item === "ai" ? "#fff" : "#617389",
                fontSize: 9,
                fontWeight: 780,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 52, top: 118, width: 380, height: 344, borderRadius: 24, background: "rgba(255,255,255,0.68)", border: "1px solid rgba(104,150,198,0.16)" }} />
        {rows.map((row, index) => {
          const p = ease(frame, 24 + index * 7, 54 + index * 7);
          return (
            <div
              key={row}
              style={{
                position: "absolute",
                left: 82,
                top: 148 + index * 78,
                width: 308,
                height: 50,
                borderRadius: 16,
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(104,150,198,0.14)",
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-32, 0], clamp)}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 16, top: 17, width: 18, height: 18, borderRadius: 99, background: "#47c7ff" }} />
              <div style={{ position: "absolute", left: 46, top: 17, color: "#26354a", fontSize: 13, fontWeight: 720 }}>{row}</div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 162,
            width: 420,
            height: 250,
            borderRadius: 30,
            background: "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(218,244,255,0.64))",
            border: "1px solid rgba(83,171,232,0.22)",
            opacity: panels,
            transform: `translateX(${interpolate(panels, [0, 1], [80, 0], clamp)}px) translateY(${interpolate(panels, [0, 1], [-32, 0], clamp)}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 34, top: 36, color: "#1b7fe9", fontSize: 18, fontWeight: 820 }}>{productLabel}</div>
          <div style={{ position: "absolute", left: 34, top: 82, width: 250, height: 12, borderRadius: 999, background: "rgba(42,108,170,0.12)" }} />
          <div style={{ position: "absolute", left: 34, top: 116, width: 310, height: 12, borderRadius: 999, background: "rgba(42,108,170,0.10)" }} />
          <div style={{ position: "absolute", left: 34, top: 150, width: 188, height: 34, borderRadius: 999, background: "#1d8cff", color: "#fff", fontSize: 13, fontWeight: 780, display: "flex", alignItems: "center", justifyContent: "center" }}>Run agent</div>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [968, 838], clamp),
          top: interpolate(cursor, [0, 1], [132, 236], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "24px solid #1397ff",
          borderTop: "15px solid transparent",
          borderBottom: "15px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-22, -10], clamp)}deg)`,
          filter: "drop-shadow(0 12px 18px rgba(19,151,255,0.34))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78,
          bottom: 70,
          width: 520,
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [20, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 42, lineHeight: 1.02, fontWeight: 850, letterSpacing: 0 }}>{headline}</div>
      </div>
    </AbsoluteFill>
  );
};
