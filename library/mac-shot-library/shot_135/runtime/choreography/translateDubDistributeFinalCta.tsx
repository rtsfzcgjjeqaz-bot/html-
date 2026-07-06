import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_135_DURATION_FRAMES = 106;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  words?: string[];
  suffix?: string;
};

const sparkPositions = [
  { x: 486, y: 226, s: 0.9, d: 0 },
  { x: 760, y: 216, s: 0.7, d: 6 },
  { x: 820, y: 396, s: 0.8, d: 10 },
  { x: 450, y: 410, s: 0.6, d: 14 },
];

export const Shot135TranslateDubDistributeFinalCtaChoreography: React.FC<Props> = ({
  words = ["Translate", "Dub", "Distribute"],
  suffix = "with AI",
}) => {
  const frame = useCurrentFrame();
  const mark = ease(frame, 38, 78);
  const sparks = ease(frame, 52, 88);
  const hold = ease(frame, 82, 106);

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
            "radial-gradient(circle at 50% 50%, rgba(45,155,220,0.13), transparent 26%), radial-gradient(circle at 50% 72%, rgba(115,87,255,0.10), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 278,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 24,
        }}
      >
        {words.slice(0, 3).map((word, index) => {
          const p = ease(frame, index * 12, 28 + index * 12);
          return (
            <div
              key={word}
              style={{
                fontSize: index === 1 ? 58 : 52,
                lineHeight: 1,
                fontWeight: 880,
                letterSpacing: 0,
                color: index === 1 ? "#226eea" : "#111827",
                opacity: 0.12 + p * 0.88,
                transform: `translateY(${interpolate(p, [0, 1], [34, 0], clamp)}px) scale(${interpolate(p, [0, 1], [0.94, 1], clamp)})`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 362,
          textAlign: "center",
          fontSize: 22,
          fontWeight: 760,
          color: "#2d9bdc",
          opacity: ease(frame, 42, 70),
          transform: `translateY(${interpolate(ease(frame, 42, 70), [0, 1], [16, 0], clamp)}px)`,
        }}
      >
        {suffix}
      </div>
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 176,
          width: 100,
          height: 100,
          borderRadius: 28,
          background: "linear-gradient(135deg,#226eea,#36c5e8)",
          boxShadow: "0 30px 80px rgba(43,121,232,0.24)",
          opacity: mark,
          transform: `rotate(${interpolate(mark, [0, 1], [-16, 0], clamp)}deg) scale(${interpolate(mark, [0, 0.72, 1], [0.62, 1.08, 1], clamp)}) translateY(${interpolate(hold, [0, 1], [0, 3], clamp)}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 29, top: 20, width: 42, height: 58, borderRadius: 20, background: "rgba(255,255,255,0.84)" }} />
        <div style={{ position: "absolute", left: 42, top: 34, width: 16, height: 32, borderRadius: 999, background: "#226eea" }} />
      </div>
      {sparkPositions.map((spark, index) => {
        const p = ease(frame, 52 + spark.d, 76 + spark.d);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: spark.x,
              top: spark.y,
              width: 18,
              height: 18,
              opacity: p * sparks * 0.7,
              transform: `scale(${interpolate(p, [0, 0.5, 1], [0.4, spark.s, 0.72], clamp)}) rotate(${interpolate(p, [0, 1], [0, 45], clamp)}deg)`,
            }}
          >
            <div style={{ position: "absolute", left: 8, top: 0, width: 2, height: 18, borderRadius: 999, background: "#36c5e8" }} />
            <div style={{ position: "absolute", left: 0, top: 8, width: 18, height: 2, borderRadius: 999, background: "#36c5e8" }} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 430,
          right: 430,
          bottom: 118,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(45,155,220,0), rgba(45,155,220,0.34), rgba(115,87,255,0))",
          opacity: mark * interpolate(hold, [0, 1], [0.62, 0.46], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
