import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_08_DURATION_FRAMES = 140;

const rows = [
  "识别当前任务中的人力投入风险",
  "建议补充负责人和验收节点",
  "自动生成下一步跟进清单",
  "可同步到项目进展摘要",
];

export const Shot08AIRecommendationChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const backgroundBlur = interpolate(frame, [0, 62], [0, 5], clamp);
  const backgroundOpacity = interpolate(frame, [0, 62], [0.82, 0.46], clamp);
  const backgroundScale = interpolate(frame, [0, 100], [1, 1.025], clamp);

  const cursorProgress = interpolate(frame, [18, 74], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [width * 0.44, width * 0.68], clamp);
  const cursorY = interpolate(cursorProgress, [0, 1], [height * 0.62, height * 0.42], clamp);
  const cursorOpacity = interpolate(frame, [18, 34, 130, SHOT_08_DURATION_FRAMES], [0, 1, 1, 0], clamp);

  const pillOpacity = interpolate(frame, [42, 70], [0, 1], clamp);
  const pillScale = interpolate(frame, [42, 78], [0.92, 1], clamp);
  const pillY = interpolate(frame, [42, 78], [12, 0], clamp);

  const panelProgress = interpolate(frame, [56, 120], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const panelOpacity = interpolate(panelProgress, [0, 0.18, 1], [0, 1, 1], clamp);
  const panelX = interpolate(panelProgress, [0, 1], [96, 0], clamp);
  const panelScale = interpolate(panelProgress, [0, 1], [0.98, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#f8fbff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, #ffffff 0%, #f5f9ff 52%, #edf3ff 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.08,
          top: height * 0.14,
          width: width * 0.62,
          height: height * 0.66,
          opacity: backgroundOpacity,
          filter: `blur(${backgroundBlur}px)`,
          transform: `scale(${backgroundScale})`,
          transformOrigin: "center",
          borderRadius: 26,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,96,140,0.12)",
          boxShadow: "0 28px 80px rgba(52,76,120,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 46,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 20px",
            background: "#f4f7fc",
            borderBottom: "1px solid rgba(75,96,140,0.1)",
          }}
        >
          {["#ff7474", "#ffc857", "#54d982"].map((color) => (
            <div key={color} style={{ width: 10, height: 10, borderRadius: 10, background: color }} />
          ))}
          <div style={{ marginLeft: 16, width: 210, height: 20, borderRadius: 999, background: "#e6edf8" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "148px 1fr", height: "calc(100% - 46px)" }}>
          <div style={{ padding: 18, borderRight: "1px solid rgba(75,96,140,0.08)" }}>
            {[0, 1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  height: 26,
                  marginBottom: 13,
                  borderRadius: 8,
                  background: item === 2 ? "#dce8ff" : "#edf2f8",
                }}
              />
            ))}
          </div>
          <div style={{ padding: 24 }}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                style={{
                  height: 38,
                  marginBottom: 13,
                  borderRadius: 10,
                  background:
                    item === 2
                      ? "linear-gradient(90deg, rgba(72,116,244,0.18), rgba(72,116,244,0.06))"
                      : "#eef3f8",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.56,
          top: height * 0.22,
          opacity: pillOpacity,
          transform: `translateY(${pillY}px) scale(${pillScale})`,
          padding: "9px 14px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(110,86,255,0.22)",
          color: "#684df4",
          fontSize: 17,
          fontWeight: 820,
          boxShadow: "0 18px 54px rgba(80,86,140,0.14)",
        }}
      >
        AI analysis
      </div>

      <div
        style={{
          position: "absolute",
          right: width * 0.1,
          top: height * 0.28,
          width: width * 0.33,
          minHeight: height * 0.46,
          opacity: panelOpacity,
          transform: `translateX(${panelX}px) scale(${panelScale})`,
          borderRadius: 24,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(88,104,146,0.14)",
          boxShadow: "0 34px 110px rgba(52,72,124,0.22)",
          padding: 24,
        }}
      >
        <div
          style={{
            color: "#17202a",
            fontSize: 25,
            fontWeight: 880,
            lineHeight: 1.12,
            marginBottom: 16,
          }}
        >
          人力分析
        </div>
        <div style={{ color: "#62717f", fontSize: 16, fontWeight: 680, lineHeight: 1.35, marginBottom: 18 }}>
          根据当前项目上下文，建议优先处理投入风险和验收节点。
        </div>
        {rows.map((row, index) => {
          const enter = interpolate(frame, [72 + index * 7, 92 + index * 7], [0, 1], clamp);
          return (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 34,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [10, 0], clamp)}px)`,
                color: "#243049",
                fontSize: 15,
                fontWeight: 690,
                lineHeight: 1.22,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  background: "#684df4",
                  flexShrink: 0,
                }}
              />
              <span>{row}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorOpacity,
          width: 0,
          height: 0,
          filter: "drop-shadow(0 10px 18px rgba(37,50,90,0.22))",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "18px solid #17202a",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            transform: "rotate(36deg)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
