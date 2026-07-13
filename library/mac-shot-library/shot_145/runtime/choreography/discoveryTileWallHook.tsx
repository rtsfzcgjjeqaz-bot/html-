import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const SHOT_145_DURATION_FRAMES = 108;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const tiles = [
  { x: -458, y: -182, w: 158, h: 108, color: "#eef6ff", accent: "#1d4ed8", label: "Agent search" },
  { x: -272, y: -196, w: 140, h: 92, color: "#ffffff", accent: "#7c3aed", label: "Gemini Live" },
  { x: -98, y: -188, w: 132, h: 88, color: "#f9fafb", accent: "#059669", label: "Veo 3" },
  { x: 82, y: -194, w: 156, h: 96, color: "#ffffff", accent: "#0ea5e9", label: "Search Lab" },
  { x: 284, y: -186, w: 166, h: 102, color: "#eefbf6", accent: "#16a34a", label: "Shopping AI" },
  { x: -492, y: -42, w: 136, h: 84, color: "#ffffff", accent: "#f97316", label: "Checkout" },
  { x: -324, y: -30, w: 176, h: 116, color: "#f8fbff", accent: "#2563eb", label: "AI overviews" },
  { x: -106, y: -18, w: 150, h: 90, color: "#ffffff", accent: "#1d4ed8", label: "Project Manager" },
  { x: 82, y: -22, w: 144, h: 98, color: "#fbfbff", accent: "#7c3aed", label: "XR spaces" },
  { x: 278, y: -18, w: 188, h: 116, color: "#ffffff", accent: "#0f766e", label: "Suggestions" },
  { x: -430, y: 132, w: 164, h: 96, color: "#f8fbff", accent: "#2563eb", label: "Imagen 4" },
  { x: -218, y: 136, w: 180, h: 102, color: "#ffffff", accent: "#059669", label: "Agent Mode" },
  { x: 14, y: 130, w: 168, h: 100, color: "#eef6ff", accent: "#1d4ed8", label: "Analysis" },
  { x: 228, y: 128, w: 146, h: 92, color: "#ffffff", accent: "#7c3aed", label: "Cards" },
];

export const Shot145DiscoveryTileWallHookChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const focalIn = interpolate(frame, [18, 62], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const settle = interpolate(frame, [40, 86], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.85, 0.2, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #fbfdff 0%, #f3f8ff 62%, #ffffff 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(37,99,235,0.08), transparent 22%), radial-gradient(circle at 82% 16%, rgba(16,185,129,0.06), transparent 20%), radial-gradient(circle at 14% 72%, rgba(124,58,237,0.06), transparent 18%)",
        }}
      />
      {tiles.map((tile, index) => {
        const enter = interpolate(frame, [index * 2, 26 + index * 3], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const hover = Math.sin((frame + index * 4) / 18) * (2 + (index % 3));
        const offsetX = interpolate(enter, [0, 1], [tile.x * 0.2, tile.x], clamp);
        const offsetY = interpolate(enter, [0, 1], [tile.y * 0.28 + 36, tile.y + hover * (1 - settle)], clamp);
        const scale = interpolate(enter, [0, 1], [0.7, 1], clamp);
        return (
          <div
            key={tile.label}
            style={{
              position: "absolute",
              left: 640 - tile.w / 2,
              top: 360 - tile.h / 2,
              width: tile.w,
              height: tile.h,
              borderRadius: 24,
              background: tile.color,
              border: "1px solid rgba(148,163,184,0.18)",
              boxShadow: "0 20px 48px rgba(30,41,59,0.08)",
              opacity: 0.16 + enter * 0.84,
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                width: 30,
                height: 30,
                borderRadius: 10,
                background: `${tile.accent}22`,
                border: `1px solid ${tile.accent}44`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 54,
                top: 18,
                fontSize: 14,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {tile.label}
            </div>
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 18,
                bottom: 20,
                height: 10,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${tile.accent}aa, rgba(148,163,184,0.14))`,
              }}
            />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 430,
          top: 280,
          width: 420,
          height: 160,
          borderRadius: 32,
          background: "rgba(255,255,255,0.72)",
          boxShadow: "0 24px 60px rgba(37,99,235,0.10)",
          border: "1px solid rgba(37,99,235,0.12)",
          opacity: focalIn * 0.92,
          transform: `translateY(${interpolate(focalIn, [0, 1], [18, 0], clamp)}px) scale(${interpolate(focalIn, [0, 1], [0.96, 1], clamp)})`,
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 34,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: "#2563eb",
          }}
        >
          AI DISCOVERY
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 68,
            fontSize: 44,
            lineHeight: 1.02,
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          Explore more
        </div>
      </div>
    </AbsoluteFill>
  );
};
