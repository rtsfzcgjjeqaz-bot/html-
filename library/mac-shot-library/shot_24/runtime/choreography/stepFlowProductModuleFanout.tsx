import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_24_DURATION_FRAMES = 146;

const modules = [
  { label: "Planning", x: -360, y: -150, color: "#6d5cff" },
  { label: "Resources", x: -430, y: 24, color: "#3ad0ff" },
  { label: "Quality", x: -268, y: 174, color: "#22c55e" },
  { label: "Timeline", x: 242, y: -174, color: "#f59e42" },
  { label: "Delivery", x: 330, y: 36, color: "#8b5cf6" },
];

export const Shot24StepFlowChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width * 0.56;
  const cy = height * 0.53;

  const coreOpacity = interpolate(frame, [0, 22], [0, 1], clamp);
  const coreScale = interpolate(frame, [0, 42], [0.88, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const coreY = interpolate(frame, [0, 42], [24, 0], clamp);
  const lineProgress = interpolate(frame, [58, 118], [0, 1], clamp);
  const lineOpacity = interpolate(frame, [58, 88], [0, 0.7], clamp);

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
            "radial-gradient(circle at 58% 52%, rgba(64,82,180,0.34), rgba(5,7,13,1) 58%), linear-gradient(135deg, #080b14, #05070d)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.1,
          top: height * 0.12,
          color: "#f8fbff",
          fontSize: 34,
          lineHeight: 1.12,
          fontWeight: 850,
          opacity: interpolate(frame, [8, 34], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [8, 34], [18, 0], clamp)}px)`,
        }}
      >
        Module breakdown
        <div
          style={{
            color: "rgba(248,251,255,0.62)",
            fontSize: 18,
            lineHeight: 1.28,
            fontWeight: 640,
            marginTop: 12,
            maxWidth: 360,
          }}
        >
          Core product capabilities connected to one operating flow.
        </div>
      </div>

      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: lineOpacity,
          overflow: "visible",
        }}
      >
        {modules.map((module, index) => {
          const endX = cx + module.x * 0.62;
          const endY = cy + module.y * 0.62;
          const startX = cx;
          const startY = cy;
          const visibleX = startX + (endX - startX) * lineProgress;
          const visibleY = startY + (endY - startY) * lineProgress;
          return (
            <line
              key={module.label}
              x1={startX}
              y1={startY}
              x2={visibleX}
              y2={visibleY}
              stroke={module.color}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.58 + index * 0.04}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: cx - 148,
          top: cy - 86 + coreY,
          width: 296,
          height: 172,
          opacity: coreOpacity,
          transform: `scale(${coreScale}) rotateY(-8deg) rotateX(4deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 36,
            background: "linear-gradient(135deg, #1d2435, #101624)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 36px 120px rgba(61,87,255,0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 38,
            top: 38,
            right: 38,
            height: 42,
            borderRadius: 18,
            background: "linear-gradient(90deg, rgba(109,92,255,0.92), rgba(58,208,255,0.58))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 48,
            bottom: 38,
            right: 48,
            color: "#f8fbff",
            fontSize: 23,
            fontWeight: 820,
            textAlign: "center",
          }}
        >
          Core System
        </div>
      </div>

      {modules.map((module, index) => {
        const start = 28 + index * 8;
        const enter = interpolate(frame, [start, start + 34], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const orbit = interpolate(Math.sin((frame + index * 9) / 18), [-1, 1], [-1, 1], clamp);
        const x = cx + module.x * enter + orbit * 12;
        const y = cy + module.y * enter + orbit * 8;
        const opacity = interpolate(enter, [0, 0.2, 1], [0, 1, 1], clamp);
        return (
          <div
            key={module.label}
            style={{
              position: "absolute",
              left: x - 86,
              top: y - 38,
              width: 172,
              height: 76,
              opacity,
              borderRadius: 18,
              background: "rgba(13,19,32,0.88)",
              border: `1px solid ${module.color}`,
              boxShadow: `0 18px 58px rgba(0,0,0,0.28), 0 0 28px ${module.color}44`,
              color: "#f8fbff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 760,
              transform: `translateZ(${80 + index * 14}px) rotateY(${interpolate(enter, [0, 1], [10, 0], clamp)}deg)`,
            }}
          >
            {module.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
