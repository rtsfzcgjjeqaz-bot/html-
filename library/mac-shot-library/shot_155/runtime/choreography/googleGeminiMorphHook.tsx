import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_155_DURATION_FRAMES = 82;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const orbitNodes = [
  { color: "#4285F4", startX: -270, startY: -124, endX: -78, endY: -38, scale: 1.02 },
  { color: "#EA4335", startX: 252, startY: -142, endX: 78, endY: -38, scale: 0.96 },
  { color: "#FBBC05", startX: -236, startY: 150, endX: -78, endY: 40, scale: 0.98 },
  { color: "#34A853", startX: 276, startY: 164, endX: 78, endY: 40, scale: 1.04 },
];

export const Shot155GoogleGeminiMorphHookChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const stageIn = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.95 },
  });
  const orbitIn = interpolate(frame, [4, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const morphResolve = interpolate(frame, [20, 48], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.25, 0.9, 0.2, 1),
  });
  const copyIn = interpolate(frame, [30, 60], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const settle = interpolate(frame, [48, 70], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.85, 0.2, 1),
  });
  const hold = interpolate(frame, [70, SHOT_155_DURATION_FRAMES], [0, 1], clamp);
  const cameraPush = interpolate(frame, [0, SHOT_155_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 44%, rgba(36,99,235,0.16), transparent 20%), radial-gradient(circle at 18% 22%, rgba(251,188,5,0.09), transparent 18%), radial-gradient(circle at 82% 72%, rgba(52,168,83,0.12), transparent 22%), linear-gradient(180deg, #030712 0%, #07111f 52%, #02060d 100%)",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        color: "#f8fbff",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28 + stageIn * 0.2,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          transform: `scale(${1.02 + cameraPush * 0.035})`,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -120,
          background:
            "radial-gradient(circle at 28% 36%, rgba(66,133,244,0.22), transparent 20%), radial-gradient(circle at 74% 32%, rgba(234,67,53,0.18), transparent 18%), radial-gradient(circle at 34% 78%, rgba(251,188,5,0.16), transparent 16%), radial-gradient(circle at 76% 72%, rgba(52,168,83,0.18), transparent 18%)",
          filter: "blur(38px)",
          opacity: 0.44 + stageIn * 0.38,
          transform: `translateY(${interpolate(cameraPush, [0, 1], [0, -12], clamp)}px) scale(${1 + cameraPush * 0.03})`,
        }}
      />

      {orbitNodes.map((node, index) => {
        const nodeEnter = interpolate(frame, [index * 2, 26 + index * 3], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const pulse = 1 + Math.sin((frame + index * 6) / 9) * 0.018 * (1 - hold * 0.8);
        const x = interpolate(nodeEnter, [0, 1], [node.startX, node.endX], clamp);
        const y = interpolate(nodeEnter, [0, 1], [node.startY, node.endY], clamp);
        const rotate = interpolate(morphResolve, [0, 1], [index % 2 === 0 ? -18 : 18, 0], clamp);
        const opacity = interpolate(morphResolve, [0, 0.72, 1], [0.78, 1, 0.94], clamp);
        const widthNode = interpolate(morphResolve, [0, 1], [120, 162], clamp);
        const heightNode = interpolate(morphResolve, [0, 1], [120, 86], clamp);

        return (
          <div
            key={node.color}
            style={{
              position: "absolute",
              left: width / 2 - widthNode / 2,
              top: height / 2 - heightNode / 2 - 24,
              width: widthNode,
              height: heightNode,
              borderRadius: 999,
              opacity,
              background: `linear-gradient(135deg, ${node.color}, rgba(255,255,255,0.92))`,
              boxShadow: `0 0 42px ${node.color}44, 0 18px 48px rgba(2,6,23,0.42)`,
              filter: "blur(0.2px)",
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${node.scale * pulse})`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: width / 2 - 212,
          top: height / 2 - 136,
          width: 424,
          height: 224,
          borderRadius: 44,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
          opacity: 0.14 + morphResolve * 0.24,
          transform: `translateY(${interpolate(settle, [0, 1], [12, 0], clamp)}px) scale(${0.96 + morphResolve * 0.04})`,
          backdropFilter: "blur(10px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 300,
          top: height / 2 + 72,
          width: 600,
          textAlign: "center",
          opacity: copyIn,
          transform: `translateY(${interpolate(copyIn, [0, 1], [24, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2.1,
            color: "rgba(214,228,255,0.82)",
            marginBottom: 12,
          }}
        >
          GOOGLE AI ERA
        </div>
        <div
          style={{
            fontSize: 52,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: 0,
            textShadow: "0 10px 34px rgba(0,0,0,0.42)",
          }}
        >
          Gemini comes into focus
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 154,
          top: height / 2 + 168,
          width: 308,
          height: 48,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: 0.04 + settle * 0.88,
          transform: `translateY(${interpolate(settle, [0, 1], [14, 0], clamp)}px)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4285F4" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EA4335" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FBBC05" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34A853" }} />
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "rgba(248,251,255,0.9)",
            marginLeft: 8,
          }}
        >
          Multimodal assistant launch
        </div>
      </div>
    </AbsoluteFill>
  );
};
