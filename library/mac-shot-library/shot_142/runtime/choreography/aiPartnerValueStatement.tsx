import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot142Ease } from "../shot_142/shot142-atomic-motions";

export const SHOT_142_DURATION_FRAMES = 75;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type Props = {
  leading?: string;
  emphasis?: string;
  trailing?: string;
};

export const Shot142AiPartnerValueStatementChoreography: React.FC<Props> = ({
  leading = "It is your all-in-one",
  emphasis = "AI",
  trailing = "partner",
}) => {
  const frame = useCurrentFrame();
  const glow = shot142Ease({ frame, startFrame: 0, endFrame: 30 });
  const line = shot142Ease({ frame, startFrame: 8, endFrame: 34 });
  const ai = shot142Ease({ frame, startFrame: 18, endFrame: 46 });
  const hold = shot142Ease({ frame, startFrame: 52, endFrame: 75 });

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
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
            "radial-gradient(circle at 50% 42%, rgba(34,110,234,0.15), transparent 26%), radial-gradient(circle at 62% 48%, rgba(124,88,255,0.10), transparent 22%), linear-gradient(180deg,#ffffff 0%,#eef7ff 100%)",
          opacity: 0.4 + glow * 0.6,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 248,
          textAlign: "center",
          transform: `scale(${interpolate(hold, [0, 1], [1.018, 1], clamp)})`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 820,
            color: "#1f2937",
            lineHeight: 1.06,
            opacity: line,
            transform: `translateY(${interpolate(line, [0, 1], [22, 0], clamp)}px)`,
          }}
        >
          {leading}
        </div>
        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "baseline",
            gap: 18,
            opacity: line,
          }}
        >
          <span
            style={{
              fontSize: 86,
              fontWeight: 950,
              color: "#226eea",
              letterSpacing: 0,
              textShadow: "0 10px 28px rgba(34,110,234,0.18)",
              transform: `scale(${interpolate(ai, [0, 0.6, 1], [0.82, 1.08, 1], clamp)})`,
              display: "inline-block",
            }}
          >
            {emphasis}
          </span>
          <span
            style={{
              fontSize: 60,
              fontWeight: 860,
              color: "#1f2937",
              transform: `translateY(${interpolate(line, [0, 1], [18, 0], clamp)}px)`,
              display: "inline-block",
            }}
          >
            {trailing}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 390,
          right: 390,
          bottom: 212,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(34,110,234,0), rgba(34,110,234,0.30), rgba(124,88,255,0))",
          opacity: interpolate(hold, [0, 1], [0.5, 0.34], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

