import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const SHOT_150_DURATION_FRAMES = 150;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const icons = [
  { label: "Search", color: "#2563eb" },
  { label: "Translate", color: "#7c3aed" },
  { label: "Analyze", color: "#0ea5e9" },
  { label: "Plan", color: "#10b981" },
];

export const Shot150PromptCommandBarMacroChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 42], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const drift = interpolate(frame, [0, SHOT_150_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const caretPulse = interpolate(frame, [24, 78], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #f8fdff 0%, #ecf8ff 58%, #f7fbff 100%)",
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
            "radial-gradient(circle at 22% 18%, rgba(14,165,233,0.10), transparent 20%), radial-gradient(circle at 78% 82%, rgba(59,130,246,0.10), transparent 24%), radial-gradient(circle at 68% 30%, rgba(16,185,129,0.08), transparent 18%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 200,
          top: 240,
          width: 880,
          height: 192,
          borderRadius: 42,
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(125,211,252,0.30)",
          boxShadow: "0 30px 90px rgba(56,189,248,0.16)",
          transform: `translateY(${interpolate(reveal, [0, 1], [26, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.95, 1], clamp)}) translateX(${interpolate(drift, [0, 1], [-12, 10], clamp)}px)`,
          opacity: 0.1 + reveal * 0.9,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 38,
            top: 32,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            color: "#0284c7",
          }}
        >
          PROMPT COMMAND
        </div>
        <div
          style={{
            position: "absolute",
            left: 38,
            top: 72,
            right: 40,
            height: 62,
            borderRadius: 24,
            background: "rgba(240,249,255,0.92)",
            border: "1px solid rgba(125,211,252,0.36)",
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 26,
              background: "#38bdf8",
              boxShadow: "0 0 0 8px rgba(56,189,248,0.10)",
            }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            How it works
          </div>
          <div
            style={{
              width: 3,
              height: 32,
              borderRadius: 999,
              background: "#2563eb",
              opacity: interpolate(caretPulse, [0, 0.5, 1], [0.25, 1, 0.36], clamp),
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            bottom: 28,
            display: "flex",
            gap: 14,
          }}
        >
          {icons.map((icon, index) => {
            const snap = interpolate(frame, [28 + index * 8, 58 + index * 10], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div
                key={icon.label}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: `${icon.color}12`,
                  border: `1px solid ${icon.color}33`,
                  color: "#0f172a",
                  fontSize: 16,
                  fontWeight: 750,
                  opacity: 0.12 + snap * 0.88,
                  transform: `translateY(${interpolate(snap, [0, 1], [12, 0], clamp)}px)`,
                }}
              >
                {icon.label}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
