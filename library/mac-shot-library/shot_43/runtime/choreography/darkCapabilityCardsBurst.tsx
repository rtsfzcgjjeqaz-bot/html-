import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_43_DURATION_FRAMES = 171;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const cards = [
  { title: "Analyze data", body: "Find risks and next actions", x: 0.12, y: 0.32 },
  { title: "Write code", body: "Generate clean UI modules", x: 0.31, y: 0.25 },
  { title: "Compare plans", body: "Surface the strongest choice", x: 0.5, y: 0.32 },
  { title: "Role play", body: "Test scenarios before launch", x: 0.39, y: 0.55 },
];

export const Shot43DarkCapabilityCardsBurstChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stage = interpolate(frame, [0, 34], [0, 1], clamp);
  const primary = interpolate(frame, [64, 124], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dim = interpolate(frame, [96, 142], [0, 1], clamp);
  const badge = interpolate(frame, [128, 156, 171], [0, 1, 0.92], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#08090d",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1500,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: stage,
          background:
            "radial-gradient(circle at 34% 32%, rgba(104,77,244,0.2), transparent 30%), radial-gradient(circle at 70% 64%, rgba(217,75,191,0.14), transparent 28%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.12,
          top: height * 0.12,
          color: "#ffffff",
          opacity: interpolate(frame, [8, 42, 124], [0, 1, 0.28], clamp),
          transform: `translateY(${interpolate(stage, [0, 1], [16, 0], clamp)}px)`,
          fontSize: 34,
          fontWeight: 780,
          letterSpacing: 0,
        }}
      >
        How can I help you today?
      </div>

      {cards.map((card, index) => {
        const enter = interpolate(frame, [18 + index * 7, 78 + index * 7], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const isPrimary = index === 2;
        const push = isPrimary ? primary : 0;
        const opacity = isPrimary
          ? interpolate(push, [0, 1], [0.72, 1], clamp)
          : interpolate(dim, [0, 1], [0.72, 0.32], clamp);
        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: width * card.x,
              top: height * card.y,
              width: isPrimary ? width * 0.25 : width * 0.2,
              height: isPrimary ? height * 0.28 : height * 0.22,
              opacity: opacity * enter,
              filter: !isPrimary ? `blur(${interpolate(dim, [0, 1], [0, 1.4], clamp)}px)` : "none",
              transform: `translateX(${interpolate(enter, [0, 1], [-80, 0], clamp)}px) rotateY(${interpolate(enter, [0, 1], [12, 0], clamp)}deg) scale(${isPrimary ? interpolate(push, [0, 1], [0.98, 1.08], clamp) : 1})`,
              transformOrigin: "center",
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(25,27,36,0.96), rgba(15,16,23,0.96))",
              border: `1px solid rgba(255,255,255,${isPrimary ? 0.16 : 0.1})`,
              boxShadow: isPrimary
                ? `0 34px 100px rgba(104,77,244,${interpolate(push, [0, 1], [0.12, 0.28], clamp)})`
                : "0 20px 70px rgba(0,0,0,0.24)",
              padding: 22,
            }}
          >
            <div style={{ color: "#ffffff", fontSize: isPrimary ? 24 : 18, fontWeight: 820, lineHeight: 1.08 }}>
              {card.title}
            </div>
            <div style={{ marginTop: 12, color: "rgba(255,255,255,0.62)", fontSize: isPrimary ? 14 : 12, fontWeight: 640, lineHeight: 1.35 }}>
              {card.body}
            </div>
            <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 8, borderRadius: 999, background: isPrimary ? "linear-gradient(90deg, #684df4, #d94bbf)" : "rgba(255,255,255,0.12)" }} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          right: width * 0.16,
          top: height * 0.24,
          width: 250,
          height: 250,
          opacity: badge,
          transform: `scale(${interpolate(badge, [0, 0.72, 1], [0.84, 1.04, 1], clamp)})`,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: `0 0 80px rgba(104,77,244,${interpolate(badge, [0, 1], [0, 0.42], clamp)}), inset 0 0 60px rgba(217,75,191,0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 44,
          fontWeight: 860,
        }}
      >
        Ultra 1.0
      </div>
    </AbsoluteFill>
  );
};
