import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_44_DURATION_FRAMES = 126;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const Shot44DualDeviceFeatureStageChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const title = interpolate(frame, [0, 38], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const mobile = interpolate(frame, [28, 82], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const desktop = interpolate(frame, [42, 96], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const content = interpolate(frame, [78, 116], [0, 1], clamp);
  const settle = interpolate(frame, [108, 126], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#08090d",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1500,
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 42%, rgba(91,109,245,0.16), transparent 30%), radial-gradient(circle at 72% 50%, rgba(217,75,191,0.14), transparent 32%)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.12,
          textAlign: "center",
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [12, 0], clamp)}px)`,
          color: "#ffffff",
          fontSize: 32,
          fontWeight: 720,
        }}
      >
        Experience <span style={{ background: "linear-gradient(90deg, #5b6df5, #d94bbf)", WebkitBackgroundClip: "text", color: "transparent", fontWeight: 850 }}>Gemini</span>
        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.42)", fontSize: 14, fontWeight: 620 }}>
          gemini.google.com
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.24,
          top: height * 0.27,
          width: width * 0.18,
          height: height * 0.58,
          opacity: interpolate(mobile, [0, 0.12, 1], [0, 1, 1], clamp),
          transform: `translateX(${interpolate(mobile, [0, 1], [-130, 0], clamp)}px) rotateZ(${interpolate(mobile, [0, 1], [-4, -1], clamp)}deg) scale(${interpolate(settle, [0, 1], [1.015, 1], clamp)})`,
          borderRadius: 36,
          background: "#111722",
          padding: 10,
          boxShadow: `0 30px 90px rgba(91,109,245,${interpolate(content, [0, 1], [0.12, 0.24], clamp)})`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 28, background: "linear-gradient(180deg, #ffffff, #f7f9fd)", overflow: "hidden", padding: 22 }}>
          <div style={{ color: "#684df4", fontSize: 18, fontWeight: 850 }}>Good morning</div>
          <div style={{ marginTop: 12, width: "82%", height: 9, borderRadius: 999, background: "rgba(23,32,42,0.1)" }} />
          <div style={{ marginTop: 9, width: "64%", height: 9, borderRadius: 999, background: "rgba(23,32,42,0.08)" }} />
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 34, height: 110, borderRadius: 22, background: "linear-gradient(135deg, rgba(104,77,244,0.14), rgba(217,75,191,0.1))", opacity: interpolate(content, [0, 1], [0.42, 1], clamp) }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: width * 0.2,
          top: height * 0.31,
          width: width * 0.36,
          height: height * 0.48,
          opacity: interpolate(desktop, [0, 0.12, 1], [0, 1, 1], clamp),
          transform: `translateX(${interpolate(desktop, [0, 1], [150, 0], clamp)}px) rotateY(${interpolate(desktop, [0, 1], [-12, -5], clamp)}deg) scale(${interpolate(settle, [0, 1], [1.015, 1], clamp)})`,
          transformOrigin: "center",
          borderRadius: 28,
          background: "linear-gradient(180deg, rgba(25,27,36,0.96), rgba(15,16,23,0.96))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `0 34px 110px rgba(217,75,191,${interpolate(content, [0, 1], [0.08, 0.2], clamp)})`,
          padding: 28,
        }}
      >
        <div style={{ color: "#ffffff", fontSize: 22, fontWeight: 820 }}>Hello, Lisa.</div>
        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.48)", fontSize: 14, fontWeight: 620 }}>How can I help you today?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28 }}>
          {[0, 1, 2, 3].map((item) => (
            <div key={item} style={{ height: 62, borderRadius: 16, background: item === 1 ? "linear-gradient(135deg, rgba(104,77,244,0.26), rgba(217,75,191,0.16))" : "rgba(255,255,255,0.07)", opacity: interpolate(content, [0, 1], [0.42, 1], clamp) }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
