import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot140Ease } from "../shot_140/shot140-atomic-motions";

export const SHOT_140_DURATION_FRAMES = 131;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const trendPath = [
  [0, 74],
  [28, 58],
  [56, 62],
  [84, 34],
  [112, 46],
  [140, 28],
  [168, 40],
  [196, 20],
];

type MetricCard = {
  label: string;
  value: string;
  accent: string;
};

type Props = {
  title?: string;
  cards?: MetricCard[];
};

export const Shot140EvaluationDashboardMetricsGridChoreography: React.FC<Props> = ({
  title = "Evaluation Dashboard",
  cards = [
    { label: "Latency", value: "128ms", accent: "#226eea" },
    { label: "Quality", value: "94.2%", accent: "#20be9c" },
    { label: "Coverage", value: "42 tests", accent: "#7c58ff" },
    { label: "Wins", value: "+18%", accent: "#f59e0b" },
  ],
}) => {
  const frame = useCurrentFrame();
  const shell = shot140Ease({ frame, startFrame: 0, endFrame: 26 });
  const cardsIn = shot140Ease({ frame, startFrame: 8, endFrame: 54 });
  const donut = shot140Ease({ frame, startFrame: 20, endFrame: 72 });
  const lower = shot140Ease({ frame, startFrame: 34, endFrame: 96 });
  const settle = shot140Ease({ frame, startFrame: 96, endFrame: 131 });

  const dashboardScale = interpolate(shell, [0, 1], [0.96, 1], clamp) *
    interpolate(settle, [0, 1], [1.012, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#f6fbff",
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
            "radial-gradient(circle at 24% 24%, rgba(34,110,234,0.12), transparent 30%), radial-gradient(circle at 78% 28%, rgba(32,190,156,0.10), transparent 26%), linear-gradient(180deg,#ffffff 0%,#eef6ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 114,
          top: 76,
          width: 1052,
          height: 568,
          borderRadius: 34,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(34,110,234,0.12)",
          boxShadow: "0 34px 120px rgba(39,74,124,0.12)",
          opacity: shell,
          transform: `translateY(${interpolate(shell, [0, 1], [32, 0], clamp)}px) scale(${dashboardScale})`,
          transformOrigin: "center",
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 28, fontSize: 28, fontWeight: 900 }}>
          {title}
        </div>
        <div style={{ position: "absolute", left: 36, top: 72, width: 320, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />

        {cards.map((card, index) => {
          const cardIn = shot140Ease({ frame, startFrame: 10 + index * 6, endFrame: 34 + index * 8 });
          return (
            <div
              key={card.label}
              style={{
                position: "absolute",
                left: 36 + index * 248,
                top: 116,
                width: 220,
                height: 110,
                borderRadius: 24,
                background: "#ffffff",
                border: "1px solid rgba(17,24,39,0.06)",
                boxShadow: "0 18px 42px rgba(39,74,124,0.08)",
                opacity: cardsIn * cardIn,
                transform: `translateY(${interpolate(cardIn, [0, 1], [18, 0], clamp)}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 22, top: 18, fontSize: 14, fontWeight: 760, color: "#5b6472" }}>
                {card.label}
              </div>
              <div style={{ position: "absolute", left: 22, top: 46, fontSize: 34, fontWeight: 900, color: "#111827" }}>
                {card.value}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  bottom: 18,
                  width: 126,
                  height: 8,
                  borderRadius: 999,
                  background: card.accent,
                  opacity: 0.72,
                }}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 42,
            top: 258,
            width: 360,
            height: 248,
            borderRadius: 28,
            background: "linear-gradient(180deg,#ffffff,#f8fbff)",
            border: "1px solid rgba(34,110,234,0.10)",
            boxShadow: "0 16px 38px rgba(39,74,124,0.08)",
            opacity: donut,
            transform: `translateX(${interpolate(donut, [0, 1], [18, 0], clamp)}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 24, top: 18, fontSize: 15, fontWeight: 780, color: "#4b5563" }}>
            Model outcome split
          </div>
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 54,
              width: 168,
              height: 168,
              borderRadius: 999,
              background: `conic-gradient(#226eea 0deg ${interpolate(donut, [0, 1], [0, 210], clamp)}deg, #20be9c ${interpolate(donut, [0, 1], [0, 210], clamp)}deg ${interpolate(donut, [0, 1], [0, 310], clamp)}deg, #e5eef9 ${interpolate(donut, [0, 1], [0, 310], clamp)}deg 360deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 999,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              94%
            </div>
          </div>
        </div>

        {[0, 1].map((panel) => (
          <div
            key={panel}
            style={{
              position: "absolute",
              left: 430 + panel * 294,
              top: 258,
              width: 264,
              height: 248,
              borderRadius: 28,
              background: "#ffffff",
              border: "1px solid rgba(17,24,39,0.06)",
              boxShadow: "0 16px 38px rgba(39,74,124,0.08)",
              opacity: lower,
              transform: `translateY(${interpolate(lower, [0, 1], [18, 0], clamp)}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 20, top: 18, fontSize: 15, fontWeight: 780, color: "#4b5563" }}>
              {panel === 0 ? "Trend comparison" : "Scenario checks"}
            </div>
            <div style={{ position: "absolute", left: 20, right: 20, top: 56, bottom: 20 }}>
              <svg width="224" height="164" viewBox="0 0 224 164" style={{ overflow: "visible" }}>
                {[0, 1, 2].map((grid) => (
                  <line
                    key={grid}
                    x1="0"
                    y1={36 + grid * 38}
                    x2="224"
                    y2={36 + grid * 38}
                    stroke="rgba(34,110,234,0.08)"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={`M ${trendPath.map(([x, y]) => `${x},${y}`).join(" L ")}`}
                  fill="none"
                  stroke={panel === 0 ? "#226eea" : "#20be9c"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - lower}
                />
                {trendPath.map(([x, y], index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={panel === 0 ? "#226eea" : "#20be9c"}
                    opacity={lower}
                  />
                ))}
              </svg>
            </div>
          </div>
        ))}

        {[0, 1, 2].map((row) => (
          <div
            key={row}
            style={{
              position: "absolute",
              left: 42 + row * 332,
              bottom: 28,
              width: 304,
              height: 76,
              borderRadius: 22,
              background: "#ffffff",
              border: "1px solid rgba(17,24,39,0.06)",
              boxShadow: "0 14px 30px rgba(39,74,124,0.06)",
              opacity: lower * interpolate(settle, [0, 1], [0.92, 1], clamp),
            }}
          >
            <div style={{ position: "absolute", left: 20, top: 18, width: 92, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.11)" }} />
            <div style={{ position: "absolute", left: 20, top: 40, width: 164 + row * 28, height: 12, borderRadius: 999, background: row === 1 ? "rgba(34,110,234,0.22)" : "rgba(17,24,39,0.08)" }} />
            <div style={{ position: "absolute", right: 20, top: 24, width: 56, height: 26, borderRadius: 999, background: row === 1 ? "#226eea" : "#eef4fb" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

