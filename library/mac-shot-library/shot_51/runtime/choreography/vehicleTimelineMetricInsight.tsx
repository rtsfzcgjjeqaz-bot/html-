import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_51_DURATION_FRAMES = 102;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const metrics = [
  { label: "成本", value: "431", color: "#f97316" },
  { label: "周期", value: "12%", color: "#6d5df2" },
  { label: "风险", value: "98", color: "#10b981" },
] as const;

const bars = [
  { label: "结构设计", start: 0, width: 250, color: "#f97316" },
  { label: "验证测试", start: 70, width: 210, color: "#6d5df2" },
  { label: "供应评估", start: 32, width: 300, color: "#f59e0b" },
  { label: "量产准备", start: 118, width: 180, color: "#6d5df2" },
] as const;

const fanCards = [
  { x: -136, y: 26, rotate: -10, delay: 72, opacity: 0.58 },
  { x: -68, y: 10, rotate: -5, delay: 76, opacity: 0.72 },
  { x: 0, y: 0, rotate: 0, delay: 80, opacity: 1 },
  { x: 72, y: 12, rotate: 5, delay: 84, opacity: 0.76 },
  { x: 142, y: 32, rotate: 10, delay: 88, opacity: 0.58 },
] as const;

const DashboardSurface: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: compact ? 18 : 24,
        background: "rgba(255,250,244,0.98)",
        border: "1px solid rgba(112, 74, 42, 0.12)",
        boxShadow: compact ? "0 16px 44px rgba(89, 65, 44, 0.12)" : "0 32px 90px rgba(89, 65, 44, 0.18)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 26, top: 20, color: "#3b2f2a", fontSize: compact ? 12 : 15, fontWeight: 820 }}>
        车型研发策略总览
      </div>
      <div
        style={{
          position: "absolute",
          left: 28,
          top: compact ? 54 : 66,
          width: compact ? 118 : 198,
          height: compact ? 58 : 96,
          borderRadius: compact ? 22 : 36,
          background: "linear-gradient(135deg, #ff7a3d, #d84b24)",
          boxShadow: "0 18px 38px rgba(216,75,36,0.22)",
        }}
      >
        <div style={{ position: "absolute", left: 20, right: 20, bottom: compact ? 16 : 24, height: compact ? 10 : 16, borderRadius: 999, background: "rgba(55,38,30,0.22)" }} />
        <div style={{ position: "absolute", left: compact ? 16 : 32, bottom: compact ? 5 : 10, width: compact ? 18 : 28, height: compact ? 18 : 28, borderRadius: 999, background: "#2b2d34" }} />
        <div style={{ position: "absolute", right: compact ? 16 : 32, bottom: compact ? 5 : 10, width: compact ? 18 : 28, height: compact ? 18 : 28, borderRadius: 999, background: "#2b2d34" }} />
      </div>

      {!compact && (
        <div style={{ position: "absolute", left: 258, top: 62, display: "flex", gap: 16 }}>
          {metrics.map((metric, index) => {
            const reveal = ease(frame, 24 + index * 5, 42 + index * 5);
            return (
              <div key={metric.label} style={{ opacity: reveal, transform: `translateY(${interpolate(reveal, [0, 1], [8, 0], clamp)}px)`, width: 86, height: 62, borderRadius: 16, background: "rgba(255,255,255,0.74)", border: "1px solid rgba(112,74,42,0.08)", display: "grid", placeItems: "center" }}>
                <div style={{ color: metric.color, fontSize: 24, fontWeight: 880, lineHeight: 1 }}>{metric.value}</div>
                <div style={{ color: "#7b6a61", fontSize: 12, fontWeight: 720, marginTop: -4 }}>{metric.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ position: "absolute", left: compact ? 168 : 58, right: compact ? 30 : 54, top: compact ? 132 : 196 }}>
        {bars.map((bar, index) => {
          const draw = compact ? 1 : ease(frame, 42 + index * 4, 64 + index * 4);
          return (
            <div key={bar.label} style={{ display: "grid", gridTemplateColumns: compact ? "70px 1fr" : "94px 1fr", alignItems: "center", gap: 12, height: compact ? 22 : 32 }}>
              <div style={{ color: "#7b6a61", fontSize: compact ? 9 : 12, fontWeight: 700, overflow: "hidden", whiteSpace: "nowrap" }}>{bar.label}</div>
              <div style={{ position: "relative", height: compact ? 8 : 12, borderRadius: 999, background: "rgba(120,91,74,0.1)" }}>
                <div style={{ position: "absolute", left: bar.start * (compact ? 0.52 : 1), top: 0, height: "100%", width: bar.width * (compact ? 0.5 : 1), transform: `scaleX(${draw})`, transformOrigin: "left center", borderRadius: 999, background: bar.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {!compact && (
        <div style={{ position: "absolute", right: 32, top: 148, width: 164, display: "grid", gap: 10 }}>
          {["成本浮动", "供应链", "节点风险"].map((row, index) => {
            const reveal = ease(frame, 52 + index * 4, 70 + index * 4);
            return (
              <div key={row} style={{ opacity: reveal, transform: `translateX(${interpolate(reveal, [0, 1], [12, 0], clamp)}px)`, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.68)", border: "1px solid rgba(112,74,42,0.08)", color: "#5f514a", fontSize: 12, fontWeight: 740, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                {row}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Shot51VehicleTimelineMetricInsightChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = ease(frame, 0, 18);
  const card = ease(frame, 8, 38);
  const fan = ease(frame, 70, 102);
  const camera = interpolate(frame, [0, SHOT_51_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#f8f3ee",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: canvas, background: "radial-gradient(circle at 56% 38%, rgba(249, 115, 22, 0.16), transparent 28%), radial-gradient(circle at 74% 62%, rgba(109, 93, 242, 0.12), transparent 32%), linear-gradient(180deg, #fbf7f2, #eef4ff)" }} />

      <div style={{ position: "absolute", left: width / 2 - 280, top: 42, opacity: interpolate(canvas, [0, 1], [0, 1], clamp), color: "#2b2f3a", fontSize: 30, fontWeight: 860, letterSpacing: 0 }}>
        数据洞察驱动项目决策
      </div>

      <div style={{ position: "absolute", left: 0, top: 0, width, height, transform: `scale(${interpolate(camera, [0, 1], [0.986, 1.02], clamp)}) translateY(${interpolate(camera, [0, 1], [8, 0], clamp)}px)`, transformOrigin: "center 52%" }}>
        <div
          style={{
            position: "absolute",
            left: width / 2 - 330,
            top: 126,
            width: 660,
            height: 370,
            opacity: interpolate(card, [0, 0.18, 1], [0, 1, 1], clamp),
            transform: `translateY(${interpolate(card, [0, 1], [22, 0], clamp)}px) scale(${interpolate(card, [0, 1], [0.96, 1], clamp)})`,
          }}
        >
          <DashboardSurface />
        </div>

        <div
          style={{
            position: "absolute",
            left: width / 2 - 270,
            top: 212,
            width: 540,
            height: 300,
            opacity: interpolate(fan, [0, 0.3, 1], [0, 0.35, 1], clamp),
            transform: `translateY(${interpolate(fan, [0, 1], [42, 100], clamp)}px) scale(${interpolate(fan, [0, 1], [0.8, 0.72], clamp)})`,
            transformOrigin: "center",
          }}
        >
          {fanCards.map((cardInfo) => {
            const reveal = ease(frame, cardInfo.delay, cardInfo.delay + 16);
            return (
              <div
                key={`${cardInfo.x}-${cardInfo.rotate}`}
                style={{
                  position: "absolute",
                  left: cardInfo.x,
                  top: cardInfo.y,
                  width: 540,
                  height: 300,
                  opacity: interpolate(reveal, [0, 1], [0, cardInfo.opacity], clamp),
                  transform: `translateX(${interpolate(reveal, [0, 1], [0, cardInfo.x], clamp)}px) rotate(${cardInfo.rotate}deg)`,
                }}
              >
                <DashboardSurface compact />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
