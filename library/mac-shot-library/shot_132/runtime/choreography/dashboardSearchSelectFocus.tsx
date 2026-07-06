import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_132_DURATION_FRAMES = 84;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  query?: string;
  activeTitle?: string;
  resultLabels?: string[];
};

export const Shot132DashboardSearchSelectFocusChoreography: React.FC<Props> = ({
  query = "translated video",
  activeTitle = "Launch clip",
  resultLabels = ["Draft", "Ready", "Social"],
}) => {
  const frame = useCurrentFrame();
  const panel = ease(frame, 0, 22);
  const queryIn = ease(frame, 14, 42);
  const rows = ease(frame, 24, 54);
  const highlight = ease(frame, 34, 62);
  const cursor = ease(frame, 38, 66);
  const lift = ease(frame, 52, 80);
  const hold = ease(frame, 76, 84);
  const typedChars = Math.max(1, Math.round(interpolate(queryIn, [0, 1], [1, query.length], clamp)));

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
            "radial-gradient(circle at 54% 42%, rgba(45,155,220,0.13), transparent 26%), radial-gradient(circle at 78% 74%, rgba(115,87,255,0.10), transparent 24%), linear-gradient(180deg,#ffffff 0%,#f4f8ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 202,
          top: 92,
          width: 876,
          height: 520,
          borderRadius: 36,
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(45,155,220,0.16)",
          boxShadow: "0 44px 120px rgba(40,72,120,0.12)",
          opacity: 0.16 + panel * 0.84,
          transform: `translateY(${interpolate(panel, [0, 1], [42, 0], clamp)}px) scale(${interpolate(panel, [0, 1], [0.97, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 30, fontSize: 22, fontWeight: 850 }}>
          Search assets
        </div>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 82,
            width: 804,
            height: 62,
            borderRadius: 20,
            background: "#ffffff",
            border: "1px solid rgba(45,155,220,0.20)",
            boxShadow: "0 18px 48px rgba(45,90,150,0.08)",
            opacity: panel,
          }}
        >
          <div style={{ position: "absolute", left: 22, top: 18, fontSize: 22, color: "#226eea", fontWeight: 900 }}>⌕</div>
          <div style={{ position: "absolute", left: 60, top: 19, fontSize: 20, fontWeight: 720, color: "#374151" }}>
            {query.slice(0, typedChars)}
          </div>
          <div style={{ position: "absolute", right: 18, top: 16, width: 78, height: 30, borderRadius: 999, background: "#226eea", opacity: queryIn }} />
        </div>
        {[0, 1, 2].map((index) => {
          const rowIn = ease(frame, 24 + index * 5, 46 + index * 5);
          const active = index === 1;
          const activeAmount = active ? highlight : 0;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: 54,
                top: 184 + index * 94,
                width: 748,
                height: 76,
                borderRadius: 22,
                background: "#ffffff",
                border: active ? "2px solid rgba(34,110,234,0.54)" : "1px solid rgba(45,155,220,0.12)",
                boxShadow: active
                  ? `0 ${interpolate(activeAmount, [0, 1], [18, 34], clamp)}px 80px rgba(43,121,232,0.17)`
                  : "0 16px 44px rgba(39,67,110,0.07)",
                opacity: rows * rowIn,
                transform: `translateX(${interpolate(rowIn, [0, 1], [34, 0], clamp)}px) translateY(${active ? -lift * 10 : 0}px) scale(${active ? interpolate(lift, [0, 1], [1, 1.04], clamp) : 1})`,
                zIndex: active ? 4 : 1,
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 14, width: 72, height: 48, borderRadius: 14, background: active ? "linear-gradient(135deg,#4aa9ff,#7357ff)" : "linear-gradient(135deg,#dff0ff,#b8c6e8)" }} />
              <div style={{ position: "absolute", left: 112, top: 18, width: active ? 180 : 150, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.16)" }} />
              <div style={{ position: "absolute", left: 112, top: 44, width: active ? 110 : 88, height: 10, borderRadius: 999, background: "rgba(45,155,220,0.18)" }} />
              <div style={{ position: "absolute", right: 28, top: 24, fontSize: 17, fontWeight: 820, color: active ? "#226eea" : "#6b7280", opacity: active ? highlight : 0.7 }}>
                {active ? activeTitle : resultLabels[index] ?? "Result"}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 828,
          top: 348,
          width: 38,
          height: 38,
          borderRadius: 999,
          background: "#ffffff",
          color: "#226eea",
          fontSize: 22,
          fontWeight: 900,
          boxShadow: "0 16px 34px rgba(27,73,128,0.20)",
          opacity: cursor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${interpolate(cursor, [0, 1], [46, 0], clamp)}px, ${interpolate(cursor, [0, 1], [32, 0], clamp)}px) scale(${interpolate(cursor, [0, 0.72, 1], [0.76, 1.1, 1], clamp)})`,
          zIndex: 9,
        }}
      >
        ↗
      </div>
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 332,
          width: 94,
          height: 94,
          borderRadius: 999,
          border: "2px solid rgba(34,110,234,0.20)",
          opacity: cursor * interpolate(hold, [0, 1], [0.6, 0.4], clamp),
          transform: `scale(${interpolate(cursor, [0, 1], [0.78, 1.16], clamp)})`,
        }}
      />
    </AbsoluteFill>
  );
};
