import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const SHOT_147_DURATION_FRAMES = 96;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const panels = [
  { x: 0, y: 0, bg: "linear-gradient(135deg, #1f2937, #111827)", title: "Editorial", accent: "#f472b6" },
  { x: 1, y: 0, bg: "linear-gradient(135deg, #0f766e, #155e75)", title: "Product", accent: "#34d399" },
  { x: 0, y: 1, bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", title: "Gallery", accent: "#2563eb" },
  { x: 1, y: 1, bg: "linear-gradient(135deg, #f8fafc, #e9d5ff)", title: "Interface", accent: "#8b5cf6" },
];

export const Shot147QuadrantGalleryGridRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [0, SHOT_147_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1200,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 20%, rgba(99,102,241,0.08), transparent 20%), radial-gradient(circle at 82% 80%, rgba(16,185,129,0.08), transparent 22%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 298,
          top: 128,
          width: 684,
          height: 464,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          transform: `rotateX(${interpolate(tilt, [0, 1], [6, 0], clamp)}deg) rotateY(${interpolate(tilt, [0, 1], [-4, 0], clamp)}deg) scale(${interpolate(tilt, [0, 1], [0.96, 1], clamp)})`,
          transformStyle: "preserve-3d",
        }}
      >
        {panels.map((panel, index) => {
          const enter = interpolate(frame, [index * 6, 24 + index * 8], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const swap = interpolate(frame, [34 + index * 4, 72 + index * 4], [0, 1], clamp);
          return (
            <div
              key={panel.title}
              style={{
                position: "relative",
                borderRadius: 28,
                background: panel.bg,
                overflow: "hidden",
                border: "1px solid rgba(148,163,184,0.16)",
                boxShadow: "0 26px 60px rgba(15,23,42,0.12)",
                opacity: 0.12 + enter * (0.72 + swap * 0.16),
                transform: `translateY(${interpolate(enter, [0, 1], [28, 0], clamp) + Math.sin((frame + index * 5) / 18) * 3 * (1 - swap)}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 20% 18%, ${panel.accent}22, transparent 34%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 18,
                  fontSize: 18,
                  fontWeight: 850,
                  color: panel.x === 0 && panel.y === 0 ? "#f8fafc" : "#111827",
                }}
              >
                {panel.title}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  bottom: 22,
                  height: 10,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${panel.accent}, rgba(148,163,184,0.12))`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: 62,
                  right: 22,
                  bottom: 48,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
