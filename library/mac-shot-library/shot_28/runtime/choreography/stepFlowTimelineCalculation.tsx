import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_28_DURATION_FRAMES = 292;

const ticks = ["08-05", "08-08", "08-12", "08-16", "08-19", "08-22"];

export const Shot28StepFlowChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lineLeft = width * 0.22;
  const lineTop = height * 0.57;
  const lineWidth = width * 0.6;

  const draw = interpolate(frame, [22, 138], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rangeProgress = interpolate(frame, [92, 190], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const formulaOpacity = interpolate(frame, [148, 186], [0, 1], clamp);
  const formulaY = interpolate(frame, [148, 238], [16, 0], clamp);
  const resultScale = interpolate(frame, [206, 236, 292], [0.9, 1.04, 1], clamp);
  const resultOpacity = interpolate(frame, [206, 236], [0, 1], clamp);
  const activeStart = lineLeft + lineWidth * 0.22;
  const activeEnd = lineLeft + lineWidth * 0.78;
  const activeWidth = (activeEnd - activeStart) * rangeProgress;

  return (
    <AbsoluteFill
      style={{
        background: "#05070d",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 64% 58%, rgba(34,197,94,0.2), transparent 36%), linear-gradient(135deg, #05070d, #0a1020 62%, #05070d)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.1,
          top: height * 0.18,
          color: "#f8fbff",
          fontSize: 38,
          lineHeight: 1.12,
          fontWeight: 880,
          opacity: interpolate(frame, [0, 32], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [0, 32], [20, 0], clamp)}px)`,
        }}
      >
        Calculate
        <div
          style={{
            marginTop: 14,
            maxWidth: 430,
            color: "rgba(248,251,255,0.62)",
            fontSize: 18,
            fontWeight: 620,
            lineHeight: 1.3,
          }}
        >
          Select a delivery window, calculate the active process range, and lock the result.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: lineLeft,
          top: lineTop,
          width: lineWidth,
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            width: lineWidth * draw,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #22c55e, #3ad0ff)",
            boxShadow: "0 0 30px rgba(34,197,94,0.42)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: activeStart,
          top: lineTop - 8,
          width: activeWidth,
          height: 21,
          borderRadius: 999,
          background: "rgba(34,197,94,0.24)",
          border: "1px solid rgba(34,197,94,0.52)",
          opacity: interpolate(rangeProgress, [0, 0.2, 1], [0, 1, 1], clamp),
        }}
      />

      {ticks.map((tick, index) => {
        const x = lineLeft + (lineWidth / (ticks.length - 1)) * index;
        const tickEnter = interpolate(draw, [index / ticks.length, Math.min(1, index / ticks.length + 0.18)], [0, 1], clamp);
        return (
          <div key={tick}>
            <div
              style={{
                position: "absolute",
                left: x - 5,
                top: lineTop - 8,
                width: 10,
                height: 21,
                borderRadius: 999,
                background: "#0f172a",
                border: "2px solid #22c55e",
                opacity: tickEnter,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 34,
                top: lineTop + 28,
                width: 68,
                textAlign: "center",
                color: "rgba(248,251,255,0.62)",
                fontSize: 14,
                fontWeight: 680,
                opacity: tickEnter,
              }}
            >
              {tick}
            </div>
          </div>
        );
      })}

      {[
        { label: "2025-08-05", x: activeStart, align: "left" as const },
        { label: "2025-08-22", x: activeEnd, align: "right" as const },
      ].map((chip) => (
        <div
          key={chip.label}
          style={{
            position: "absolute",
            left: chip.x - (chip.align === "left" ? 0 : 128),
            top: lineTop - 62,
            width: 128,
            padding: "9px 12px",
            borderRadius: 12,
            color: "#06111c",
            background: "#22c55e",
            fontSize: 15,
            fontWeight: 820,
            textAlign: "center",
            opacity: interpolate(rangeProgress, [0, 0.32, 1], [0, 1, 1], clamp),
            transform: `scale(${interpolate(rangeProgress, [0, 1], [0.94, 1], clamp)})`,
          }}
        >
          {chip.label}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: activeStart,
          top: lineTop - 132 + formulaY,
          opacity: formulaOpacity,
          color: "#f8fbff",
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1.18,
        }}
      >
        2.2 workdays + 3 checkpoints
        <div
          style={{
            color: "rgba(248,251,255,0.54)",
            fontSize: 15,
            fontWeight: 650,
            marginTop: 8,
          }}
        >
          Formula caption stays anchored to the active range.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: width * 0.11,
          top: lineTop - 170,
          opacity: resultOpacity,
          transform: `scale(${resultScale})`,
          width: 188,
          minHeight: 108,
          borderRadius: 22,
          background: "rgba(12,18,31,0.92)",
          border: "1px solid rgba(34,197,94,0.42)",
          boxShadow: "0 24px 88px rgba(34,197,94,0.14)",
          padding: 20,
          color: "#f8fbff",
        }}
      >
        <div style={{ color: "#22c55e", fontSize: 15, fontWeight: 820 }}>Result</div>
        <div style={{ marginTop: 8, fontSize: 32, fontWeight: 920, lineHeight: 1 }}>Ready</div>
        <div style={{ marginTop: 8, color: "rgba(248,251,255,0.58)", fontSize: 14, fontWeight: 650 }}>
          Timeline locked
        </div>
      </div>
    </AbsoluteFill>
  );
};
