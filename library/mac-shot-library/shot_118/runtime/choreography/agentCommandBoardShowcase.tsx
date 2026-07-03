import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_118_DURATION_FRAMES = 66;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  boardTitle?: string;
};

const rows = ["Daily Phillips", "Serena Ribeiro", "Elvia Atkins"];
const icons = ["mail", "task", "pin", "reply", "send", "agent"];

export const Shot118AgentCommandBoardShowcaseChoreography: React.FC<Props> = ({
  boardTitle = "Yoga Schedule",
}) => {
  const frame = useCurrentFrame();
  const board = ease(frame, 0, 22);
  const toolbar = ease(frame, 10, 36);
  const task = ease(frame, 20, 50);
  const rowFocus = ease(frame, 34, 58);
  const pin = ease(frame, 48, 68);
  const settle = ease(frame, 60, 66);

  return (
    <AbsoluteFill
      style={{
        background: "#080b12",
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
            "radial-gradient(circle at 78% 18%, rgba(154,80,255,0.22), transparent 26%), radial-gradient(circle at 24% 82%, rgba(0,165,255,0.12), transparent 28%), linear-gradient(135deg, #0a0e17 0%, #141827 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 62,
          width: 1104,
          height: 570,
          borderRadius: 30,
          background: "linear-gradient(135deg, #1a1f2c, #0d1018)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 44px 100px rgba(0,0,0,0.42)",
          opacity: board,
          transform: `perspective(1080px) rotateX(8deg) rotateZ(-4deg) translateY(${interpolate(board, [0, 1], [60, 0], clamp)}px) scale(${interpolate(board, [0, 1], [0.96, interpolate(settle, [0, 1], [1, 1.01], clamp)], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 58, background: "rgba(5,7,12,0.58)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {icons.map((icon, index) => {
            const p = ease(frame, 10 + index * 3, 26 + index * 3);
            return (
              <div key={icon} style={{ position: "absolute", left: 180 + index * 54, top: 14, width: 30, height: 30, borderRadius: 9, background: index === 5 ? "#8e48ff" : "rgba(255,255,255,0.10)", color: "#cfd8e8", fontSize: 8, fontWeight: 820, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-10, 0], clamp)}px)` }}>{icon}</div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 44, top: 92, width: 226, height: 398, borderRadius: 24, background: "#111722", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position: "absolute", left: 28, top: 28, fontSize: 14, fontWeight: 820, color: "#dbe6ff" }}>Inbox</div>
          <div style={{ position: "absolute", left: 28, top: 82, width: 160, height: 44, borderRadius: 14, background: "#c78342", color: "#111", fontSize: 12, fontWeight: 830, display: "flex", alignItems: "center", paddingLeft: 18 }}>Expenses</div>
          <div style={{ position: "absolute", left: 28, top: 146, width: 160, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ position: "absolute", left: 306, top: 86, width: 500, height: 418, borderRadius: 26, background: "#0b1019", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position: "absolute", left: 28, top: 22, fontSize: 25, fontWeight: 850 }}>{boardTitle}</div>
          <div style={{ position: "absolute", left: 28, top: 70, width: 210, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
          {rows.map((row, index) => {
            const active = index === 0;
            return (
              <div key={row} style={{ position: "absolute", left: 28, top: 126 + index * 82, width: 430, height: 66, borderRadius: 18, background: active ? `rgba(198,95,255,${interpolate(rowFocus, [0, 1], [0.30, 0.62], clamp)})` : "rgba(255,255,255,0.07)", border: active ? "1px solid rgba(255,123,235,0.48)" : "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ position: "absolute", left: 16, top: 16, width: 34, height: 34, borderRadius: 99, background: active ? "#ff70dc" : "#566070" }} />
                <div style={{ position: "absolute", left: 64, top: 15, fontSize: 14, fontWeight: 840 }}>{row}</div>
                <div style={{ position: "absolute", left: 64, top: 39, width: 196, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.24)" }} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 48, top: 86, width: 234, height: 418, borderRadius: 24, background: "#111722", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position: "absolute", left: 24, top: 26, fontSize: 13, fontWeight: 820, color: "#cbd8ee" }}>Agent summary</div>
          <div style={{ position: "absolute", left: 24, top: 74, right: 24, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", left: 24, top: 106, right: 60, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.10)" }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: interpolate(task, [0, 1], [820, 460], clamp),
          top: interpolate(task, [0, 1], [130, 214], clamp),
          width: 336,
          height: 84,
          borderRadius: 22,
          background: "linear-gradient(135deg, rgba(255,91,232,0.95), rgba(132,73,255,0.9))",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow: "0 24px 58px rgba(152,50,225,0.34)",
          opacity: task,
          transform: `rotate(${interpolate(task, [0, 1], [-15, -4], clamp)}deg) scale(${interpolate(task, [0, 1], [0.92, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 20, top: 18, width: 36, height: 36, borderRadius: 99, background: "rgba(255,255,255,0.24)" }} />
        <div style={{ position: "absolute", left: 70, top: 20, fontSize: 15, fontWeight: 850 }}>Practice schedule</div>
        <div style={{ position: "absolute", left: 70, top: 48, width: 142, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.30)" }} />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(pin, [0, 1], [780, 704], clamp),
          top: interpolate(pin, [0, 1], [190, 242], clamp),
          width: 0,
          height: 0,
          opacity: pin,
          borderLeft: "28px solid #29a9ff",
          borderTop: "17px solid transparent",
          borderBottom: "17px solid transparent",
          transform: `rotate(${interpolate(pin, [0, 1], [-24, -8], clamp)}deg)`,
          filter: "drop-shadow(0 14px 20px rgba(41,169,255,0.34))",
        }}
      />
    </AbsoluteFill>
  );
};
