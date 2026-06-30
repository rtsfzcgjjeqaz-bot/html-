import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_93_DURATION_FRAMES = 75;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const Shot93NoMoreFormsDocumentStackChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const headline = ease(frame, 0, 18);
  const doc = ease(frame, 8, 32);
  const subcopy = ease(frame, 18, 38);
  const recede = ease(frame, 38, 64);
  const hold = ease(frame, 60, 75);

  return (
    <AbsoluteFill
      style={{
        background: "#030715",
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
            "radial-gradient(circle at 44% 18%, rgba(66,104,255,0.36), transparent 30%), radial-gradient(circle at 28% 82%, rgba(54,93,180,0.24), transparent 38%), linear-gradient(180deg, #07143a 0%, #030715 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 430,
          top: 334,
          width: 860,
          height: 280,
          borderRadius: "50%",
          borderTop: "2px solid rgba(76,109,255,0.22)",
          opacity: interpolate(headline, [0, 1], [0, 0.82], clamp),
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 84,
          width: "100%",
          textAlign: "center",
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [18, 0], clamp)}) scale(${interpolate(hold, [0, 1], [1.012, 1], clamp)})`,
          fontSize: 34,
          fontWeight: 860,
          letterSpacing: 0,
          color: "#edf4ff",
          textShadow: "0 0 26px rgba(98,126,255,0.42)",
        }}
      >
        No more time-consuming forms
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 106,
          top: 180,
          width: 212,
          height: 272,
          opacity: doc * interpolate(recede, [0, 1], [1, 0.16], clamp),
          transform: `translateY(${interpolate(doc, [0, 1], [38, 0], clamp) + interpolate(recede, [0, 1], [0, 28], clamp)}px) scale(${interpolate(recede, [0, 1], [1, 0.86], clamp)})`,
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(56,93,214,0.34), rgba(34,64,150,0.14))",
          border: "1px solid rgba(123,158,255,0.22)",
          boxShadow: "0 0 48px rgba(74,110,255,0.26)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 54,
            height: 54,
            background: "rgba(132,162,255,0.12)",
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
        />
        {[0, 1, 2, 3].map((line) => (
          <div
            key={line}
            style={{
              position: "absolute",
              left: 34,
              top: 72 + line * 32,
              width: 118 - line * 10,
              height: 7,
              borderRadius: 99,
              opacity: doc,
              background: "rgba(185,204,255,0.22)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 480,
          width: "100%",
          textAlign: "center",
          opacity: subcopy * interpolate(recede, [0, 1], [1, 0.3], clamp),
          transform: `translateY(${interpolate(subcopy, [0, 1], [12, 0], clamp)}px)`,
          fontSize: 15,
          fontWeight: 660,
          color: "rgba(235,242,255,0.68)",
        }}
      >
        just think, type, and it is done
      </div>
    </AbsoluteFill>
  );
};
