import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_73_DURATION_FRAMES = 219;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const columns = [
  { title: "项目协同", accent: "#4f8dff", rows: ["任务流转", "里程碑", "进度追踪"] },
  { title: "流程沉淀", accent: "#55d6a5", rows: ["评审节点", "质量门禁", "规范模板"] },
  { title: "数据联动", accent: "#77a8ff", rows: ["字段映射", "状态同步", "结果回写"] },
  { title: "AI 增强", accent: "#b7d7ff", rows: ["智能摘要", "风险提醒", "推荐动作"] },
] as const;

const proofRows = ["平台能力方案", "研发协同看板", "方案结果沉淀"];

export const Shot73PlatformCapabilityMatrixRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const board = ease(frame, 0, 42);
  const promise = ease(frame, 18, 66);
  const proof = ease(frame, 110, 168);
  const rail = ease(frame, 142, 190);
  const camera = interpolate(frame, [0, SHOT_73_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#030508",
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
            "radial-gradient(circle at 36% 38%, rgba(65, 133, 255, 0.2), transparent 32%), radial-gradient(circle at 80% 62%, rgba(72, 214, 166, 0.09), transparent 30%), linear-gradient(180deg, #071120 0%, #030508 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          opacity: board,
          filter: `blur(${interpolate(board, [0, 1], [12, 0], clamp)}px)`,
          transform: `scale(${interpolate(camera, [0, 1], [0.985, 1.018], clamp)}) translateY(${interpolate(camera, [0, 1], [6, 0], clamp)}px)`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 132,
            width: 220,
            height: 390,
            opacity: promise,
            transform: `translateX(${interpolate(promise, [0, 1], [-42, 0], clamp)}px)`,
            borderRadius: 18,
            background: "linear-gradient(180deg, rgba(31, 67, 123, 0.92), rgba(8, 15, 28, 0.96))",
            border: "1px solid rgba(195, 220, 255, 0.2)",
            boxShadow: "0 30px 82px rgba(0,0,0,0.42)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 30,
            color: "#f6fbff",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 820, color: "#b8d5ff" }}>平台方案</div>
          <div style={{ marginTop: 18, fontSize: 31, lineHeight: 1.16, fontWeight: 900, letterSpacing: 0 }}>
            以简驭繁
            <br />
            极致创造
          </div>
          <div style={{ marginTop: 22, height: 2, width: 68, background: "#6ea2ff", borderRadius: 99 }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 318,
            top: 86,
            width: 610,
            height: 448,
            borderRadius: 20,
            background: "rgba(7, 11, 19, 0.9)",
            border: "1px solid rgba(205, 226, 255, 0.17)",
            boxShadow: "0 34px 96px rgba(0,0,0,0.42)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 48, background: "linear-gradient(90deg, rgba(46,103,207,0.92), rgba(17,34,74,0.88))", color: "#f5f9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 860 }}>
            平台能力方案
          </div>
          <div style={{ padding: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {columns.map((column, colIndex) => {
              const colReveal = ease(frame, 44 + colIndex * 8, 84 + colIndex * 8);
              const highlight = ease(frame, 82 + colIndex * 10, 126 + colIndex * 10);
              return (
                <div
                  key={column.title}
                  style={{
                    opacity: colReveal,
                    transform: `translateY(${interpolate(colReveal, [0, 1], [18, 0], clamp)}px)`,
                  }}
                >
                  <div
                    style={{
                      height: 38,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${column.accent}66, rgba(255,255,255,0.04))`,
                      border: `1px solid ${column.accent}88`,
                      color: "#f6fbff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 860,
                      boxShadow: `0 0 ${interpolate(highlight, [0, 1], [0, 26], clamp)}px ${column.accent}44`,
                    }}
                  >
                    {column.title}
                  </div>
                  <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    {column.rows.map((row, rowIndex) => {
                      const rowReveal = ease(frame, 62 + colIndex * 8 + rowIndex * 7, 96 + colIndex * 8 + rowIndex * 7);
                      return (
                        <div
                          key={row}
                          style={{
                            height: 52,
                            borderRadius: 10,
                            opacity: rowReveal,
                            transform: `translateY(${interpolate(rowReveal, [0, 1], [12, 0], clamp)}px)`,
                            background: rowIndex === 1 ? `${column.accent}22` : "rgba(255,255,255,0.055)",
                            border: rowIndex === 1 ? `1px solid ${column.accent}88` : "1px solid rgba(255,255,255,0.08)",
                            color: rowIndex === 1 ? "#eff7ff" : "rgba(238,246,255,0.72)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: 760,
                          }}
                        >
                          {row}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 964,
            top: 118,
            width: 244,
            height: 404,
            opacity: proof,
            transform: `translateX(${interpolate(proof, [0, 1], [34, 0], clamp)}px) scale(${interpolate(proof, [0, 1], [0.94, 1], clamp)})`,
            borderRadius: 18,
            background: "linear-gradient(180deg, rgba(14, 27, 52, 0.94), rgba(5, 8, 14, 0.97))",
            border: "1px solid rgba(196, 222, 255, 0.22)",
            boxShadow: "0 34px 86px rgba(0,0,0,0.44)",
            padding: 18,
          }}
        >
          <div style={{ color: "#ddebff", fontSize: 13, fontWeight: 860 }}>数字化结果</div>
          <div style={{ marginTop: 14, height: 120, borderRadius: 14, background: "linear-gradient(135deg, rgba(86,138,255,0.26), rgba(255,255,255,0.06))", border: "1px solid rgba(130,176,255,0.28)" }} />
          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            {proofRows.map((row, index) => {
              const item = ease(frame, 126 + index * 10, 156 + index * 10);
              return (
                <div
                  key={row}
                  style={{
                    opacity: item,
                    height: 42,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(242,248,255,0.78)",
                    fontSize: 12,
                    fontWeight: 760,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 12,
                  }}
                >
                  {row}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 360,
            bottom: 82,
            width: 540,
            height: 36,
            opacity: rail,
            transform: `translateY(${interpolate(rail, [0, 1], [16, 0], clamp)}px)`,
            borderRadius: 10,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(210,230,255,0.12)",
            color: "rgba(242,248,255,0.82)",
            fontSize: 12,
            fontWeight: 760,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          飞书项目管理专家解决方案
        </div>
      </div>
    </AbsoluteFill>
  );
};
