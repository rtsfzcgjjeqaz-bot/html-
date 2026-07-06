import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_131_DURATION_FRAMES = 99;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  sectionLabel?: string;
  activeTitle?: string;
  cardLabels?: string[];
};

const cards = Array.from({ length: 12 }, (_, index) => ({
  row: Math.floor(index / 4),
  col: index % 4,
  hue: index % 4,
}));

const swatches = [
  "linear-gradient(135deg,#dff0ff,#7fb7ff)",
  "linear-gradient(135deg,#e9e5ff,#9a8cff)",
  "linear-gradient(135deg,#dffbf5,#5fd0bf)",
  "linear-gradient(135deg,#f1f5ff,#b8c6e8)",
];

export const Shot131VideoCardLibraryGridSweepChoreography: React.FC<Props> = ({
  sectionLabel = "Video library",
  activeTitle = "Auto translated",
  cardLabels = ["Shorts", "Lessons", "Product", "Social"],
}) => {
  const frame = useCurrentFrame();
  const pane = ease(frame, 0, 26);
  const sweep = ease(frame, 12, 68);
  const focus = ease(frame, 36, 76);
  const cursor = ease(frame, 48, 84);
  const meta = ease(frame, 58, 90);
  const hold = ease(frame, 86, 99);

  return (
    <AbsoluteFill
      style={{
        background: "#f9f9ff",
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
            "radial-gradient(circle at 50% 38%, rgba(45,155,220,0.12), transparent 27%), radial-gradient(circle at 72% 74%, rgba(115,87,255,0.10), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f3f7ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 132,
          top: 78,
          width: 1016,
          height: 568,
          borderRadius: 38,
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(45,155,220,0.16)",
          boxShadow: "0 44px 120px rgba(40,72,120,0.12)",
          opacity: 0.16 + pane * 0.84,
          transform: `translateY(${interpolate(pane, [0, 1], [48, 0], clamp)}px) scale(${interpolate(pane, [0, 1], [0.97, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 34, top: 30, fontSize: 24, fontWeight: 850 }}>
          {sectionLabel}
        </div>
        <div style={{ position: "absolute", right: 34, top: 32, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((item) => (
            <div key={item} style={{ width: 58 + item * 12, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 178,
          top: 150,
          width: 924,
          height: 410,
          opacity: pane,
          transform: `translateX(${interpolate(sweep, [0, 1], [-72, interpolate(hold, [0, 1], [0, -5], clamp)], clamp)}px)`,
        }}
      >
        {cards.map((card, index) => {
          const itemIn = ease(frame, 14 + index * 2, 46 + index * 2);
          const isActive = index === 5;
          const x = card.col * 232;
          const y = card.row * 138;
          const activeLift = isActive ? focus : 0;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 202,
                height: 116,
                borderRadius: 22,
                background: "#ffffff",
                border: isActive ? "2px solid rgba(34,110,234,0.55)" : "1px solid rgba(45,155,220,0.14)",
                boxShadow: isActive
                  ? `0 ${interpolate(activeLift, [0, 1], [20, 42], clamp)}px 90px rgba(43,121,232,0.20)`
                  : "0 18px 48px rgba(39,67,110,0.09)",
                opacity: itemIn,
                overflow: "hidden",
                transform: `translateY(${interpolate(itemIn, [0, 1], [34, -activeLift * 18], clamp)}px) scale(${interpolate(activeLift, [0, 1], [1, 1.08], clamp)})`,
                zIndex: isActive ? 4 : 1,
              }}
            >
              <div style={{ position: "absolute", left: 12, top: 12, right: 12, height: 58, borderRadius: 16, background: swatches[card.hue] }} />
              <div style={{ position: "absolute", left: 24, top: 30, width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.84)" }} />
              <div style={{ position: "absolute", left: 14, bottom: 24, width: 94, height: 9, borderRadius: 999, background: "rgba(17,24,39,0.14)" }} />
              <div style={{ position: "absolute", left: 14, bottom: 10, width: 54, height: 7, borderRadius: 999, background: "rgba(45,155,220,0.18)" }} />
              {isActive && (
                <div style={{ position: "absolute", right: 12, bottom: 12, fontSize: 13, fontWeight: 820, color: "#226eea", opacity: focus }}>
                  {activeTitle}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 566,
          top: 420,
          width: 248,
          height: 62,
          borderRadius: 999,
          background: "#ffffff",
          border: "1px solid rgba(45,155,220,0.16)",
          boxShadow: "0 22px 64px rgba(45,90,150,0.12)",
          opacity: meta,
          transform: `translateY(${interpolate(meta, [0, 1], [26, 0], clamp)}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          zIndex: 8,
        }}
      >
        {cardLabels.slice(0, 4).map((label, index) => (
          <div
            key={label}
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              background: index === 0 ? "#226eea" : "rgba(34,110,234,0.08)",
              color: index === 0 ? "#ffffff" : "#226eea",
              fontSize: 12,
              fontWeight: 820,
              opacity: ease(frame, 60 + index * 4, 76 + index * 4),
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 812,
          top: 362,
          width: 34,
          height: 34,
          borderRadius: 999,
          background: "#ffffff",
          color: "#226eea",
          fontSize: 20,
          fontWeight: 900,
          boxShadow: "0 14px 30px rgba(27,73,128,0.18)",
          opacity: cursor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${interpolate(cursor, [0, 1], [44, 0], clamp)}px, ${interpolate(cursor, [0, 1], [32, 0], clamp)}px) scale(${interpolate(cursor, [0, 0.7, 1], [0.78, 1.08, 1], clamp)})`,
          zIndex: 9,
        }}
      >
        ↗
      </div>
    </AbsoluteFill>
  );
};
