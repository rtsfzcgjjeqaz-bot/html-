import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_11_DURATION_FRAMES = 45;

const lineCount = 28;

export const Shot11ResultComparisonChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const burst = interpolate(frame, [0, 16, 28], [0, 1.08, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const numberOpacity = interpolate(frame, [0, 8], [0, 1], clamp);
  const numberBlur = interpolate(frame, [0, 18], [10, 0], clamp);
  const displayValue = Math.min(150, Math.round(interpolate(frame, [2, 24], [0, 150], clamp)));

  const lineOpacity = interpolate(frame, [0, 12, SHOT_11_DURATION_FRAMES], [0.1, 0.9, 0.5], clamp);
  const lineScale = interpolate(frame, [0, SHOT_11_DURATION_FRAMES], [0.8, 1.25], clamp);
  const lineY = interpolate(frame, [0, SHOT_11_DURATION_FRAMES], [110, -70], clamp);

  const subtitleOpacity = interpolate(frame, [18, 34], [0, 1], clamp);
  const subtitleY = interpolate(frame, [18, 38], [16, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#04050d",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 52%, rgba(116,78,255,0.38), rgba(20,31,80,0.28) 32%, rgba(4,5,13,1) 72%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.5,
          top: height * 0.55,
          width: width,
          height: height,
          opacity: lineOpacity,
          transform: `translate(-50%, -50%) translateY(${lineY}px) scale(${lineScale})`,
          transformOrigin: "center",
        }}
      >
        {Array.from({ length: lineCount }).map((_, index) => {
          const angle = (index / lineCount) * 360;
          const length = index % 3 === 0 ? 450 : 320;
          const widthLine = index % 4 === 0 ? 4 : 2;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: length,
                height: widthLine,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(109,92,255,0), rgba(120,104,255,0.9), rgba(58,208,255,0))",
                transformOrigin: "0 50%",
                transform: `rotate(${angle}deg) translateX(92px)`,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.29,
          textAlign: "center",
          opacity: numberOpacity,
          transform: `scale(${burst})`,
          filter: `blur(${numberBlur}px)`,
          color: "#f7fbff",
          fontSize: 168,
          lineHeight: 0.92,
          fontWeight: 950,
          letterSpacing: 0,
          textShadow: "0 0 36px rgba(103,91,255,0.7), 0 18px 70px rgba(0,0,0,0.6)",
        }}
      >
        {displayValue}%+
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.61,
          textAlign: "center",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          color: "#ffffff",
          fontSize: 30,
          fontWeight: 760,
          lineHeight: 1.2,
          textShadow: "0 8px 28px rgba(0,0,0,0.55)",
        }}
      >
        Core page loading speed
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.36,
          right: width * 0.36,
          top: height * 0.72,
          height: 3,
          borderRadius: 999,
          opacity: interpolate(frame, [22, 38], [0, 1], clamp),
          background: "linear-gradient(90deg, rgba(109,92,255,0), rgba(255,255,255,0.72), rgba(58,208,255,0))",
        }}
      />
    </AbsoluteFill>
  );
};
