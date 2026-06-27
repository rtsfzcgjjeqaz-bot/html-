import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_55_DURATION_FRAMES = 178;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const prompt = "帮我生成客户需求状态";
const rows = ["需求来源", "客户优先级", "待跟进事项", "交付风险", "负责人建议"];

export const Shot55AiRequirementComposerChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = ease(frame, 0, 32);
  const input = ease(frame, 24, 58);
  const typedCount = Math.floor(interpolate(frame, [50, 94], [0, prompt.length], clamp));
  const status = ease(frame, 88, 118);
  const workspace = ease(frame, 96, 146);
  const camera = interpolate(frame, [0, SHOT_55_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#f6f3ff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: canvas,
          background:
            "radial-gradient(circle at 32% 26%, rgba(132, 90, 255, 0.18), transparent 30%), radial-gradient(circle at 70% 72%, rgba(64, 196, 255, 0.14), transparent 34%), linear-gradient(180deg, #fbfaff, #eef4ff)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 212,
          top: 98,
          height: 38,
          padding: "0 18px",
          borderRadius: 12,
          border: "1px solid rgba(120, 83, 244, 0.26)",
          background: "rgba(255,255,255,0.82)",
          color: "#6d4de8",
          fontSize: 20,
          fontWeight: 820,
          display: "flex",
          alignItems: "center",
          opacity: canvas,
          transform: `translateY(${interpolate(canvas, [0, 1], [12, 0], clamp)}px)`,
          boxShadow: "0 18px 42px rgba(108, 85, 208, 0.12)",
        }}
      >
        AI 个人周报
      </div>
      <div
        style={{
          position: "absolute",
          left: width / 2 + 32,
          top: 101,
          color: "#1f2937",
          fontSize: 24,
          fontWeight: 850,
          opacity: canvas,
        }}
      >
        一键总结
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${interpolate(camera, [0, 1], [0.988, 1.018], clamp)}) translateY(${interpolate(camera, [0, 1], [8, 0], clamp)}px)`,
          transformOrigin: "center 56%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: width / 2 - 220,
            top: 186,
            width: 440,
            height: 54,
            opacity: input,
            transform: `translateY(${interpolate(input, [0, 1], [18, 0], clamp)}px) scale(${interpolate(input, [0, 1], [0.96, 1], clamp)})`,
            borderRadius: 16,
            border: "1px solid rgba(92, 72, 150, 0.18)",
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 22px 54px rgba(92, 72, 150, 0.16)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
          }}
        >
          <span style={{ color: "#7c5cff", fontSize: 15, fontWeight: 820 }}>AI</span>
          <span style={{ color: "#293142", fontSize: 17, fontWeight: 720, whiteSpace: "nowrap" }}>
            {prompt.slice(0, typedCount)}
            <span style={{ opacity: frame % 18 < 9 ? 1 : 0, color: "#7c5cff" }}>|</span>
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: width / 2 - 92,
            top: 260,
            height: 32,
            padding: "0 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124, 92, 255, 0.18)",
            color: "#5d4a91",
            fontSize: 14,
            fontWeight: 760,
            display: "flex",
            alignItems: "center",
            opacity: status,
            transform: `scale(${interpolate(frame, [88, 104, 118], [1, 1.04, 1], clamp)})`,
            boxShadow: "0 16px 40px rgba(124, 92, 255, 0.13)",
          }}
        >
          正在开发字段
        </div>

        <div
          style={{
            position: "absolute",
            left: width / 2 - 390,
            top: 318,
            width: 780,
            height: 300,
            opacity: workspace,
            transform: `translateY(${interpolate(workspace, [0, 1], [38, 0], clamp)}px)`,
            filter: `blur(${interpolate(workspace, [0, 1], [10, 0], clamp)}px)`,
            borderRadius: 24,
            border: "1px solid rgba(46, 63, 100, 0.08)",
            background: "rgba(255,255,255,0.94)",
            boxShadow: "0 34px 100px rgba(54, 72, 110, 0.18)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 44, borderBottom: "1px solid rgba(46,63,100,0.08)", display: "flex", alignItems: "center", paddingLeft: 22, gap: 10, color: "#344055", fontSize: 14, fontWeight: 820 }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: "#7c5cff" }} />
            客户需求工作台
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 230px", height: 256 }}>
            <aside style={{ padding: 18, borderRight: "1px solid rgba(46,63,100,0.08)" }}>
              {["线索", "需求", "状态", "提醒"].map((item, index) => (
                <div key={item} style={{ height: 30, marginBottom: 12, borderRadius: 9, background: index === 1 ? "rgba(124,92,255,0.14)" : "rgba(100,116,139,0.08)", color: index === 1 ? "#6245d8" : "#667085", display: "flex", alignItems: "center", paddingLeft: 12, fontSize: 13, fontWeight: 740 }}>
                  {item}
                </div>
              ))}
            </aside>
            <main style={{ padding: 18 }}>
              {rows.map((row, index) => {
                const reveal = ease(frame, 120 + index * 5, 142 + index * 5);
                return (
                  <div key={row} style={{ height: 34, marginBottom: 10, display: "grid", gridTemplateColumns: "92px 1fr 74px", gap: 12, alignItems: "center", opacity: reveal, transform: `translateY(${interpolate(reveal, [0, 1], [8, 0], clamp)}px)` }}>
                    <div style={{ color: "#475467", fontSize: 13, fontWeight: 760 }}>{row}</div>
                    <div style={{ height: 10, borderRadius: 999, background: index % 2 === 0 ? "rgba(124,92,255,0.24)" : "rgba(32,201,151,0.18)" }} />
                    <div style={{ height: 22, borderRadius: 999, background: "rgba(124,92,255,0.1)", color: "#6245d8", fontSize: 11, fontWeight: 760, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      已生成
                    </div>
                  </div>
                );
              })}
            </main>
            <section style={{ padding: 18, borderLeft: "1px solid rgba(46,63,100,0.08)" }}>
              <div style={{ color: "#344055", fontSize: 14, fontWeight: 820, marginBottom: 14 }}>AI 摘要</div>
              {[0, 1, 2, 3, 4].map((line) => {
                const reveal = ease(frame, 132 + line * 4, 152 + line * 4);
                return (
                  <div key={line} style={{ width: line === 4 ? "58%" : "100%", height: 9, marginBottom: 13, borderRadius: 999, background: "rgba(71,84,103,0.16)", opacity: reveal }} />
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
