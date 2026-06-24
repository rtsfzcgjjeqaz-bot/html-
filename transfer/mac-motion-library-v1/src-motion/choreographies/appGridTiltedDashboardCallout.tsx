import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const SHOT_26_DURATION_FRAMES = 194;

const callouts = [
  { label: "Permission scope", x: 138, y: 124 },
  { label: "Timeline risk", x: 120, y: 214 },
  { label: "Owner handoff", x: 150, y: 304 },
  { label: "Approve release", x: 138, y: 394 },
];

export const Shot26AppGridChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const dashboardEnter = interpolate(frame, [0, 86], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dashOpacity = interpolate(dashboardEnter, [0, 0.18, 1], [0, 1, 1], clamp);
  const dashX = interpolate(dashboardEnter, [0, 1], [60, -12], clamp);
  const dashScale = interpolate(dashboardEnter, [0, 1], [0.94, 1.02], clamp);
  const dashRotate = interpolate(dashboardEnter, [0, 1], [-10, -5], clamp);

  const cursorProgress = interpolate(frame, [92, 158], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorOpacity = interpolate(frame, [92, 112, 184, 194], [0, 1, 1, 0], clamp);
  const cursorX = interpolate(cursorProgress, [0, 1], [width * 0.49, width * 0.72], clamp);
  const cursorY = interpolate(cursorProgress, [0, 1], [height * 0.62, height * 0.48], clamp);

  const buttonGlow = interpolate(frame, [142, 168, 194], [0, 0.8, 0.45], clamp);
  const buttonScale = interpolate(frame, [142, 160, 194], [1, 1.04, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#05070d",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 62% 44%, rgba(48,94,180,0.28), transparent 42%), linear-gradient(135deg, #05070d, #0b1020 58%, #05070d)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.12,
          top: height * 0.12,
          color: "#f8fbff",
          fontSize: 31,
          lineHeight: 1.12,
          fontWeight: 850,
          opacity: interpolate(frame, [8, 34], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [8, 34], [18, 0], clamp)}px)`,
        }}
      >
        Guided app walkthrough
        <div
          style={{
            marginTop: 10,
            color: "rgba(248,251,255,0.58)",
            fontSize: 17,
            fontWeight: 620,
            maxWidth: 380,
            lineHeight: 1.3,
          }}
        >
          Callouts, cursor focus, and a clear action endpoint.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: width * 0.08,
          top: height * 0.2,
          width: width * 0.62,
          height: height * 0.58,
          opacity: dashOpacity,
          transform: `translateX(${dashX}px) scale(${dashScale}) rotateY(${dashRotate}deg) rotateX(3deg)`,
          transformStyle: "preserve-3d",
          borderRadius: 28,
          background: "rgba(12,18,31,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 44px 140px rgba(0,0,0,0.42), 0 0 70px rgba(58,208,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {["#ff7474", "#ffc857", "#54d982"].map((color) => (
            <div key={color} style={{ width: 10, height: 10, borderRadius: 10, background: color }} />
          ))}
          <div style={{ marginLeft: 18, color: "#e8f0ff", fontSize: 15, fontWeight: 760 }}>
            Release Console
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", height: "calc(100% - 48px)" }}>
          <div style={{ padding: 18, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            {[0, 1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  height: 28,
                  marginBottom: 14,
                  borderRadius: 8,
                  background: item === 2 ? "rgba(58,208,255,0.2)" : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
          <div style={{ padding: 24, position: "relative" }}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 0.7fr 0.6fr",
                  gap: 14,
                  alignItems: "center",
                  height: 40,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  color: index === 4 ? "#ffffff" : "rgba(232,240,255,0.68)",
                  fontSize: 13,
                  fontWeight: 680,
                }}
              >
                <span>Workflow item {index + 1}</span>
                <span style={{ color: index === 4 ? "#3ad0ff" : "rgba(232,240,255,0.55)" }}>
                  {index === 4 ? "Ready" : "Review"}
                </span>
                <span>{48 + index * 7}%</span>
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                right: 36,
                top: 190,
                width: 134,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(90deg, #22c55e, #3ad0ff)",
                color: "#06111c",
                fontSize: 14,
                fontWeight: 880,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${buttonScale})`,
                boxShadow: `0 0 ${buttonGlow * 42}px rgba(58,208,255,${buttonGlow})`,
              }}
            >
              Approve
            </div>
          </div>
        </div>
      </div>

      {callouts.map((callout, index) => {
        const start = 38 + index * 10;
        const enter = interpolate(frame, [start, start + 24], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={callout.label}
            style={{
              position: "absolute",
              left: callout.x,
              top: callout.y,
              opacity: enter,
              transform: `translateX(${interpolate(enter, [0, 1], [-34, 0], clamp)}px)`,
              padding: "10px 14px",
              borderRadius: 999,
              color: "#f8fbff",
              fontSize: 15,
              fontWeight: 760,
              background: "rgba(14,21,36,0.88)",
              border: "1px solid rgba(58,208,255,0.3)",
              boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
            }}
          >
            {callout.label}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorOpacity,
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "18px solid #f8fbff",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            transform: "rotate(36deg)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
