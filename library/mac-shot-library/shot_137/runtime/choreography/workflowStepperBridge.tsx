import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_137_DURATION_FRAMES = 87;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
  steps?: string[];
  activeStep?: string;
};

export const Shot137WorkflowStepperBridgeChoreography: React.FC<Props> = ({
  title = "My Workflows",
  steps = ["Plan", "Build", "Review"],
  activeStep = "Build",
}) => {
  const frame = useCurrentFrame();
  const panel = ease(frame, 0, 24);
  const rail = ease(frame, 16, 50);
  const active = ease(frame, 30, 64);
  const rows = ease(frame, 44, 76);
  const hold = ease(frame, 74, 87);

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
            "radial-gradient(circle at 50% 50%, rgba(45,155,220,0.13), transparent 28%), radial-gradient(circle at 70% 74%, rgba(115,87,255,0.09), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 310,
          top: 148,
          width: 660,
          height: 424,
          borderRadius: 36,
          background: "rgba(255,255,255,0.84)",
          border: "1px solid rgba(45,155,220,0.16)",
          boxShadow: "0 40px 120px rgba(40,72,120,0.12)",
          opacity: 0.16 + panel * 0.84,
          transform: `translateY(${interpolate(panel, [0, 1], [46, 0], clamp)}px) scale(${interpolate(panel, [0, 1], [0.97, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 42, textAlign: "center", fontSize: 26, fontWeight: 860 }}>
          {title}
        </div>
        <div style={{ position: "absolute", left: 150, top: 138, width: 360, height: 6, borderRadius: 999, background: "rgba(34,110,234,0.10)", overflow: "hidden" }}>
          <div style={{ width: `${interpolate(rail, [0, 1], [0, 100], clamp)}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#226eea,#36c5e8)" }} />
        </div>
        {steps.slice(0, 3).map((step, index) => {
          const node = ease(frame, 18 + index * 8, 42 + index * 8);
          const isActive = step === activeStep || index === 1;
          return (
            <div
              key={step}
              style={{
                position: "absolute",
                left: 116 + index * 180,
                top: 112,
                width: 106,
                height: 58,
                borderRadius: 999,
                background: isActive ? "#226eea" : "#ffffff",
                color: isActive ? "#ffffff" : "#226eea",
                border: "1px solid rgba(45,155,220,0.18)",
                boxShadow: isActive ? "0 18px 48px rgba(34,110,234,0.22)" : "0 14px 36px rgba(40,72,120,0.08)",
                opacity: node,
                transform: `translateY(${interpolate(node, [0, 1], [20, 0], clamp)}px) scale(${isActive ? interpolate(active, [0, 0.55, 1], [1, 1.08, 1], clamp) : 1})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 820,
              }}
            >
              {step}
            </div>
          );
        })}
        {[0, 1, 2].map((row) => {
          const rowIn = ease(frame, 44 + row * 6, 66 + row * 6);
          return (
            <div
              key={row}
              style={{
                position: "absolute",
                left: 90,
                top: 226 + row * 48,
                width: 480,
                height: 28,
                borderRadius: 999,
                background: "#ffffff",
                border: "1px solid rgba(45,155,220,0.10)",
                opacity: rows * rowIn,
                transform: `translateX(${interpolate(rowIn, [0, 1], [28, 0], clamp)}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 9, width: 96 + row * 38, height: 8, borderRadius: 999, background: "rgba(17,24,39,0.12)" }} />
              <div style={{ position: "absolute", right: 18, top: 8, width: 52, height: 10, borderRadius: 999, background: row === 1 ? "#226eea" : "rgba(34,110,234,0.12)" }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 430,
          right: 430,
          bottom: 92,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(45,155,220,0), rgba(45,155,220,0.30), rgba(115,87,255,0))",
          opacity: panel * interpolate(hold, [0, 1], [0.62, 0.46], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
