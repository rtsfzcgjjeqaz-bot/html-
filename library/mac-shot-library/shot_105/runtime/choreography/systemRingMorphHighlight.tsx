import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_105_DURATION_FRAMES = 156;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
  eyebrow?: string;
};

export const Shot105SystemRingMorphHighlightChoreography: React.FC<Props> = ({
  title = "With a system",
  eyebrow = "Designed around focus",
}) => {
  const frame = useCurrentFrame();
  const gather = ease(frame, 0, 34);
  const ring = ease(frame, 18, 72);
  const nodes = ease(frame, 46, 88);
  const text = ease(frame, 56, 108);
  const morph = ease(frame, 92, 156);

  const ringScaleY = interpolate(morph, [0, 1], [1, 0.68], clamp);
  const ringRadius = interpolate(ring, [0, 1], [108, 226], clamp);
  const diamond = interpolate(morph, [0, 1], [0, 1], clamp);

  const nodePoints = [
    { x: 360, y: 388 - diamond * 70 },
    { x: 588 - diamond * 70, y: 640 },
    { x: 360, y: 892 + diamond * 4 },
    { x: 132 + diamond * 70, y: 640 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#020207",
        overflow: "hidden",
        color: "#f8fbff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(13,18,58,0.84), transparent 38%), radial-gradient(circle at 50% 62%, rgba(0,235,204,0.12), transparent 24%), #020207",
        }}
      />

      {[0, 1, 2, 3].map((index) => {
        const angle = index * 88 + frame * 1.3;
        const p = ease(frame, index * 5, 34 + index * 5);
        const x = 360 + Math.cos((angle * Math.PI) / 180) * interpolate(gather, [0, 1], [260, ringRadius], clamp);
        const y = 640 + Math.sin((angle * Math.PI) / 180) * interpolate(gather, [0, 1], [310, ringRadius * ringScaleY], clamp);
        return (
          <div
            key={index}
            aria-hidden
            style={{
              position: "absolute",
              left: x - 7,
              top: y - 7,
              width: 14,
              height: 14,
              borderRadius: 99,
              background: index % 2 === 0 ? "#ffffff" : "#2c5bff",
              opacity: p,
              boxShadow: index % 2 === 0 ? "0 0 18px rgba(255,255,255,0.8)" : "0 0 22px rgba(0,80,255,0.9)",
            }}
          />
        );
      })}

      <svg width="720" height="1280" viewBox="0 0 720 1280" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="systemRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d43ff" />
            <stop offset="45%" stopColor="#13f2d1" />
            <stop offset="72%" stopColor="#12c878" />
            <stop offset="100%" stopColor="#2034ff" />
          </linearGradient>
          <filter id="systemGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse
          cx="360"
          cy="640"
          rx={ringRadius}
          ry={ringRadius * ringScaleY}
          fill="none"
          stroke="url(#systemRingGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="880"
          strokeDashoffset={interpolate(ring, [0, 1], [880, 0], clamp)}
          opacity={interpolate(ring, [0, 1], [0, 0.92], clamp) * (1 - diamond * 0.55)}
          filter="url(#systemGlow)"
        />
        <path
          d={`M ${nodePoints[0].x} ${nodePoints[0].y} C ${470} ${500}, ${570} ${530}, ${nodePoints[1].x} ${nodePoints[1].y} C ${570} ${760}, ${470} ${840}, ${nodePoints[2].x} ${nodePoints[2].y} C ${250} ${840}, ${150} ${760}, ${nodePoints[3].x} ${nodePoints[3].y} C ${150} ${530}, ${250} ${500}, ${nodePoints[0].x} ${nodePoints[0].y}`}
          fill="none"
          stroke="url(#systemRingGradient)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={diamond}
          filter="url(#systemGlow)"
        />
      </svg>

      {nodePoints.map((point, index) => {
        const p = ease(frame, 46 + index * 6, 78 + index * 6);
        return (
          <div
            key={index}
            aria-hidden
            style={{
              position: "absolute",
              left: point.x - 9,
              top: point.y - 9,
              width: 18,
              height: 18,
              borderRadius: 99,
              background: "#ffffff",
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.5, 1], clamp)})`,
              boxShadow: "0 0 18px rgba(255,255,255,0.82)",
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 590,
          textAlign: "center",
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [18, 0], clamp)}px) scale(${interpolate(morph, [0, 1], [1, 0.98], clamp)})`,
        }}
      >
        <div style={{ fontSize: 28, lineHeight: 1.08, fontWeight: 780, letterSpacing: 0 }}>{title}</div>
        <div style={{ marginTop: 14, color: "rgba(248,251,255,0.52)", fontSize: 13, lineHeight: 1.35, fontWeight: 540 }}>{eyebrow}</div>
      </div>
    </AbsoluteFill>
  );
};
