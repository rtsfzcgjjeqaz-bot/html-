import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_71_DURATION_FRAMES = 213;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type PhoneSpec = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  rotate: number;
  scale: number;
  qg?: string;
  active?: boolean;
};

const phones: PhoneSpec[] = [
  { id: "left-review", x: 106, y: 246, w: 176, h: 316, delay: 38, rotate: -2.4, scale: 0.9, qg: "QG 1" },
  { id: "left-main", x: 326, y: 110, w: 190, h: 342, delay: 14, rotate: 1.5, scale: 1.02, qg: "QG 3", active: true },
  { id: "center-flow", x: 548, y: 84, w: 190, h: 352, delay: 26, rotate: -1.2, scale: 0.96, qg: "QG 2" },
  { id: "right-audit", x: 766, y: 136, w: 180, h: 324, delay: 50, rotate: 2.6, scale: 0.9, qg: "QG 1" },
  { id: "right-mainline", x: 948, y: 76, w: 190, h: 350, delay: 62, rotate: -1.8, scale: 0.94, qg: "QG 2" },
];

const copyBlocks = [
  { title: "质量阈点", sub: "全方位覆盖", x: 62, y: 126, align: "left" as const, delay: 76 },
  { title: "主线不偏离", sub: "", x: 840, y: 170, align: "left" as const, delay: 104 },
  { title: "合规零容错", sub: "", x: 560, y: 486, align: "center" as const, delay: 126 },
];

const rows = ["试生产评审", "整车公告", "质量复盘", "风险项", "责任人"];

const Phone: React.FC<{ spec: PhoneSpec; index: number; frame: number }> = ({ spec, index, frame }) => {
  const reveal = ease(frame, spec.delay, spec.delay + 44);
  const activePulse = ease(frame, 88 + index * 8, 132 + index * 8);

  return (
    <div
      style={{
        position: "absolute",
        left: spec.x,
        top: spec.y,
        width: spec.w,
        height: spec.h,
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [34, 0], clamp)}px) rotate(${interpolate(reveal, [0, 1], [spec.rotate - 3, spec.rotate], clamp)}deg) scale(${interpolate(reveal, [0, 1], [spec.scale * 0.92, spec.scale], clamp)})`,
        transformOrigin: "center bottom",
        borderRadius: 28,
        background: "linear-gradient(180deg, #143622 0%, #09120e 38%, #030606 100%)",
        border: "1px solid rgba(191, 255, 218, 0.18)",
        boxShadow: spec.active
          ? "0 30px 70px rgba(0,0,0,0.48), 0 0 36px rgba(38, 180, 98, 0.34)"
          : "0 24px 54px rgba(0,0,0,0.42)",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", color: "rgba(236,255,244,0.8)", fontSize: 9, fontWeight: 760 }}>
        <span>9:41</span>
        <span>•••</span>
      </div>
      <div style={{ padding: "10px 14px 0" }}>
        <div style={{ color: "#eafff2", fontSize: 13, fontWeight: 860 }}>认证产品线</div>
        <div style={{ marginTop: 8, height: 22, width: "72%", borderRadius: 7, background: "rgba(64,212,122,0.20)", color: "#6ee59b", fontSize: 10, display: "flex", alignItems: "center", paddingLeft: 8, fontWeight: 780 }}>
          正在评审
        </div>
      </div>
      <div style={{ padding: "14px 14px 0", display: "grid", gap: 9 }}>
        {rows.map((row, rowIndex) => {
          const rowReveal = ease(frame, spec.delay + 18 + rowIndex * 5, spec.delay + 42 + rowIndex * 5);
          const hot = rowIndex === 1 || (spec.active && rowIndex === 3);
          return (
            <div
              key={`${spec.id}-${row}`}
              style={{
                display: "grid",
                gridTemplateColumns: "18px 1fr 28px",
                gap: 8,
                alignItems: "center",
                opacity: rowReveal,
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 999, background: hot ? "#67e58d" : "rgba(255,255,255,0.22)" }} />
              <div>
                <div style={{ color: "rgba(244,255,248,0.9)", fontSize: 10, fontWeight: 760 }}>{row}</div>
                <div style={{ marginTop: 4, width: `${62 + ((rowIndex + index) % 3) * 12}%`, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.14)" }} />
              </div>
              <div style={{ color: hot ? "#81f0a4" : "rgba(255,255,255,0.48)", fontSize: 9, fontWeight: 820 }}>
                {hot ? "通过" : "同步"}
              </div>
            </div>
          );
        })}
      </div>
      {spec.active ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 20,
            height: 34,
            borderRadius: 10,
            background: `rgba(79, 221, 124, ${interpolate(activePulse, [0, 1], [0.12, 0.22], clamp)})`,
            border: "1px solid rgba(125, 242, 159, 0.42)",
            color: "#dffff0",
            fontSize: 11,
            fontWeight: 840,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AI 推荐下一步处理人
        </div>
      ) : null}
    </div>
  );
};

export const Shot71MobileQualityGovernanceStackChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const camera = interpolate(frame, [0, SHOT_71_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#020606",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: ease(frame, 0, 36),
          background:
            "radial-gradient(circle at 50% 40%, rgba(47, 153, 93, 0.18), transparent 35%), radial-gradient(circle at 82% 24%, rgba(109, 93, 242, 0.10), transparent 30%), linear-gradient(180deg, #06100d 0%, #020606 64%, #010303 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${interpolate(camera, [0, 1], [0.985, 1.025], clamp)}) translateY(${interpolate(camera, [0, 1], [8, -2], clamp)}px)`,
          transformOrigin: "center 54%",
        }}
      >
        {phones.map((phone, index) => (
          <Phone key={phone.id} spec={phone} index={index} frame={frame} />
        ))}

        {phones.map((phone, index) => {
          const reveal = ease(frame, 58 + index * 12, 88 + index * 12);
          if (!phone.qg) return null;
          return (
            <div
              key={`${phone.id}-badge`}
              style={{
                position: "absolute",
                left: phone.x + phone.w * 0.42,
                top: phone.y - 40,
                opacity: reveal,
                transform: `translateY(${interpolate(reveal, [0, 1], [-10, 0], clamp)}px)`,
                height: 31,
                padding: "0 12px",
                borderRadius: 999,
                background: "rgba(5, 14, 10, 0.88)",
                border: "1px solid rgba(136, 247, 163, 0.34)",
                color: "#effff3",
                fontSize: 13,
                fontWeight: 820,
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 0 22px rgba(57, 226, 118, 0.16)",
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "#4cea75" }} />
              {phone.qg}
            </div>
          );
        })}

        {copyBlocks.map((block) => {
          const reveal = ease(frame, block.delay, block.delay + 36);
          return (
            <div
              key={block.title}
              style={{
                position: "absolute",
                left: block.x,
                top: block.y,
                width: 220,
                textAlign: block.align,
                opacity: reveal,
                transform: `translateX(${interpolate(reveal, [0, 1], [-20, 0], clamp)}px)`,
                color: "#f7fbff",
                textShadow: "0 12px 36px rgba(0,0,0,0.58)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0 }}>{block.title}</div>
              {block.sub ? <div style={{ marginTop: 5, fontSize: 24, fontWeight: 860, letterSpacing: 0 }}>{block.sub}</div> : null}
            </div>
          );
        })}

        {[
          { x: 244, y: 215, w: 98, delay: 112 },
          { x: 790, y: 218, w: 76, delay: 126 },
          { x: 664, y: 474, w: 96, delay: 138 },
        ].map((line, index) => {
          const reveal = ease(frame, line.delay, line.delay + 30);
          return (
            <div
              key={`connector-${index}`}
              style={{
                position: "absolute",
                left: line.x,
                top: line.y,
                width: interpolate(reveal, [0, 1], [0, line.w], clamp),
                height: 1,
                opacity: reveal,
                background: "linear-gradient(90deg, rgba(116,244,153,0.72), rgba(116,244,153,0))",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
