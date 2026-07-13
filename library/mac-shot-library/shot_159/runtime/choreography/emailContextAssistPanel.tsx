import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_159_DURATION_FRAMES = 180;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const sourceRows = [0.82, 0.96, 0.78, 0.9, 0.74, 0.66];
const insightRows = [
  "Summarize the latest customer thread",
  "Highlight decisions and open blockers",
  "Draft a concise follow-up response",
  "Suggest next owners and timing",
];

export const Shot159EmailContextAssistPanelChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const stage = ease(frame, 0, 28);
  const sourceDock = ease(frame, 12, 48);
  const chipResolve = ease(frame, 40, 76);
  const panelLift = ease(frame, 58, 108);
  const hold = ease(frame, 154, SHOT_159_DURATION_FRAMES);
  const camera = interpolate(frame, [0, SHOT_159_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const stageSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 110, mass: 0.95 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #f8fbff 0%, #f4f8ff 48%, #fff8fc 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22 + stage * 0.78,
          background:
            "radial-gradient(circle at 18% 24%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 78% 30%, rgba(236,72,153,0.14), transparent 20%), radial-gradient(circle at 72% 76%, rgba(14,165,233,0.12), transparent 22%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 190,
          top: 58,
          width: 900,
          height: 580,
          borderRadius: 42,
          background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 72%)",
          filter: "blur(10px)",
          opacity: 0.3 + stageSpring * 0.28,
          transform: `translateY(${interpolate(camera, [0, 1], [10, -8], clamp)}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${interpolate(camera, [0, 1], [0.986, 1.02], clamp)}) translateY(${interpolate(camera, [0, 1], [8, -4], clamp)}px)`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 116,
            width: 640,
            height: 430,
            borderRadius: 30,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 28px 84px rgba(37,99,235,0.10)",
            opacity: 0.1 + sourceDock * 0.9,
            transform: `translateY(${interpolate(sourceDock, [0, 1], [26, 0], clamp)}px) rotateZ(${interpolate(sourceDock, [0, 1], [-1.6, -0.2], clamp)}deg)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 54,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 22px",
              background: "rgba(248,250,252,0.92)",
              borderBottom: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 10, background: "#dbeafe" }} />
            <div style={{ color: "#0f172a", fontSize: 17, fontWeight: 760 }}>Customer thread</div>
            <div style={{ marginLeft: "auto", width: 94, height: 24, borderRadius: 999, background: "rgba(148,163,184,0.12)" }} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 24,
              top: 82,
              width: 136,
              height: 28,
              borderRadius: 999,
              background: "rgba(59,130,246,0.12)",
              color: "#2563eb",
              fontSize: 13,
              fontWeight: 760,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Source context
          </div>

          {sourceRows.map((row, index) => {
            const reveal = ease(frame, 18 + index * 6, 40 + index * 6);
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: 26,
                  top: 132 + index * 40,
                  width: `${row * 68}%`,
                  height: index === 1 ? 18 : 12,
                  borderRadius: 999,
                  background:
                    index === 1
                      ? "linear-gradient(90deg, rgba(59,130,246,0.18), rgba(236,72,153,0.14))"
                      : "rgba(148,163,184,0.14)",
                  opacity: reveal,
                  transform: `translateX(${interpolate(reveal, [0, 1], [18, 0], clamp)}px)`,
                }}
              />
            );
          })}
        </div>

        {["Simplify", "Break down", "Reply"].map((chip, index) => {
          const enter = ease(frame, 50 + index * 8, 72 + index * 8);
          return (
            <div
              key={chip}
              style={{
                position: "absolute",
                left: 410 + index * 120,
                top: 520,
                height: 38,
                padding: "0 20px",
                borderRadius: 999,
                background: index === 1 ? "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(14,165,233,0.92))" : "rgba(255,255,255,0.9)",
                color: index === 1 ? "#ffffff" : "#334155",
                border: index === 1 ? "none" : "1px solid rgba(148,163,184,0.16)",
                boxShadow: "0 14px 34px rgba(37,99,235,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 760,
                opacity: chipResolve,
                transform: `translateY(${interpolate(enter, [0, 1], [12, 0], clamp)}px) scale(${interpolate(enter, [0, 1], [0.94, 1], clamp)})`,
              }}
            >
              {chip}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            right: 126,
            top: 138,
            width: 430,
            height: 392,
            borderRadius: 28,
            background: "rgba(255,255,255,0.97)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 34px 110px rgba(52,72,124,0.18)",
            opacity: panelLift,
            transform: `translateX(${interpolate(panelLift, [0, 1], [56, 0], clamp)}px) translateY(${interpolate(panelLift, [0, 1], [14, 0], clamp)}px) scale(${interpolate(panelLift, [0, 1], [0.96, 1], clamp)})`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              borderBottom: "1px solid rgba(148,163,184,0.12)",
              background: "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(255,255,255,0.94))",
            }}
          >
            <div style={{ color: "#7c3aed", fontSize: 13, fontWeight: 820, letterSpacing: 1.3 }}>
              AI ASSIST
            </div>
            <div style={{ marginLeft: 12, color: "#0f172a", fontSize: 20, fontWeight: 860 }}>
              Actionable summary
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 82,
              height: 92,
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(236,72,153,0.10))",
              border: "1px solid rgba(125,211,252,0.24)",
            }}
          >
            <div style={{ position: "absolute", left: 20, top: 20, width: 146, height: 12, borderRadius: 999, background: "rgba(59,130,246,0.18)" }} />
            <div style={{ position: "absolute", left: 20, top: 44, width: 260, height: 16, borderRadius: 999, background: "rgba(15,23,42,0.08)" }} />
            <div style={{ position: "absolute", left: 20, top: 66, width: 214, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.16)" }} />
            <div style={{ position: "absolute", right: 20, top: 22, width: 54, height: 54, borderRadius: 18, background: "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(14,165,233,0.92))" }} />
          </div>

          {insightRows.map((row, index) => {
            const reveal = ease(frame, 98 + index * 12, 122 + index * 12);
            return (
              <div
                key={row}
                style={{
                  position: "absolute",
                  left: 28,
                  right: 28,
                  top: 198 + index * 42,
                  minHeight: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#243049",
                  fontSize: 14,
                  fontWeight: 690,
                  lineHeight: 1.24,
                  opacity: reveal,
                  transform: `translateY(${interpolate(reveal, [0, 1], [10, 0], clamp)}px)`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    background: index === 0 ? "#7c3aed" : "#38bdf8",
                    flexShrink: 0,
                  }}
                />
                <span>{row}</span>
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              bottom: 28,
              height: 52,
              borderRadius: 18,
              background: "rgba(248,250,252,0.96)",
              border: "1px solid rgba(148,163,184,0.14)",
              opacity: 0.8 + hold * 0.2,
            }}
          >
            <div style={{ position: "absolute", left: 18, top: 18, width: 164, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.16)" }} />
            <div style={{ position: "absolute", right: 18, top: 11, width: 92, height: 28, borderRadius: 999, background: "linear-gradient(135deg, rgba(59,130,246,0.92), rgba(14,165,233,0.9))" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
