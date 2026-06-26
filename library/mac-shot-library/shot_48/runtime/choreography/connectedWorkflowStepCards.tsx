import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_48_DURATION_FRAMES = 162;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type StepCardProps = {
  x: number;
  y: number;
  delay: number;
  title: string;
  subtitle: string;
  accent: string;
  rows: readonly string[];
  status: string;
};

const cardWidth = 330;
const cardHeight = 196;

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const StepCard: React.FC<StepCardProps> = ({
  x,
  y,
  delay,
  title,
  subtitle,
  accent,
  rows,
  status,
}) => {
  const frame = useCurrentFrame();
  const reveal = progress(frame, delay, delay + 36);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cardWidth,
        height: cardHeight,
        opacity: interpolate(reveal, [0, 1], [0, 1], clamp),
        transform: `translateY(${interpolate(reveal, [0, 1], [22, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.965, 1], clamp)})`,
        borderRadius: 24,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(24, 38, 66, 0.08)",
        boxShadow: "0 30px 80px rgba(39, 62, 92, 0.16)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 7,
          height: "100%",
          background: accent,
        }}
      />
      <div style={{ position: "absolute", left: 28, top: 24, right: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                color: "#172033",
                fontSize: 27,
                fontWeight: 750,
                lineHeight: 1.1,
                letterSpacing: 0,
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 7,
                color: "#6a7487",
                fontSize: 15,
                fontWeight: 520,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {subtitle}
            </div>
          </div>
          <div
            style={{
              flex: "0 0 auto",
              minWidth: 74,
              height: 30,
              padding: "0 12px",
              borderRadius: 999,
              background: "rgba(23, 177, 129, 0.12)",
              color: "#11835f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 720,
              letterSpacing: 0,
            }}
          >
            {status}
          </div>
        </div>

        <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
          {rows.map((row, index) => {
            const rowReveal = progress(frame, delay + 30 + index * 6, delay + 54 + index * 6);
            return (
              <div
                key={row}
                style={{
                  display: "grid",
                  gridTemplateColumns: "18px 1fr 54px",
                  gap: 12,
                  alignItems: "center",
                  opacity: rowReveal,
                  transform: `translateY(${interpolate(rowReveal, [0, 1], [8, 0], clamp)}px)`,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 5,
                    background: index === 0 ? accent : "rgba(82, 96, 122, 0.22)",
                  }}
                />
                <div
                  style={{
                    minWidth: 0,
                    color: "#465266",
                    fontSize: 15,
                    fontWeight: 620,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    letterSpacing: 0,
                  }}
                >
                  {row}
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(92, 107, 133, 0.16)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Shot48ConnectedWorkflowStepCardsChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = progress(frame, 0, 24);
  const connector = progress(frame, 40, 82);
  const camera = interpolate(frame, [0, SHOT_48_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const left = width / 2 - 380;
  const right = width / 2 + 54;
  const top = height / 2 - 106;
  const connectorLeft = left + cardWidth - 2;
  const connectorTop = top + 98;
  const connectorWidth = right - connectorLeft + 2;

  return (
    <AbsoluteFill
      style={{
        background: "#f4f7fb",
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
            "linear-gradient(180deg, #f8fbff 0%, #eef3f8 100%), radial-gradient(circle at 52% 48%, rgba(87, 121, 255, 0.16), transparent 34%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          top: 78,
          bottom: 76,
          opacity: interpolate(canvas, [0, 1], [0, 0.78], clamp),
          borderRadius: 34,
          border: "1px solid rgba(24, 38, 66, 0.06)",
          background: "rgba(255,255,255,0.42)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `translateY(${interpolate(camera, [0, 1], [6, 0], clamp)}px) scale(${interpolate(camera, [0, 1], [0.985, 1.025], clamp)})`,
          transformOrigin: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: connectorLeft,
            top: connectorTop,
            width: connectorWidth,
            height: 6,
            transform: `scaleX(${connector})`,
            transformOrigin: "left center",
            opacity: interpolate(connector, [0, 1], [0, 1], clamp),
            borderRadius: 999,
            background: "linear-gradient(90deg, #67d7b2, #5d7df4)",
            boxShadow: "0 14px 34px rgba(80, 112, 220, 0.24)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: connectorLeft + connectorWidth - 12,
            top: connectorTop - 7,
            width: 20,
            height: 20,
            opacity: interpolate(connector, [0.75, 1], [0, 1], clamp),
            transform: `scale(${interpolate(connector, [0.75, 1], [0.74, 1], clamp)}) rotate(45deg)`,
            borderTop: "6px solid #5d7df4",
            borderRight: "6px solid #5d7df4",
            borderRadius: 3,
          }}
        />

        <StepCard
          x={left}
          y={top}
          delay={12}
          title="方案设计"
          subtitle="产品流程定义"
          status="已同步"
          accent="#58cfa9"
          rows={["需求拆解", "结构规划", "参数校验"]}
        />
        <StepCard
          x={right}
          y={top}
          delay={68}
          title="影响评估"
          subtitle="变更链路计算"
          status="进行中"
          accent="#607cf4"
          rows={["关联模块", "风险提示", "交付节点"]}
        />
      </div>
    </AbsoluteFill>
  );
};
