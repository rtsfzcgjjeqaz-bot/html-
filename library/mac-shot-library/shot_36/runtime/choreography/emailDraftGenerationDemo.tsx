import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_36_DURATION_FRAMES = 288;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const rows = [
  { width: 0.78, accent: true },
  { width: 0.92 },
  { width: 0.84 },
  { width: 0.7 },
  { width: 0.88 },
];

const typedPrompt = (frame: number) => {
  const copy = "Summarize my campaign notes";
  const count = Math.round(interpolate(frame, [24, 96], [0, copy.length], clamp));
  return copy.slice(0, count);
};

export const Shot36EmailDraftGenerationDemoChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const promptEnter = interpolate(frame, [0, 56], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const workspaceEnter = interpolate(frame, [68, 136], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camera = interpolate(frame, [0, SHOT_36_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const promptText = typedPrompt(frame);
  const ghostOpacity = interpolate(frame, [0, 36, 98], [0.34, 0.18, 0], clamp);
  const promptWidth = interpolate(promptEnter, [0, 1], [width * 0.22, width * 0.47], clamp);
  const promptY = interpolate(frame, [0, 126], [height * 0.45, height * 0.17], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const workspaceOpacity = interpolate(workspaceEnter, [0, 0.14, 1], [0, 1, 1], clamp);
  const panelScale = interpolate(camera, [0, 1], [0.96, 1.02], clamp);
  const railEnter = interpolate(frame, [174, 250], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const finalGlow = interpolate(frame, [180, 238, 288], [0.08, 0.26, 0.14], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #fbfcff 0%, #f5f9ff 42%, #fff8fb 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.05,
          top: height * 0.23,
          width: width * 0.5,
          height: height * 0.2,
          opacity: ghostOpacity,
          transform: `translateX(${interpolate(frame, [0, 98], [-80, 46], clamp)}px) skewX(-8deg)`,
          color: "#7a6df0",
          fontSize: 46,
          fontWeight: 780,
          filter: "blur(2px)",
          whiteSpace: "nowrap",
        }}
      >
        It&apos;s everything
      </div>

      <div
        style={{
          position: "absolute",
          left: (width - promptWidth) / 2,
          top: promptY,
          width: promptWidth,
          height: 54,
          opacity: promptEnter,
          borderRadius: 14,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(23,32,42,0.08)",
          boxShadow: "0 18px 50px rgba(77,91,128,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          color: "#17202a",
          fontSize: 18,
          fontWeight: 660,
          transform: `translateY(${interpolate(promptEnter, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <span style={{ color: promptText ? "#17202a" : "#95a0aa" }}>
          {promptText || "Ask Gemini to write..."}
        </span>
        <span
          style={{
            width: 2,
            height: 22,
            marginLeft: 4,
            borderRadius: 2,
            background: "#684df4",
            opacity: frame % 24 < 15 ? 1 : 0.12,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.12,
          top: height * 0.28,
          width: width * 0.76,
          height: height * 0.58,
          opacity: workspaceOpacity,
          transform: `translateX(${interpolate(workspaceEnter, [0, 1], [180, 0], clamp)}px) rotateY(${interpolate(workspaceEnter, [0, 1], [12, 0], clamp)}deg) rotateZ(${interpolate(workspaceEnter, [0, 1], [1.4, 0], clamp)}deg) scale(${panelScale})`,
          transformOrigin: "center",
          transformStyle: "preserve-3d",
          borderRadius: 28,
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(23,32,42,0.08)",
          boxShadow: `0 34px 96px rgba(62,80,130,0.16), 0 0 80px rgba(104,77,244,${finalGlow})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 58,
            borderBottom: "1px solid rgba(23,32,42,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: "#f0f3f8" }} />
            <div style={{ color: "#17202a", fontSize: 18, fontWeight: 760 }}>Gmail draft</div>
          </div>
          <div style={{ color: "#7b8794", fontSize: 14, fontWeight: 640 }}>Drafts</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 32,
            top: 92,
            width: width * 0.43,
          }}
        >
          <div style={{ color: "#17202a", fontSize: 24, fontWeight: 820, marginBottom: 18 }}>
            Newsletter summary
          </div>
          {rows.map((row, index) => {
            const reveal = interpolate(frame, [112 + index * 10, 144 + index * 10], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div
                key={index}
                style={{
                  width: `${row.width * 100}%`,
                  height: index === 0 ? 16 : 12,
                  marginTop: index === 0 ? 0 : 13,
                  borderRadius: 999,
                  opacity: reveal,
                  transform: `translateY(${interpolate(reveal, [0, 1], [10, 0], clamp)}px)`,
                  background: row.accent ? "rgba(104,77,244,0.28)" : "rgba(23,32,42,0.1)",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            right: 28,
            top: 88,
            width: width * 0.25,
            height: height * 0.38,
            borderRadius: 22,
            background: "linear-gradient(180deg, rgba(246,248,252,0.96), rgba(255,255,255,0.94))",
            border: "1px solid rgba(23,32,42,0.08)",
            opacity: railEnter,
            transform: `translateX(${interpolate(railEnter, [0, 1], [28, 0], clamp)}px)`,
            padding: 22,
          }}
        >
          <div style={{ color: "#684df4", fontSize: 14, fontWeight: 820, marginBottom: 16 }}>
            AI suggestion
          </div>
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              style={{
                height: item === 0 ? 54 : 38,
                borderRadius: 14,
                marginTop: item === 0 ? 0 : 12,
                background:
                  item === 0
                    ? "linear-gradient(135deg, rgba(104,77,244,0.16), rgba(217,75,191,0.12))"
                    : "rgba(23,32,42,0.055)",
                border: item === 0 ? "1px solid rgba(104,77,244,0.13)" : "1px solid rgba(23,32,42,0.04)",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
