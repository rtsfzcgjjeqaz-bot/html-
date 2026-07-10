import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot141Ease } from "../shot_141/shot141-atomic-motions";

export const SHOT_141_DURATION_FRAMES = 120;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const trendPoints = [
  [0, 66],
  [22, 54],
  [44, 58],
  [66, 32],
  [88, 44],
  [110, 28],
  [132, 36],
  [154, 18],
];

type Metric = {
  label: string;
  value: string;
  accent: string;
};

type Props = {
  title?: string;
  metrics?: Metric[];
};

export const Shot141GuardMetricTrendCardsChoreography: React.FC<Props> = ({
  title = "Guard Metrics",
  metrics = [
    { label: "Users", value: "18.4K", accent: "#226eea" },
    { label: "Flagged", value: "312", accent: "#ef4444" },
    { label: "Detection", value: "97.8%", accent: "#20be9c" },
    { label: "Savings", value: "+24%", accent: "#7c58ff" },
  ],
}) => {
  const frame = useCurrentFrame();
  const shell = shot141Ease({ frame, startFrame: 0, endFrame: 24 });
  const metricsIn = shot141Ease({ frame, startFrame: 8, endFrame: 48 });
  const trends = shot141Ease({ frame, startFrame: 22, endFrame: 82 });
  const rows = shot141Ease({ frame, startFrame: 40, endFrame: 102 });
  const hold = shot141Ease({ frame, startFrame: 96, endFrame: 120 });
  const drift = interpolate(hold, [0, 1], [0, 10], clamp);

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
            "radial-gradient(circle at 22% 26%, rgba(32,190,156,0.12), transparent 28%), radial-gradient(circle at 76% 22%, rgba(34,110,234,0.12), transparent 28%), linear-gradient(180deg,#ffffff 0%,#eef6ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 110 - drift,
          top: 82,
          width: 1060,
          height: 556,
          borderRadius: 34,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(34,110,234,0.10)",
          boxShadow: "0 34px 110px rgba(39,74,124,0.11)",
          opacity: shell,
          transform: `translateY(${interpolate(shell, [0, 1], [28, 0], clamp)}px) scale(${interpolate(shell, [0, 1], [0.97, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 38, top: 28, fontSize: 28, fontWeight: 900 }}>
          {title}
        </div>
        <div style={{ position: "absolute", left: 38, top: 72, width: 280, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />

        {metrics.map((metric, index) => {
          const cardIn = shot141Ease({ frame, startFrame: 10 + index * 5, endFrame: 30 + index * 8 });
          return (
            <div
              key={metric.label}
              style={{
                position: "absolute",
                left: 38 + index * 248,
                top: 116,
                width: 220,
                height: 114,
                borderRadius: 24,
                background: "#ffffff",
                border: "1px solid rgba(17,24,39,0.06)",
                boxShadow: "0 18px 42px rgba(39,74,124,0.08)",
                opacity: metricsIn * cardIn,
                transform: `translateX(${interpolate(cardIn, [0, 1], [18, 0], clamp)}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 22, top: 18, fontSize: 14, fontWeight: 760, color: "#5b6472" }}>
                {metric.label}
              </div>
              <div style={{ position: "absolute", left: 22, top: 46, fontSize: 34, fontWeight: 900 }}>
                {metric.value}
              </div>
              <div style={{ position: "absolute", left: 22, bottom: 18, width: 136, height: 8, borderRadius: 999, background: metric.accent, opacity: 0.72 }} />
            </div>
          );
        })}

        {[0, 1, 2].map((card) => (
          <div
            key={card}
            style={{
              position: "absolute",
              left: 38 + card * 336,
              top: 270,
              width: 304,
              height: 170,
              borderRadius: 24,
              background: "#ffffff",
              border: "1px solid rgba(17,24,39,0.06)",
              boxShadow: "0 16px 38px rgba(39,74,124,0.08)",
              opacity: trends,
              transform: `translateY(${interpolate(trends, [0, 1], [20, 0], clamp)}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 20, top: 18, fontSize: 15, fontWeight: 780, color: "#4b5563" }}>
              {card === 0 ? "Flagged trend" : card === 1 ? "Protected accounts" : "Weekly savings"}
            </div>
            <div style={{ position: "absolute", left: 20, right: 20, top: 52, bottom: 18 }}>
              <svg width="264" height="100" viewBox="0 0 264 100" style={{ overflow: "visible" }}>
                {[0, 1, 2].map((grid) => (
                  <line
                    key={grid}
                    x1="0"
                    y1={24 + grid * 24}
                    x2="264"
                    y2={24 + grid * 24}
                    stroke="rgba(34,110,234,0.08)"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={`M ${trendPoints.map(([x, y]) => `${x},${y}`).join(" L ")}`}
                  fill="none"
                  stroke={card === 1 ? "#20be9c" : card === 2 ? "#7c58ff" : "#226eea"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - trends}
                />
                {trendPoints.map(([x, y], index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={card === 1 ? "#20be9c" : card === 2 ? "#7c58ff" : "#226eea"}
                    opacity={trends}
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
              left: 38,
              right: 38,
              top: 462 + row * 28,
              height: 22,
              borderRadius: 999,
              background: "rgba(17,24,39,0.04)",
              opacity: rows,
              transform: `translateX(${interpolate(rows, [0, 1], [18, 0], clamp)}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 14, top: 6, width: 96 + row * 30, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.12)" }} />
            <div style={{ position: "absolute", right: 14, top: 4, width: 58, height: 14, borderRadius: 999, background: row === 1 ? "#226eea" : "rgba(34,110,234,0.12)" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

