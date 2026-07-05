import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_128_DURATION_FRAMES = 87;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  leftPhrase?: string;
  rightPhrase?: string;
  cardLabel?: string;
  subLabel?: string;
};

export const Shot128BookAudioDropTransformChoreography: React.FC<Props> = ({
  leftPhrase = "Any language",
  rightPhrase = "Instantly",
  cardLabel = "Folder",
  subLabel = "Audio + Book",
}) => {
  const frame = useCurrentFrame();
  const words = ease(frame, 0, 34);
  const card = ease(frame, 18, 48);
  const stack = ease(frame, 28, 58);
  const cursor = ease(frame, 44, 70);
  const surface = ease(frame, 56, 86);
  const hold = ease(frame, 78, 87);

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
            "radial-gradient(circle at 55% 57%, rgba(64, 151, 255, 0.13), transparent 20%), linear-gradient(180deg, #ffffff 0%, #f4f7ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 238,
          top: 262,
          fontSize: 31,
          lineHeight: 1,
          fontWeight: 520,
          opacity: words,
          transform: `translateX(${interpolate(words, [0, 1], [24, 0], clamp)}px)`,
        }}
      >
        <span style={{ color: "#2d9bdc" }}>{leftPhrase.split(" ")[0]}</span>{" "}
        {leftPhrase.split(" ").slice(1).join(" ")}
      </div>
      <div
        style={{
          position: "absolute",
          right: 230,
          top: 262,
          fontSize: 31,
          lineHeight: 1,
          fontWeight: 520,
          color: "#2d9bdc",
          opacity: words,
          transform: `translateX(${interpolate(words, [0, 1], [-24, 0], clamp)}px)`,
        }}
      >
        {rightPhrase}
      </div>
      <div
        style={{
          position: "absolute",
          left: 456,
          top: 438,
          width: 372,
          height: 106,
          borderRadius: 18,
          border: "2px solid rgba(58, 151, 225, 0.24)",
          background: "rgba(255,255,255,0.68)",
          opacity: surface,
          transform: `translateY(${interpolate(surface, [0, 1], [42, 0], clamp)}) scaleX(${interpolate(surface, [0, 1], [0.86, 1], clamp)})`,
          boxShadow: "0 24px 60px rgba(49, 93, 138, 0.08)",
        }}
      />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 580 + index * 14,
            top: 196 - index * 8,
            width: 94,
            height: 72,
            borderRadius: 14,
            background: "#ffffff",
            border: "1px solid rgba(60, 128, 219, 0.18)",
            opacity: stack * (0.42 + index * 0.18),
            transform: `rotate(${interpolate(stack, [0, 1], [-8, 8 + index * 4], clamp)}deg) translateY(${interpolate(stack, [0, 1], [20, 0], clamp)}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 566,
          top: 204,
          width: 148,
          height: 118,
          borderRadius: 20,
          background: "linear-gradient(180deg, #4aa9ff 0%, #226eea 100%)",
          boxShadow: "0 34px 70px rgba(43, 121, 232, 0.28)",
          opacity: card,
          transform: `translateY(${interpolate(card, [0, 1], [40, interpolate(hold, [0, 1], [0, 8], clamp)], clamp)}px) scale(${interpolate(card, [0, 1], [0.72, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 18, top: 18, width: 34, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.72)" }} />
        <div style={{ position: "absolute", left: 18, bottom: 30, fontSize: 18, fontWeight: 780, color: "#ffffff" }}>
          {cardLabel}
        </div>
        <div style={{ position: "absolute", left: 18, bottom: 14, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>
          {subLabel}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 696,
          top: 304,
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "#ffffff",
          boxShadow: "0 12px 26px rgba(27, 73, 128, 0.18)",
          opacity: cursor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2d76e5",
          fontSize: 19,
          fontWeight: 900,
          transform: `translate(${interpolate(cursor, [0, 1], [28, 0], clamp)}px, ${interpolate(cursor, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        ↗
      </div>
    </AbsoluteFill>
  );
};
