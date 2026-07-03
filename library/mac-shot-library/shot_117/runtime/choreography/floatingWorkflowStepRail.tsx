import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_117_DURATION_FRAMES = 78;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
};

const steps = [
  "New request",
  "Assign owner",
  "Draft reply",
  "Approve",
  "Send update",
];

export const Shot117FloatingWorkflowStepRailChoreography: React.FC<Props> = ({
  title = "Turn messages into workflow",
}) => {
  const frame = useCurrentFrame();
  const workspace = ease(frame, 0, 24);
  const lift = ease(frame, 12, 36);
  const fan = ease(frame, 24, 62);
  const glow = ease(frame, 40, 70);
  const cursor = ease(frame, 48, 72);
  const settle = ease(frame, 66, 78);

  return (
    <AbsoluteFill
      style={{
        background: "#070a12",
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 72% 34%, rgba(183,74,255,0.28), transparent 28%), radial-gradient(circle at 24% 66%, rgba(24,154,255,0.18), transparent 26%), linear-gradient(135deg, #0a0d16 0%, #121626 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 72,
          width: 1130,
          height: 520,
          borderRadius: 30,
          background: "rgba(18,22,34,0.88)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.38)",
          opacity: workspace,
          transform: `perspective(1000px) rotateX(${interpolate(workspace, [0, 1], [18, 8], clamp)}deg) rotateZ(-6deg) translateY(${interpolate(workspace, [0, 1], [54, 0], clamp)}px) scale(${interpolate(workspace, [0, 1], [0.96, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 38, top: 34, width: 250, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", left: 42, top: 108, width: 310, height: 290, borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }} />
        {[0, 1, 2].map((item) => (
          <div key={item} style={{ position: "absolute", left: 70, top: 138 + item * 78, width: 250, height: 54, borderRadius: 16, background: item === 0 ? "rgba(255,151,64,0.42)" : "rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", left: 16, top: 14, width: 26, height: 26, borderRadius: 99, background: item === 0 ? "#ff9c42" : "#576174" }} />
            <div style={{ position: "absolute", left: 54, top: 16, width: 126, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.42)" }} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 440, top: 98, width: 590, height: 280, borderRadius: 24, background: "rgba(8,10,18,0.48)", border: "1px solid rgba(255,255,255,0.08)" }} />
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 304,
          top: 232,
          width: interpolate(glow, [0, 1], [0, 650], clamp),
          height: 4,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(255,92,224,0), rgba(255,92,224,0.95), rgba(74,190,255,0.8))",
          boxShadow: "0 0 26px rgba(255,92,224,0.46)",
          transform: "rotate(-12deg)",
          opacity: glow,
        }}
      />

      {steps.map((step, index) => {
        const p = ease(frame, 24 + index * 5, 50 + index * 5);
        const x = 318 + index * 128;
        const y = 270 - index * 25 + Math.sin(index) * 14;
        return (
          <div
            key={step}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 230,
              height: 72,
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(255,88,230,${0.92 - index * 0.06}), rgba(128,86,255,${0.88 - index * 0.04}))`,
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "0 22px 52px rgba(130,46,220,0.32)",
              opacity: p,
              transform: `perspective(700px) rotateX(18deg) rotateZ(${interpolate(fan, [0, 1], [16, -10 + index * 5], clamp)}deg) translateY(${interpolate(p, [0, 1], [54, interpolate(settle, [0, 1], [0, -4], clamp)], clamp)}px) scale(${interpolate(lift, [0, 1], [0.92, 1], clamp)})`,
            }}
          >
            <div style={{ position: "absolute", left: 16, top: 17, width: 34, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.28)" }} />
            <div style={{ position: "absolute", left: 62, top: 18, fontSize: 14, fontWeight: 840 }}>{step}</div>
            <div style={{ position: "absolute", left: 62, top: 43, width: 98, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.32)" }} />
          </div>
        );
      })}

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [950, 704], clamp),
          top: interpolate(cursor, [0, 1], [188, 250], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "28px solid #28a8ff",
          borderTop: "17px solid transparent",
          borderBottom: "17px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-22, -8], clamp)}deg)`,
          filter: "drop-shadow(0 14px 20px rgba(40,168,255,0.34))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78,
          bottom: 52,
          opacity: ease(frame, 58, 78),
          transform: `translateY(${interpolate(ease(frame, 58, 78), [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 40, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
