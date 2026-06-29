import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_76_DURATION_FRAMES = 85;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const AssistantChrome: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <>
    <div style={{ position: "absolute", left: compact ? 12 : 18, top: compact ? 10 : 14, color: "rgba(245,248,255,0.72)", fontSize: compact ? 9 : 12, fontWeight: 760 }}>
      Gemini
    </div>
    <div style={{ position: "absolute", left: compact ? 12 : 18, bottom: compact ? 12 : 18, width: compact ? 46 : 82, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.18)" }} />
    <div style={{ position: "absolute", right: compact ? 10 : 16, top: compact ? 10 : 14, width: compact ? 8 : 10, height: compact ? 8 : 10, borderRadius: 999, background: "#4986ff", boxShadow: "0 0 18px rgba(73,134,255,0.8)" }} />
  </>
);

export const Shot76DarkAssistantDeviceHeroChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stage = ease(frame, 0, 18);
  const desktop = ease(frame, 6, 42);
  const phone = ease(frame, 16, 52);
  const greeting = ease(frame, 22, 56);
  const copy = ease(frame, 44, 68);
  const cta = ease(frame, 52, 74);
  const camera = interpolate(frame, [0, SHOT_76_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#02040a",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: stage,
          background:
            "radial-gradient(circle at 46% 40%, rgba(72, 132, 255, 0.26), transparent 32%), radial-gradient(circle at 78% 54%, rgba(147, 94, 255, 0.18), transparent 38%), linear-gradient(180deg, #061022 0%, #02040a 76%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${interpolate(camera, [0, 1], [0.985, 1.018], clamp)}) translateY(${interpolate(camera, [0, 1], [8, 0], clamp)}px)`,
          transformOrigin: "center 48%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 260,
            top: 86,
            width: 620,
            height: 360,
            opacity: desktop,
            transform: `translateX(${interpolate(desktop, [0, 1], [-54, 0], clamp)}px) rotateY(${interpolate(desktop, [0, 1], [8, 0], clamp)}deg) scale(${interpolate(desktop, [0, 1], [0.92, 1], clamp)})`,
            transformStyle: "preserve-3d",
            borderRadius: 26,
            background: "linear-gradient(180deg, rgba(18,22,30,0.98), rgba(6,8,14,0.98))",
            border: "1px solid rgba(171, 205, 255, 0.22)",
            boxShadow: "0 36px 110px rgba(0,0,0,0.56), 0 0 46px rgba(64,122,255,0.26)",
            overflow: "hidden",
          }}
        >
          <AssistantChrome />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: greeting,
              transform: `translateY(${interpolate(greeting, [0, 1], [12, 0], clamp)}px)`,
              fontSize: 42,
              fontWeight: 840,
              letterSpacing: 0,
              background: "linear-gradient(90deg, #4fa4ff, #8f64ff, #d7e4ff)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Hello, Teresa
          </div>
          <div aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 3, background: "linear-gradient(90deg, transparent, #4b8cff, #875cff, transparent)" }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 838,
            top: 118,
            width: 150,
            height: 300,
            opacity: phone,
            transform: `translateX(${interpolate(phone, [0, 1], [44, 0], clamp)}px) scale(${interpolate(phone, [0, 1], [0.9, 1], clamp)})`,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(20,24,34,0.98), rgba(6,8,13,0.98))",
            border: "1px solid rgba(171, 205, 255, 0.24)",
            boxShadow: "0 30px 88px rgba(0,0,0,0.5), 0 0 36px rgba(82,135,255,0.3)",
            overflow: "hidden",
          }}
        >
          <AssistantChrome compact />
          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: 128,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 820,
              background: "linear-gradient(90deg, #4fa4ff, #8f64ff, #d7e4ff)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Hello, Teresa
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 298,
            top: 514,
            opacity: copy,
            transform: `translateY(${interpolate(copy, [0, 1], [12, 0], clamp)}px)`,
            color: "#f7f9ff",
            fontSize: 24,
            fontWeight: 760,
            letterSpacing: 0,
          }}
        >
          Your <span style={{ color: "#7b8cff" }}>AI</span> assistant from Google
        </div>
        <div
          style={{
            position: "absolute",
            right: 310,
            top: 502,
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [12, 0], clamp)}px)`,
            height: 58,
            padding: "0 24px",
            borderRadius: 18,
            background: "rgba(13, 18, 31, 0.92)",
            border: "1px solid rgba(154,190,255,0.42)",
            boxShadow: "0 0 32px rgba(90,126,255,0.46)",
            color: "#f5f8ff",
            display: "flex",
            alignItems: "center",
            gap: 11,
            fontSize: 20,
            fontWeight: 760,
          }}
        >
          <span style={{ width: 16, height: 16, borderRadius: 4, background: "linear-gradient(135deg, #6ea2ff, #9e64ff)" }} />
          Canvas
        </div>
      </div>
    </AbsoluteFill>
  );
};
