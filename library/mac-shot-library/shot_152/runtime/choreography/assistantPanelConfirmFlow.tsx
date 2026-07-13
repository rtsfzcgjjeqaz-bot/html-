import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const SHOT_152_DURATION_FRAMES = 189;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const suggestionCards = [
  { x: 312, y: 182, delay: 44, title: "Review pending" },
  { x: 706, y: 176, delay: 52, title: "Owner suggestion" },
  { x: 316, y: 332, delay: 60, title: "Approve flow" },
  { x: 706, y: 330, delay: 68, title: "Send update" },
];

const commandRows = ["Summarize blockers", "Assign owner", "Confirm next step"];

export const Shot152AssistantPanelConfirmFlowChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 28);
  const device = ease(frame, 12, 58);
  const grid = ease(frame, 42, 92);
  const consoleReveal = ease(frame, 88, 132);
  const returnReveal = ease(frame, 124, 164);
  const shield = ease(frame, 150, SHOT_152_DURATION_FRAMES);
  const camera = interpolate(frame, [0, SHOT_152_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#e8f3ff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2 + stage * 0.8,
          background:
            "radial-gradient(circle at 24% 26%, rgba(37,99,235,0.18), transparent 24%), radial-gradient(circle at 76% 74%, rgba(14,165,233,0.16), transparent 28%), linear-gradient(180deg, #eef7ff 0%, #dbeafe 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 316,
          top: -40,
          width: 640,
          height: 640,
          opacity: 0.38,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.62), transparent 68%)",
          transform: `translateY(${interpolate(camera, [0, 1], [10, -8], clamp)}px)`,
          filter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${interpolate(camera, [0, 1], [0.986, 1.02], clamp)}) translateY(${interpolate(camera, [0, 1], [8, -4], clamp)}px)`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 280,
            top: 130,
            width: 720,
            height: 340,
            borderRadius: 34,
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(148,163,184,0.22)",
            boxShadow: "0 28px 84px rgba(37,99,235,0.12)",
            opacity: 0.08 + device * (1 - consoleReveal * 0.92),
            transform: `translateY(${interpolate(device, [0, 1], [30, 0], clamp)}px) rotateZ(${interpolate(device, [0, 1], [-4, -2], clamp)}deg) scale(${interpolate(device, [0, 1], [0.94, 1], clamp)})`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 22,
              color: "#64748b",
              fontSize: 15,
              fontWeight: 760,
            }}
          >
            Synced recommendations
          </div>
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 68,
              height: 138,
              borderRadius: 24,
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(239,246,255,0.96))",
              border: "1px solid rgba(125,211,252,0.30)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 26,
                top: 28,
                width: 180,
                height: 18,
                borderRadius: 999,
                background: "rgba(37,99,235,0.12)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 26,
                top: 60,
                width: 310,
                height: 48,
                borderRadius: 18,
                background: "linear-gradient(90deg, rgba(59,130,246,0.24), rgba(34,211,238,0.16))",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 26,
                top: 34,
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: "conic-gradient(from 210deg, #a855f7, #38bdf8, #2563eb, #a855f7)",
                opacity: 0.82,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              bottom: 26,
              height: 92,
              borderRadius: 24,
              background: "rgba(248,250,252,0.88)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <div style={{ position: "absolute", left: 22, top: 20, width: 210, height: 12, borderRadius: 999, background: "rgba(100,116,139,0.15)" }} />
            <div style={{ position: "absolute", left: 22, top: 42, width: 320, height: 12, borderRadius: 999, background: "rgba(59,130,246,0.16)" }} />
            <div style={{ position: "absolute", right: 22, top: 20, width: 96, height: 42, borderRadius: 999, background: "linear-gradient(135deg, rgba(59,130,246,0.92), rgba(34,211,238,0.9))" }} />
          </div>
        </div>

        {suggestionCards.map((card) => {
          const reveal = ease(frame, card.delay, card.delay + 18);
          return (
            <div
              key={card.title}
              style={{
                position: "absolute",
                left: card.x,
                top: card.y,
                width: 250,
                height: 124,
                borderRadius: 22,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(148,163,184,0.20)",
                boxShadow: "0 20px 48px rgba(37,99,235,0.10)",
                opacity: reveal * (1 - consoleReveal * 0.94),
                transform: `translateY(${interpolate(reveal, [0, 1], [18, 0], clamp)}px) scale(${interpolate(grid, [0, 1], [0.96, 1], clamp)})`,
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 16, color: "#0f172a", fontSize: 15, fontWeight: 820 }}>
                {card.title}
              </div>
              <div style={{ position: "absolute", left: 18, top: 48, width: 160, height: 10, borderRadius: 999, background: "rgba(100,116,139,0.14)" }} />
              <div style={{ position: "absolute", left: 18, top: 68, width: 196, height: 10, borderRadius: 999, background: "rgba(59,130,246,0.14)" }} />
              <div style={{ position: "absolute", right: 18, bottom: 16, width: 74, height: 30, borderRadius: 999, background: "rgba(37,99,235,0.10)" }} />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 374,
            top: 182,
            width: 532,
            height: 280,
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(17,24,39,0.96), rgba(30,41,59,0.94))",
            border: "1px solid rgba(71,85,105,0.42)",
            boxShadow: "0 34px 96px rgba(15,23,42,0.28)",
            opacity: consoleReveal,
            transform: `translateY(${interpolate(consoleReveal, [0, 1], [18, 0], clamp)}px) scale(${interpolate(consoleReveal, [0, 1], [0.96, 1], clamp)})`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 22, top: 18, color: "#cbd5e1", fontSize: 15, fontWeight: 760 }}>
            Synoptix assistant
          </div>
          <div style={{ position: "absolute", left: 22, top: 56, width: 188, height: 12, borderRadius: 999, background: "rgba(148,163,184,0.20)" }} />
          <div style={{ position: "absolute", left: 22, top: 82, width: 244, height: 12, borderRadius: 999, background: "rgba(34,211,238,0.26)" }} />
          {commandRows.map((row, index) => {
            const rowReveal = ease(frame, 104 + index * 10, 124 + index * 10);
            return (
              <div
                key={row}
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  top: 126 + index * 42,
                  height: 34,
                  borderRadius: 12,
                  background: "rgba(51,65,85,0.62)",
                  border: "1px solid rgba(100,116,139,0.26)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14,
                  color: "#e2e8f0",
                  fontSize: 14,
                  fontWeight: 710,
                  opacity: rowReveal,
                  transform: `translateX(${interpolate(rowReveal, [0, 1], [14, 0], clamp)}px)`,
                }}
              >
                {row}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 308,
            top: 214,
            width: 664,
            height: 276,
            borderRadius: 30,
            background: "rgba(255,255,255,0.80)",
            border: "1px solid rgba(148,163,184,0.20)",
            boxShadow: "0 24px 72px rgba(14,165,233,0.10)",
            opacity: returnReveal * (1 - shield * 0.86),
            transform: `translateY(${interpolate(returnReveal, [0, 1], [14, 0], clamp)}px) scale(${interpolate(returnReveal, [0, 1], [0.97, 1], clamp)})`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 26, top: 26, color: "#0f172a", fontSize: 18, fontWeight: 820 }}>
            Recommendation confirmed
          </div>
          <div style={{ position: "absolute", left: 26, top: 66, width: 268, height: 14, borderRadius: 999, background: "rgba(59,130,246,0.14)" }} />
          <div style={{ position: "absolute", left: 26, top: 94, width: 360, height: 14, borderRadius: 999, background: "rgba(100,116,139,0.14)" }} />
          <div style={{ position: "absolute", right: 28, top: 32, width: 112, height: 40, borderRadius: 999, background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.92))" }} />
          <div style={{ position: "absolute", left: 26, right: 26, bottom: 26, height: 92, borderRadius: 22, background: "rgba(239,246,255,0.92)", border: "1px solid rgba(125,211,252,0.26)" }} />
        </div>

        <div
          style={{
            position: "absolute",
            right: 132,
            top: 58,
            color: "#f8fafc",
            fontSize: 30,
            fontWeight: 840,
            opacity: shield,
          }}
        >
          Automate
        </div>
        <div
          style={{
            position: "absolute",
            left: 496,
            top: 134,
            width: 288,
            height: 288,
            opacity: shield,
            transform: `translateY(${interpolate(shield, [0, 1], [10, 0], clamp)}px) scale(${interpolate(shield, [0, 1], [0.88, 1], clamp)})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(50% 0%, 92% 18%, 92% 66%, 50% 100%, 8% 66%, 8% 18%)",
              background: "linear-gradient(180deg, rgba(52,211,153,0.94), rgba(16,185,129,0.76))",
              boxShadow: "0 30px 80px rgba(16,185,129,0.26)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 84,
              top: 84,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.82), rgba(220,252,231,0.16))",
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.92)",
                boxShadow: "0 0 0 16px rgba(220,252,231,0.16)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 112,
            bottom: 64,
            color: "#e2e8f0",
            fontSize: 28,
            fontWeight: 820,
            opacity: shield,
          }}
        >
          end-to-end
        </div>
      </div>
    </AbsoluteFill>
  );
};
