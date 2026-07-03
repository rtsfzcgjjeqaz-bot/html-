import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_127_DURATION_FRAMES = 66;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  brand?: string;
  verb?: string;
  words?: string[];
};

const activeWord = (frame: number, words: string[]) => {
  if (frame < 20) return "";
  if (frame < 36) return words[0] ?? "Books";
  if (frame < 52) return words[1] ?? "Audio";
  return words[2] ?? words[1] ?? "Audio";
};

export const Shot127LangeaseKineticTextHookChoreography: React.FC<Props> = ({
  brand = "zelios",
  verb = "Turn",
  words = ["Books", "Audio", "Any file"],
}) => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 14);
  const brandIn = ease(frame, 0, 24);
  const verbIn = ease(frame, 8, 24);
  const wordIn = ease(frame, 18, 34);
  const blue = ease(frame, 28, 58);
  const hold = ease(frame, 54, 66);
  const word = activeWord(frame, words);
  const swapPulse =
    frame < 20 ? 0 : frame < 54 ? interpolate(frame % 16, [0, 4, 12, 15], [0, 1, 1, 0.35], clamp) : 1;

  return (
    <AbsoluteFill
      style={{
        background: "#f8f8ff",
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
            "radial-gradient(circle at 42% 58%, rgba(75, 166, 255, 0.12), transparent 22%), linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)",
          opacity: stage,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 42,
          top: 28,
          fontSize: 17,
          fontWeight: 720,
          color: "rgba(17, 24, 39, 0.08)",
          opacity: brandIn,
          letterSpacing: 0,
        }}
      >
        {brand}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 274,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 14,
          opacity: Math.max(verbIn, wordIn),
          transform: `translateY(${interpolate(verbIn, [0, 1], [18, 0], clamp)}px) scale(${interpolate(hold, [0, 1], [1, 0.985], clamp)})`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: 0,
            color: `rgba(54, 153, 222, ${interpolate(blue, [0, 1], [0.72, 0.98], clamp)})`,
          }}
        >
          {verb}
        </span>
        <span
          style={{
            fontSize: 49,
            lineHeight: 1,
            fontWeight: 620,
            letterSpacing: 0,
            color: "#111827",
            opacity: swapPulse,
            transform: `translateX(${interpolate(wordIn, [0, 1], [10, 0], clamp)}px)`,
          }}
        >
          {word}
        </span>
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 420,
          right: 420,
          top: 370,
          height: 2,
          borderRadius: 999,
          background: "linear-gradient(90deg, transparent, rgba(57, 164, 238, 0.35), transparent)",
          opacity: interpolate(blue, [0, 1], [0, 0.55], clamp),
          transform: `scaleX(${interpolate(blue, [0, 1], [0.35, 1], clamp)})`,
        }}
      />
    </AbsoluteFill>
  );
};
