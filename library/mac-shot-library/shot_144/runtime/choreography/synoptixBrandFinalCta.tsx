import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot144Ease } from "../shot_144/shot144-atomic-motions";

export const SHOT_144_DURATION_FRAMES = 99;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type Props = {
  brandName?: string;
  tagline?: string;
  cta?: string;
};

export const Shot144SynoptixBrandFinalCtaChoreography: React.FC<Props> = ({
  brandName = "Synoptix AI",
  tagline = "Build clearly. Move faster.",
  cta = "Try it today",
}) => {
  const frame = useCurrentFrame();
  const mark = shot144Ease({ frame, startFrame: 0, endFrame: 30 });
  const text = shot144Ease({ frame, startFrame: 18, endFrame: 54 });
  const button = shot144Ease({ frame, startFrame: 34, endFrame: 74 });
  const hold = shot144Ease({ frame, startFrame: 72, endFrame: 99 });

  return (
    <AbsoluteFill
      style={{
        background: "#fbfdff",
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
            "radial-gradient(circle at 50% 42%, rgba(34,110,234,0.12), transparent 24%), radial-gradient(circle at 58% 52%, rgba(124,88,255,0.08), transparent 20%), linear-gradient(180deg,#ffffff 0%,#f3f8ff 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(hold, [0, 1], [1.01, 1], clamp)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 24,
            opacity: mark,
            transform: `translateY(${interpolate(mark, [0, 1], [12, 0], clamp)}px) scale(${interpolate(mark, [0, 1], [0.9, 1], clamp)})`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              width: 42,
              height: 32,
              borderRadius: "10px 10px 24px 10px",
              background: "linear-gradient(135deg, #2fc6ff 0%, #226eea 100%)",
              transform: "rotate(-6deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 22,
              width: 34,
              height: 28,
              borderRadius: "10px 10px 10px 24px",
              background: "linear-gradient(135deg, #7c58ff 0%, #315bff 100%)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            fontWeight: 900,
            opacity: text,
            transform: `translateY(${interpolate(text, [0, 1], [10, 0], clamp)}px)`,
          }}
        >
          {brandName}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 20,
            fontWeight: 720,
            color: "#4b5563",
            opacity: text,
            transform: `translateY(${interpolate(text, [0, 1], [8, 0], clamp)}px)`,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            marginTop: 28,
            minWidth: 184,
            height: 54,
            padding: "0 28px",
            borderRadius: 999,
            background: "#226eea",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 820,
            opacity: button,
            boxShadow: "0 18px 40px rgba(34,110,234,0.22)",
            transform: `scale(${interpolate(button, [0, 1], [0.92, 1], clamp)})`,
          }}
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

