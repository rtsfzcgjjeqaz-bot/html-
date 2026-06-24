import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type IconCard = {
  label: string;
  detail: string;
  color: string;
  delay: number;
};

const iconCards: IconCard[] = [
  { label: "Plan", detail: "Brief", color: "#2563EB", delay: 54 },
  { label: "Build", detail: "Pages", color: "#0F766E", delay: 62 },
  { label: "Launch", detail: "Live", color: "#B45309", delay: 70 },
];

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const timed = (
  frame: number,
  fps: number,
  startSeconds: number,
  durationSeconds: number,
  easing = easeOut,
) =>
  interpolate(frame, [startSeconds * fps, (startSeconds + durationSeconds) * fps], [0, 1], {
    ...clamp,
    easing,
  });

const rowData = [
  ["Audience", "Visitors", "Ready"],
  ["Message", "Value props", "Clear"],
  ["Proof", "Use cases", "Mapped"],
  ["Action", "CTA", "Active"],
];

const BrowserMock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const browserIn = timed(frame, fps, 0.45, 0.9);
  const contentIn = timed(frame, fps, 1.05, 0.75);
  const scan = interpolate(frame, [0, 4.5 * fps], [-22, 122], clamp);
  const hover = Math.sin(frame / 18) * 5;

  return (
    <div
      style={{
        position: "absolute",
        right: 128,
        top: 198,
        width: 980,
        height: 650,
        borderRadius: 34,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(15,23,42,0.10)",
        boxShadow: "0 46px 120px rgba(30,41,59,0.18)",
        overflow: "hidden",
        transform: `translate3d(${interpolate(browserIn, [0, 1], [250, 0])}px, ${interpolate(
          browserIn,
          [0, 1],
          [92, hover],
        )}px, 0) scale(${interpolate(browserIn, [0, 1], [0.88, 1])}) rotateY(${interpolate(
          browserIn,
          [0, 1],
          [-10, -4],
        )}deg) rotateX(2deg)`,
        opacity: browserIn,
      }}
    >
      <div
        style={{
          height: 66,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 26px",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        }}
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            style={{
              width: 13,
              height: 13,
              borderRadius: 99,
              background: ["#F97316", "#FACC15", "#22C55E"][item],
              opacity: 0.78,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            width: 360,
            height: 26,
            borderRadius: 99,
            background: "#EEF2F7",
          }}
        />
      </div>

      <div style={{ position: "relative", height: 584, padding: 38 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            left: `${scan}%`,
            width: 120,
            background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.14), transparent)",
            transform: "skewX(-12deg)",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.06fr 0.94fr",
            gap: 34,
            height: "100%",
          }}
        >
          <div
            style={{
              padding: 32,
              borderRadius: 28,
              background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 62%, #ECFDF5 100%)",
              border: "1px solid rgba(37,99,235,0.10)",
              opacity: contentIn,
              transform: `translateY(${interpolate(contentIn, [0, 1], [34, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 118,
                height: 26,
                borderRadius: 99,
                background: "#DBEAFE",
                marginBottom: 28,
              }}
            />
            <div
              style={{
                width: 390,
                height: 48,
                borderRadius: 14,
                background: "#111827",
                marginBottom: 16,
              }}
            />
            <div
              style={{
                width: 315,
                height: 48,
                borderRadius: 14,
                background: "#334155",
                marginBottom: 28,
              }}
            />
            <div
              style={{
                width: 430,
                height: 14,
                borderRadius: 99,
                background: "#CBD5E1",
                marginBottom: 12,
              }}
            />
            <div
              style={{
                width: 340,
                height: 14,
                borderRadius: 99,
                background: "#CBD5E1",
                marginBottom: 34,
              }}
            />
            <div style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 146,
                  height: 52,
                  borderRadius: 16,
                  background: "#2563EB",
                  boxShadow: "0 18px 38px rgba(37,99,235,0.28)",
                }}
              />
              <div
                style={{
                  width: 124,
                  height: 52,
                  borderRadius: 16,
                  background: "#FFFFFF",
                  border: "1px solid rgba(15,23,42,0.10)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {rowData.map((row, index) => {
              const rowIn = timed(frame, fps, 1.25 + index * 0.13, 0.5);
              return (
                <div
                  key={row[0]}
                  style={{
                    height: 92,
                    borderRadius: 22,
                    background: "#FFFFFF",
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow: "0 16px 38px rgba(30,41,59,0.08)",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 90px",
                    alignItems: "center",
                    padding: "0 22px",
                    opacity: rowIn,
                    transform: `translateX(${interpolate(rowIn, [0, 1], [48, 0])}px)`,
                  }}
                >
                  <strong style={{ color: "#0F172A", fontSize: 20 }}>{row[0]}</strong>
                  <span style={{ color: "#64748B", fontSize: 18 }}>{row[1]}</span>
                  <em style={{ color: index === 3 ? "#2563EB" : "#0F766E", fontStyle: "normal", fontWeight: 800 }}>
                    {row[2]}
                  </em>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroCopy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labelIn = timed(frame, fps, 0.2, 0.55);
  const titleIn = timed(frame, fps, 0.75, 0.75);
  const subIn = timed(frame, fps, 1.15, 0.65);

  return (
    <div style={{ position: "absolute", left: 128, top: 232, width: 650 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          borderRadius: 999,
          background: "rgba(37,99,235,0.10)",
          color: "#1D4ED8",
          fontSize: 23,
          fontWeight: 800,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [24, 0])}px)`,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 99, background: "#2563EB" }} />
        Website Hero Template
      </div>
      <h1
        style={{
          margin: "34px 0 0",
          color: "#0F172A",
          fontSize: 84,
          lineHeight: 0.95,
          letterSpacing: "-0.065em",
          fontWeight: 900,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [54, 0])}px)`,
        }}
      >
        Turn a page into a clear product story.
      </h1>
      <p
        style={{
          margin: "30px 0 0",
          maxWidth: 560,
          color: "#526173",
          fontSize: 31,
          lineHeight: 1.34,
          fontWeight: 650,
          opacity: subIn,
          transform: `translateY(${interpolate(subIn, [0, 1], [38, 0])}px)`,
        }}
      >
        Browser frame, headline reveal, and feature chips are fully replaceable.
      </p>
    </div>
  );
};

const IconCascade: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {iconCards.map((card, index) => {
        const p = interpolate(frame, [card.delay, card.delay + 18], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
        const x = 1128 + index * 184;
        const y = 792 - index * 34;
        return (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 168,
              height: 118,
              borderRadius: 26,
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 26px 70px rgba(30,41,59,0.14)",
              padding: 18,
              opacity: p,
              transform: `translate3d(${interpolate(p, [0, 1], [58, 0])}px, ${interpolate(
                p,
                [0, 1],
                [44, 0],
              )}px, 0) scale(${interpolate(p, [0, 1], [0.78, 1])})`,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: card.color,
                marginBottom: 14,
              }}
            />
            <strong style={{ display: "block", color: "#0F172A", fontSize: 21 }}>{card.label}</strong>
            <span style={{ color: "#64748B", fontSize: 17, fontWeight: 700 }}>{card.detail}</span>
          </div>
        );
      })}
    </>
  );
};

export const Shot26WebsiteHeroPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = timed(frame, fps, 0.05, 4.25, easeInOut);
  const gridOpacity = interpolate(frame, [0, 1.2 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 77% 24%, rgba(37,99,235,0.20), transparent 32%), radial-gradient(circle at 20% 78%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #EEF6FF 48%, #F8F7F0 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -180,
          opacity: 0.18 * gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.18) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          transform: `translate3d(${interpolate(camera, [0, 1], [28, -42])}px, ${interpolate(
            camera,
            [0, 1],
            [16, -20],
          )}px, 0) rotateX(58deg) scale(1.22)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${interpolate(camera, [0, 1], [1.035, 1])}) translate3d(${interpolate(
            camera,
            [0, 1],
            [0, -18],
          )}px, ${interpolate(camera, [0, 1], [0, -12])}px, 0)`,
        }}
      >
        <HeroCopy />
        <BrowserMock />
        <IconCascade />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          bottom: 58,
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(15,23,42,0.42)",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span>Shot 26 / Website Hero</span>
        <span>approved: false / allowedInFactory: false</span>
      </div>
    </AbsoluteFill>
  );
};
