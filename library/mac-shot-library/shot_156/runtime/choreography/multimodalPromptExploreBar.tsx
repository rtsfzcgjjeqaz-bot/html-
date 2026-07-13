import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

export const SHOT_156_DURATION_FRAMES = 117;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const chips = [
  {label: "Break it down", width: 126},
  {label: "Image", width: 82},
  {label: "Generate", width: 108},
  {label: "Voice", width: 78},
];

export const Shot156MultimodalPromptExploreBarChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const darkStage = ease(frame, 0, 18);
  const bar = ease(frame, 8, 32);
  const chipsReveal = ease(frame, 14, 44);
  const bridge = ease(frame, 40, 62);
  const resultSwap = ease(frame, 56, 96);
  const hold = ease(frame, 96, SHOT_156_DURATION_FRAMES);
  const drift = interpolate(frame, [0, SHOT_156_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0d1017",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - resultSwap,
          background:
            "radial-gradient(circle at 24% 22%, rgba(99,102,241,0.18), transparent 22%), radial-gradient(circle at 70% 28%, rgba(34,211,238,0.14), transparent 24%), radial-gradient(circle at 58% 74%, rgba(239,68,68,0.12), transparent 24%), linear-gradient(180deg, #11131a 0%, #0b0d13 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: resultSwap,
          background:
            "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%), radial-gradient(circle at 78% 24%, rgba(125,211,252,0.16), transparent 22%), radial-gradient(circle at 18% 80%, rgba(244,114,182,0.12), transparent 22%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 184,
          top: 184,
          width: 912,
          height: 206,
          borderRadius: 34,
          background: "rgba(17,19,27,0.78)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.32)",
          opacity: darkStage * (1 - resultSwap),
          transform: `translateY(${interpolate(bar, [0, 1], [24, 0], clamp)}px) scale(${interpolate(bar, [0, 1], [0.94, 1], clamp)}) translateX(${interpolate(drift, [0, 1], [-8, 8], clamp)}px)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 28,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {chips.map((chip, index) => {
            const chipEnter = interpolate(frame, [14 + index * 4, 28 + index * 6], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div
                key={chip.label}
                style={{
                  width: chip.width,
                  height: 36,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: index === 0 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#f5f7fb",
                  fontSize: 13,
                  fontWeight: 720,
                  opacity: chipEnter * chipsReveal,
                  transform: `translateY(${interpolate(chipEnter, [0, 1], [10, 0], clamp)}px)`,
                }}
              >
                {chip.label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 92,
            height: 48,
            borderRadius: 999,
            background: "rgba(9,11,16,0.78)",
            border: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 14,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: 999, background: "#60a5fa"}} />
          <div style={{fontSize: 18, fontWeight: 730, color: "#f5f7fb"}}>Ask anything multimodal</div>
          <div
            style={{
              width: 2,
              height: 22,
              borderRadius: 999,
              background: "#f5f7fb",
              opacity: interpolate(frame, [20, 32, 44], [0.25, 1, 0.32], clamp),
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 24,
            width: 284,
            height: 12,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 582,
          top: 212,
          width: 116,
          height: 116,
          opacity: bridge * (1 - resultSwap * 0.4),
          transform: `translateY(${interpolate(bridge, [0, 1], [12, 0], clamp)}px) scale(${interpolate(bridge, [0, 1], [0.88, 1], clamp)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(96,165,250,0.98) 0%, rgba(168,85,247,0.94) 48%, rgba(34,211,238,0.94) 100%)",
            clipPath:
              "polygon(50% 0%, 68% 30%, 100% 50%, 68% 70%, 50% 100%, 32% 70%, 0% 50%, 32% 30%)",
            filter: "drop-shadow(0 18px 30px rgba(96,165,250,0.20))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 128,
          top: 108,
          width: 1024,
          height: 452,
          borderRadius: 30,
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(226,232,240,0.84)",
          boxShadow: "0 28px 76px rgba(148,163,184,0.16)",
          opacity: resultSwap,
          transform: `translateY(${interpolate(resultSwap, [0, 1], [18, 0], clamp)}px) scale(${interpolate(resultSwap, [0, 1], [0.97, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 26,
            color: "#111827",
            fontSize: 16,
            fontWeight: 720,
          }}
        >
          About 24,200,000 results (0.32 sec)
        </div>
        <div
          style={{
            position: "absolute",
            right: 32,
            top: 20,
            width: 170,
            height: 36,
            borderRadius: 999,
            background: "rgba(14,165,233,0.08)",
            border: "1px solid rgba(125,211,252,0.24)",
            display: "grid",
            placeItems: "center",
            color: "#0f172a",
            fontSize: 15,
            fontWeight: 760,
          }}
        >
          AI Overview
        </div>
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 82,
            width: 730,
            height: 234,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(248,250,252,0.98), rgba(255,255,255,0.98))",
            border: "1px solid rgba(226,232,240,0.84)",
          }}
        >
          <div style={{position: "absolute", left: 24, top: 24, width: 220, height: 14, borderRadius: 999, background: "rgba(96,165,250,0.18)"}} />
          <div style={{position: "absolute", left: 24, top: 56, width: 640, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.18)"}} />
          <div style={{position: "absolute", left: 24, top: 80, width: 588, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.14)"}} />
          <div style={{position: "absolute", left: 24, top: 114, width: 122, height: 34, borderRadius: 999, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.20)"}} />
          <div style={{position: "absolute", left: 160, top: 114, width: 138, height: 34, borderRadius: 999, background: "rgba(236,72,153,0.10)", border: "1px solid rgba(244,114,182,0.18)"}} />
          <div style={{position: "absolute", left: 314, top: 114, width: 148, height: 34, borderRadius: 999, background: "rgba(59,130,246,0.10)", border: "1px solid rgba(96,165,250,0.18)"}} />
          <div style={{position: "absolute", left: 24, bottom: 34, width: 470, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.16)"}} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 86,
            width: 222,
            height: 234,
            borderRadius: 24,
            background: "rgba(250,252,255,0.98)",
            border: "1px solid rgba(226,232,240,0.84)",
          }}
        >
          <div style={{position: "absolute", left: 22, top: 24, color: "#334155", fontSize: 15, fontWeight: 760}}>Related actions</div>
          {[0,1,2].map((row) => (
            <div
              key={row}
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                top: 60 + row * 52,
                height: 40,
                borderRadius: 16,
                background: row === 0 ? "rgba(96,165,250,0.12)" : "rgba(241,245,249,0.94)",
                border: "1px solid rgba(226,232,240,0.82)",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 96,
          background: `linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,${0.12 * hold}))`,
        }}
      />
    </AbsoluteFill>
  );
};
