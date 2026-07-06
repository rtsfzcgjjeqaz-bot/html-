import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_133_DURATION_FRAMES = 102;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  chipTitle?: string;
  ctaLabel?: string;
  targets?: string[];
};

export const Shot133DistributionActionBarFlowChoreography: React.FC<Props> = ({
  chipTitle = "Launch clip",
  ctaLabel = "Distribute",
  targets = ["Video", "Social", "Email"],
}) => {
  const frame = useCurrentFrame();
  const chip = ease(frame, 0, 34);
  const bar = ease(frame, 18, 48);
  const cta = ease(frame, 38, 70);
  const sweep = ease(frame, 52, 88);
  const pills = ease(frame, 62, 96);
  const hold = ease(frame, 92, 102);
  const pulse = interpolate(cta, [0, 0.58, 1], [0.94, 1.04, 1], clamp);

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
            "radial-gradient(circle at 50% 42%, rgba(45,155,220,0.12), transparent 26%), radial-gradient(circle at 50% 82%, rgba(115,87,255,0.11), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 208,
          top: 104,
          width: 864,
          height: 386,
          borderRadius: 34,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(45,155,220,0.12)",
          boxShadow: "0 38px 110px rgba(40,72,120,0.10)",
          opacity: 0.22 + chip * 0.72,
        }}
      >
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ position: "absolute", left: 46, top: 54 + row * 88, width: 760, height: 58, borderRadius: 18, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(45,155,220,0.08)" }}>
            <div style={{ position: "absolute", left: 18, top: 16, width: 132 + row * 28, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />
            <div style={{ position: "absolute", left: 18, top: 36, width: 88 + row * 20, height: 8, borderRadius: 999, background: "rgba(45,155,220,0.13)" }} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: interpolate(chip, [0, 1], [514, 238], clamp),
          top: interpolate(chip, [0, 1], [238, 548], clamp),
          width: interpolate(chip, [0, 1], [252, 216], clamp),
          height: interpolate(chip, [0, 1], [138, 70], clamp),
          borderRadius: interpolate(chip, [0, 1], [24, 20], clamp),
          background: "#ffffff",
          border: "1px solid rgba(45,155,220,0.18)",
          boxShadow: "0 28px 80px rgba(40,72,120,0.14)",
          transform: `scale(${interpolate(chip, [0, 1], [1.06, 1], clamp)})`,
          zIndex: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 18, top: 16, width: 54, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#4aa9ff,#7357ff)" }} />
        <div style={{ position: "absolute", left: 88, top: 18, fontSize: 17, fontWeight: 840, opacity: chip }}>{chipTitle}</div>
        <div style={{ position: "absolute", left: 88, top: 44, width: 80, height: 8, borderRadius: 999, background: "rgba(45,155,220,0.18)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          right: 190,
          bottom: 72,
          height: 118,
          borderRadius: 32,
          background: "#ffffff",
          border: "1px solid rgba(45,155,220,0.18)",
          boxShadow: "0 34px 100px rgba(40,72,120,0.14)",
          opacity: bar,
          transform: `translateY(${interpolate(bar, [0, 1], [86, 0], clamp)}px)`,
          zIndex: 3,
        }}
      >
        <div style={{ position: "absolute", left: 300, top: 44, width: 256, height: 12, borderRadius: 999, background: "rgba(34,110,234,0.10)", overflow: "hidden" }}>
          <div style={{ width: `${interpolate(sweep, [0, 1], [8, 100], clamp)}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#226eea,#36c5e8)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 28,
            width: 196,
            height: 62,
            borderRadius: 999,
            background: "linear-gradient(135deg,#226eea,#7357ff)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 880,
            opacity: cta,
            transform: `scale(${pulse}) translateY(${interpolate(hold, [0, 1], [0, 2], clamp)}px)`,
            boxShadow: "0 22px 56px rgba(43,121,232,0.26)",
          }}
        >
          {ctaLabel}
        </div>
      </div>
      <div style={{ position: "absolute", left: 510, bottom: 206, display: "flex", gap: 12, opacity: pills, zIndex: 6 }}>
        {targets.slice(0, 3).map((target, index) => (
          <div
            key={target}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: index === 0 ? "#226eea" : "#ffffff",
              color: index === 0 ? "#ffffff" : "#226eea",
              fontSize: 15,
              fontWeight: 820,
              boxShadow: "0 16px 42px rgba(45,90,150,0.12)",
              transform: `translateY(${interpolate(ease(frame, 62 + index * 5, 82 + index * 5), [0, 1], [20, 0], clamp)}px)`,
            }}
          >
            {target}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
