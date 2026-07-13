import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const SHOT_154_DURATION_FRAMES = 173;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const laneCards = [
  { x: 92, y: 88, w: 224, h: 132, delay: 8 },
  { x: 338, y: 82, w: 248, h: 140, delay: 16 },
  { x: 94, y: 252, w: 252, h: 144, delay: 22 },
  { x: 378, y: 236, w: 274, h: 152, delay: 30 },
];

const convergingTiles = [
  { delay: 112, startX: 860, startY: 264, endX: 1110, endY: 206, rotate: -12, color: "#f43f5e" },
  { delay: 118, startX: 882, startY: 286, endX: 1142, endY: 224, rotate: -6, color: "#2563eb" },
  { delay: 124, startX: 904, startY: 308, endX: 1172, endY: 248, rotate: 0, color: "#22c55e" },
  { delay: 130, startX: 926, startY: 330, endX: 1194, endY: 272, rotate: 6, color: "#f59e0b" },
  { delay: 136, startX: 948, startY: 352, endX: 1210, endY: 298, rotate: 12, color: "#7c3aed" },
];

export const Shot154ContentLaneWorkflowSweepChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 24);
  const rail = ease(frame, 42, 88);
  const pointer = ease(frame, 60, 118);
  const hold = ease(frame, 148, SHOT_154_DURATION_FRAMES);
  const camera = interpolate(frame, [0, SHOT_154_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: stage,
          background:
            "radial-gradient(circle at 22% 22%, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at 78% 78%, rgba(163,230,53,0.14), transparent 22%), linear-gradient(180deg, #f8fcff 0%, #edf8ff 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${interpolate(camera, [0, 1], [0.988, 1.016], clamp)}) translateY(${interpolate(camera, [0, 1], [8, -3], clamp)}px)`,
          transformOrigin: "center center",
        }}
      >
        {laneCards.map((card) => {
          const reveal = ease(frame, card.delay, card.delay + 26);
          return (
            <div
              key={`${card.x}-${card.y}`}
              style={{
                position: "absolute",
                left: card.x,
                top: card.y,
                width: card.w,
                height: card.h,
                borderRadius: 22,
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(125,211,252,0.28)",
                boxShadow: "0 20px 52px rgba(59,130,246,0.10)",
                opacity: reveal,
                transform: `translateY(${interpolate(reveal, [0, 1], [18, 0], clamp)}px) rotate(${interpolate(reveal, [0, 1], [-3, 0], clamp)}deg)`,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 16, width: card.w * 0.46, height: 12, borderRadius: 999, background: "rgba(14,165,233,0.16)" }} />
              <div style={{ position: "absolute", left: 18, top: 40, width: card.w - 36, height: 54, borderRadius: 16, background: "linear-gradient(135deg, rgba(191,219,254,0.66), rgba(125,211,252,0.36))" }} />
              <div style={{ position: "absolute", left: 18, bottom: 30, width: card.w * 0.58, height: 10, borderRadius: 999, background: "rgba(100,116,139,0.14)" }} />
              <div style={{ position: "absolute", left: 18, bottom: 14, width: card.w * 0.42, height: 10, borderRadius: 999, background: "rgba(59,130,246,0.14)" }} />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 520,
            top: 108,
            width: 404,
            height: 54,
            borderRadius: 999,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(125,211,252,0.30)",
            boxShadow: "0 18px 46px rgba(14,165,233,0.12)",
            opacity: rail,
            transform: `translateY(${interpolate(rail, [0, 1], [14, 0], clamp)}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 18, top: 12, width: 82, height: 30, borderRadius: 999, background: "linear-gradient(135deg, rgba(34,197,94,0.92), rgba(14,165,233,0.88))", color: "#f8fafc", fontSize: 14, fontWeight: 760, display: "grid", placeItems: "center" }}>Science</div>
          <div style={{ position: "absolute", left: 112, top: 18, color: "#334155", fontSize: 16, fontWeight: 760 }}>Write a rewrite</div>
          <div style={{ position: "absolute", right: 18, top: 12, width: 100, height: 30, borderRadius: 999, background: "rgba(59,130,246,0.10)" }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: interpolate(pointer, [0, 1], [592, 842], clamp),
            top: interpolate(pointer, [0, 1], [214, 170], clamp),
            width: 86,
            height: 86,
            opacity: pointer * (1 - hold * 0.4),
            transform: `scale(${interpolate(pointer, [0, 1], [0.82, 1], clamp)}) rotate(${interpolate(pointer, [0, 1], [-8, 0], clamp)}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              borderLeft: "0 solid transparent",
              borderRight: "58px solid transparent",
              borderTop: "58px solid rgba(34,197,94,0.94)",
              filter: "drop-shadow(0 16px 24px rgba(34,197,94,0.24))",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 984,
            top: 174,
            color: "#ffffff",
            fontSize: 42,
            fontWeight: 300,
            opacity: hold,
          }}
        >
          Grid Builder
        </div>
        <div
          style={{
            position: "absolute",
            left: 986,
            top: 224,
            color: "rgba(255,255,255,0.78)",
            fontSize: 15,
            fontWeight: 540,
            opacity: hold,
          }}
        >
          with cursor
        </div>

        {convergingTiles.map((tile) => {
          const reveal = ease(frame, tile.delay, tile.delay + 18);
          return (
            <div
              key={`${tile.startX}-${tile.delay}`}
              style={{
                position: "absolute",
                left: interpolate(reveal, [0, 1], [tile.startX, tile.endX], clamp),
                top: interpolate(reveal, [0, 1], [tile.startY, tile.endY], clamp),
                width: 68,
                height: 46,
                borderRadius: 12,
                background: `${tile.color}22`,
                border: `1px solid ${tile.color}44`,
                boxShadow: `0 12px 26px ${tile.color}22`,
                opacity: reveal,
                transform: `rotate(${tile.rotate}deg) scale(${interpolate(reveal, [0, 1], [0.86, 1], clamp)})`,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 6, top: 6, right: 6, height: 18, borderRadius: 8, background: `${tile.color}55` }} />
              <div style={{ position: "absolute", left: 6, bottom: 8, width: 34, height: 6, borderRadius: 999, background: "rgba(255,255,255,0.72)" }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
