import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_104_DURATION_FRAMES = 96;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  title?: string;
  subtitle?: string;
};

export const Shot104LuminousLineBeginHookChoreography: React.FC<Props> = ({
  title = "Let's begin",
  subtitle = "A system starts with one clear signal",
}) => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 18);
  const stem = ease(frame, 8, 46);
  const dots = ease(frame, 28, 58);
  const orbit = ease(frame, 34, 76);
  const text = ease(frame, 52, 88);
  const settle = ease(frame, 76, 96);

  const stemHeight = interpolate(stem, [0, 1], [72, 420], clamp);
  const glowScale = interpolate(stage, [0, 1], [0.54, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#020207",
        overflow: "hidden",
        color: "#f7f8ff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(stage, [0, 1], [0.28, 1], clamp),
          background:
            "radial-gradient(circle at 50% 78%, rgba(0,42,255,0.54), transparent 16%), radial-gradient(circle at 50% 60%, rgba(10,229,255,0.20), transparent 9%), linear-gradient(180deg, #020207 0%, #03030a 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 182,
          top: 890,
          width: 356,
          height: 42,
          borderRadius: "50%",
          background: "linear-gradient(90deg, transparent, rgba(0,64,255,0.96), rgba(23,240,255,0.78), rgba(0,64,255,0.84), transparent)",
          filter: "blur(12px)",
          opacity: interpolate(stage, [0, 1], [0.42, 0.95], clamp),
          transform: `scaleX(${glowScale}) scaleY(${interpolate(settle, [0, 1], [1, 0.82], clamp)})`,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 358,
          bottom: 370,
          width: 4,
          height: stemHeight,
          borderRadius: 999,
          background: "linear-gradient(180deg, #ffffff 0%, #e6f8ff 30%, #1d66ff 100%)",
          boxShadow: "0 0 18px rgba(64,123,255,0.80), 0 0 42px rgba(0,76,255,0.48)",
          transformOrigin: "bottom center",
        }}
      />

      {[0, 1].map((index) => {
        const p = ease(frame, 28 + index * 10, 52 + index * 10);
        return (
          <div
            key={index}
            aria-hidden
            style={{
              position: "absolute",
              left: 353,
              top: index === 0 ? 456 : 816,
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ffffff",
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.45, 1], clamp)})`,
              boxShadow: "0 0 18px rgba(255,255,255,0.7)",
            }}
          />
        );
      })}

      <svg
        width="720"
        height="1280"
        viewBox="0 0 720 1280"
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(orbit, [0, 1], [0, 0.82], clamp),
        }}
      >
        <path
          d="M 314 835 C 226 710, 292 602, 356 604 C 446 608, 420 748, 330 742"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="440"
          strokeDashoffset={interpolate(orbit, [0, 1], [440, 0], clamp)}
        />
        <path
          d="M 376 496 C 424 536, 426 606, 370 648"
          fill="none"
          stroke="rgba(47,101,255,0.42)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={interpolate(orbit, [0, 1], [220, 0], clamp)}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          top: 262,
          textAlign: "center",
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 28, lineHeight: 1.08, fontWeight: 760, letterSpacing: 0 }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 16,
            color: "rgba(247,248,255,0.56)",
            fontSize: 14,
            lineHeight: 1.35,
            fontWeight: 520,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
