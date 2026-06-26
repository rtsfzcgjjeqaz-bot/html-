import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_40_DURATION_FRAMES = 52;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const resultLines = ["Baxter is the hilltop king!", "Look who's on top of the world.", "#doglover #majestic"];

export const Shot40MobileGeneratedResultCardPopChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const copy = interpolate(frame, [6, 28], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const sparkle = interpolate(frame, [12, 24, 34], [0, 1, 0.72], clamp);
  const icons = interpolate(frame, [22, 42], [0, 1], clamp);
  const composer = interpolate(frame, [34, 52], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #fbfdff 0%, #f5f9ff 48%, #fff8fc 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1400,
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 28% 32%, rgba(91,109,245,0.12), transparent 34%), radial-gradient(circle at 70% 62%, rgba(217,75,191,0.11), transparent 32%)" }} />

      <div
        style={{
          position: "absolute",
          left: width * 0.36,
          top: height * 0.02,
          width: width * 0.3,
          height: height * 0.94,
          transform: `rotateZ(${interpolate(frame, [0, 52], [-2.2, -1.4], clamp)}deg) scale(${interpolate(frame, [0, 52], [1.01, 1], clamp)})`,
          borderRadius: 44,
          background: "#111722",
          boxShadow: "0 34px 110px rgba(37,50,90,0.24)",
          padding: 12,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 34, background: "linear-gradient(180deg, #ffffff, #f7f9fd)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 28, right: 28, top: 64, height: 176, borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg, #dbe8ff, #fff0f8)", border: "1px solid rgba(23,32,42,0.08)" }}>
            <div style={{ position: "absolute", left: 36, top: 34, width: 98, height: 78, borderRadius: "50%", background: "rgba(104,77,244,0.22)" }} />
            <div style={{ position: "absolute", right: 30, bottom: 28, width: 86, height: 62, borderRadius: 18, background: "rgba(217,75,191,0.18)" }} />
          </div>

          <div style={{ position: "absolute", left: 34, top: 284, opacity: sparkle, transform: `scale(${interpolate(sparkle, [0, 0.75, 1], [0.6, 1.12, 1], clamp)})`, color: "#684df4", fontSize: 22, fontWeight: 900 }}>
            ✦
          </div>

          <div style={{ position: "absolute", left: 64, right: 34, top: 286, opacity: copy, transform: `translateY(${interpolate(copy, [0, 1], [10, 0], clamp)}px)` }}>
            {resultLines.map((line, index) => {
              const row = interpolate(frame, [6 + index * 5, 24 + index * 5], [0, 1], clamp);
              return (
                <div
                  key={line}
                  style={{
                    opacity: row,
                    color: index === 0 ? "#17202a" : "#5c6675",
                    fontSize: index === 0 ? 18 : 13,
                    fontWeight: index === 0 ? 780 : 650,
                    lineHeight: 1.22,
                    marginTop: index === 0 ? 0 : 5,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", left: 64, top: 396, display: "flex", gap: 18, opacity: icons, transform: `translateY(${interpolate(icons, [0, 1], [8, 0], clamp)}px)` }}>
            {["like", "edit", "share"].map((item) => (
              <div key={item} style={{ width: 34, height: 30, borderRadius: 10, background: "rgba(23,32,42,0.055)", color: "#4f5f7a", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item}
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: 28, right: 28, bottom: 46, height: 54, opacity: composer, transform: `translateY(${interpolate(composer, [0, 1], [16, 0], clamp)}px)`, borderRadius: 18, background: "rgba(246,248,252,0.96)", border: "1px solid rgba(23,32,42,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", color: "#7b8794", fontSize: 12, fontWeight: 700 }}>
            <span>Ask, edit, or share a photo</span>
            <span style={{ color: "#684df4", fontWeight: 900 }}>go</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
