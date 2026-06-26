import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_50_DURATION_FRAMES = 162;

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
  { label: "需求", value: "12", color: "#20c997" },
  { label: "模块", value: "25", color: "#7c6df2" },
  { label: "节点", value: "39", color: "#33b8ff" },
  { label: "变更", value: "02", color: "#ffb020" },
] as const;

const heatCells = [
  [0.25, 0.45, 0.7, 0.92, 0.64],
  [0.32, 0.58, 0.86, 0.78, 0.5],
  [0.42, 0.76, 0.96, 0.72, 0.44],
  [0.28, 0.52, 0.74, 0.66, 0.36],
] as const;

const moduleCards = [
  { title: "项目门户", x: 150, y: 492, delay: 106, color: "#20c997" },
  { title: "资源日历", x: 440, y: 505, delay: 114, color: "#33b8ff" },
  { title: "审批配置", x: 742, y: 502, delay: 122, color: "#7c6df2" },
] as const;

const MiniModule: React.FC<(typeof moduleCards)[number]> = ({ title, x, y, delay, color }) => {
  const frame = useCurrentFrame();
  const reveal = ease(frame, delay, delay + 34);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 188,
        height: 86,
        opacity: interpolate(reveal, [0, 1], [0, 1], clamp),
        transform: `translateY(${interpolate(reveal, [0, 1], [24, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
        borderRadius: 18,
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(34, 49, 73, 0.08)",
        boxShadow: "0 22px 58px rgba(58, 73, 103, 0.14)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 18, top: 18, width: 12, height: 12, borderRadius: 4, background: color }} />
      <div style={{ position: "absolute", left: 40, top: 14, color: "#1f2b3f", fontSize: 17, fontWeight: 760 }}>
        {title}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 46, height: 8, borderRadius: 999, background: "rgba(78, 92, 116, 0.14)" }} />
      <div style={{ position: "absolute", left: 18, width: 112, top: 64, height: 8, borderRadius: 999, background: "rgba(78, 92, 116, 0.1)" }} />
    </div>
  );
};

export const Shot50ModularDashboardGridBuildChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const headline = ease(frame, 0, 30);
  const shell = ease(frame, 12, 54);
  const camera = interpolate(frame, [0, SHOT_50_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const shellWidth = 950;
  const shellHeight = 355;
  const shellLeft = width / 2 - shellWidth / 2;
  const shellTop = 110;

  return (
    <AbsoluteFill
      style={{
        background: "#f7f7fd",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 32% 42%, rgba(110, 94, 255, 0.12), transparent 32%), radial-gradient(circle at 76% 34%, rgba(32, 201, 151, 0.12), transparent 28%), linear-gradient(180deg, #fbfbff 0%, #eff3fa 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 30,
          textAlign: "center",
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [-10, 0], clamp)}px)`,
          color: "#111827",
          fontSize: 35,
          fontWeight: 860,
          lineHeight: 1.12,
          letterSpacing: 0,
        }}
      >
        自由搭建 创造无限可能
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${interpolate(camera, [0, 1], [0.986, 1.018], clamp)}) translateY(${interpolate(camera, [0, 1], [6, 0], clamp)}px)`,
          transformOrigin: "center 48%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: shellLeft,
            top: shellTop,
            width: shellWidth,
            height: shellHeight,
            opacity: interpolate(shell, [0, 0.18, 1], [0, 1, 1], clamp),
            transform: `translateY(${interpolate(shell, [0, 1], [26, 0], clamp)}px) scale(${interpolate(shell, [0, 1], [0.965, 1], clamp)})`,
            borderRadius: 22,
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(31, 41, 55, 0.08)",
            boxShadow: "0 34px 96px rgba(42, 55, 84, 0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 42,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 9,
              borderBottom: "1px solid rgba(31, 41, 55, 0.08)",
              background: "rgba(248,250,252,0.92)",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#ffb86b" }} />
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#38d39f" }} />
            <div style={{ marginLeft: 12, color: "#42506a", fontSize: 14, fontWeight: 760 }}>
              项目应用搭建平台
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "174px 1fr 235px", height: shellHeight - 42 }}>
            <aside style={{ borderRight: "1px solid rgba(31, 41, 55, 0.08)", padding: 18 }}>
              {["人员投入分析", "项目进度", "资源管理", "交付风险"].map((item, index) => {
                const active = index === 0;
                return (
                  <div
                    key={item}
                    style={{
                      height: 34,
                      marginBottom: 12,
                      borderRadius: 10,
                      paddingLeft: 12,
                      display: "flex",
                      alignItems: "center",
                      color: active ? "#11835f" : "#667085",
                      background: active ? "rgba(32, 201, 151, 0.12)" : "rgba(100, 116, 139, 0.07)",
                      fontSize: 13,
                      fontWeight: 720,
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </aside>

            <main style={{ position: "relative", padding: "20px 24px" }}>
              <div style={{ color: "#1f2937", fontSize: 16, fontWeight: 820 }}>资源负载热力图</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 74px)", gap: 8, marginTop: 18 }}>
                {heatCells.flatMap((row, rowIndex) =>
                  row.map((level, colIndex) => {
                    const index = rowIndex * row.length + colIndex;
                    const cell = ease(frame, 42 + index * 2, 62 + index * 2);
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          width: 74,
                          height: 36,
                          borderRadius: 8,
                          opacity: interpolate(cell, [0, 1], [0.18, 1], clamp),
                          transform: `scale(${interpolate(cell, [0, 1], [0.86, 1], clamp)})`,
                          background: `rgba(106, 88, 238, ${0.16 + level * 0.62})`,
                        }}
                      />
                    );
                  }),
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {metrics.map((metric, index) => {
                  const reveal = ease(frame, 34 + index * 6, 60 + index * 6);
                  return (
                    <div
                      key={metric.label}
                      style={{
                        width: 88,
                        height: 62,
                        opacity: reveal,
                        transform: `translateY(${interpolate(reveal, [0, 1], [10, 0], clamp)}px)`,
                        borderRadius: 14,
                        background: "rgba(248,250,252,0.95)",
                        border: "1px solid rgba(31, 41, 55, 0.07)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div style={{ color: metric.color, fontSize: 23, fontWeight: 870, lineHeight: 1 }}>{metric.value}</div>
                      <div style={{ color: "#667085", fontSize: 12, fontWeight: 700, marginTop: -4 }}>{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </main>

            <section style={{ borderLeft: "1px solid rgba(31, 41, 55, 0.08)", padding: 20, position: "relative" }}>
              <div style={{ color: "#1f2937", fontSize: 15, fontWeight: 820 }}>进度洞察</div>
              <div
                style={{
                  position: "relative",
                  margin: "20px auto 0",
                  width: 132,
                  height: 78,
                  opacity: ease(frame, 74, 104),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 132,
                    height: 66,
                    borderRadius: "132px 132px 0 0",
                    borderTop: "18px solid #20c997",
                    borderLeft: "18px solid #20c997",
                    borderRight: "18px solid rgba(255,176,32,0.9)",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ position: "absolute", left: 40, top: 38, color: "#111827", fontSize: 26, fontWeight: 850 }}>
                  82%
                </div>
              </div>
              <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {Array.from({ length: 21 }).map((_, index) => {
                  const reveal = ease(frame, 84 + index, 108 + index);
                  return (
                    <div
                      key={index}
                      style={{
                        height: 18,
                        borderRadius: 5,
                        opacity: interpolate(reveal, [0, 1], [0.25, 1], clamp),
                        background: index % 6 === 0 ? "rgba(124,109,242,0.72)" : "rgba(100,116,139,0.12)",
                      }}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {moduleCards.map((card) => (
          <MiniModule key={card.title} {...card} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
