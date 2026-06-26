import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_39_DURATION_FRAMES = 111;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const promptCopy = "Create a cute social caption for Baxter";

const typedPrompt = (frame: number) => {
  const count = Math.round(interpolate(frame, [28, 82], [0, promptCopy.length], clamp));
  return promptCopy.slice(0, count);
};

export const Shot39MobilePromptComposerFlowChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const phoneEnter = interpolate(frame, [0, 36], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const thumb = interpolate(frame, [18, 52], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const tools = interpolate(frame, [58, 94], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const send = interpolate(frame, [84, 111], [0, 1], clamp);
  const promptText = typedPrompt(frame);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #fbfdff 0%, #f5f9ff 48%, #fff8fc 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1400,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.14,
          top: height * 0.18,
          width: width * 0.34,
          height: height * 0.42,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,109,245,0.13), transparent 68%)",
          filter: "blur(14px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: width * 0.18,
          bottom: height * 0.16,
          width: width * 0.34,
          height: height * 0.34,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,75,191,0.12), transparent 70%)",
          filter: "blur(14px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.34,
          top: height * 0.04,
          width: width * 0.31,
          height: height * 0.9,
          opacity: interpolate(phoneEnter, [0, 0.12, 1], [0, 1, 1], clamp),
          transform: `translateX(${interpolate(phoneEnter, [0, 1], [90, 0], clamp)}px) rotateZ(${interpolate(phoneEnter, [0, 1], [-3, 0], clamp)}deg) scale(${interpolate(phoneEnter, [0, 1], [0.96, 1], clamp)})`,
          borderRadius: 44,
          background: "#111722",
          boxShadow: "0 34px 110px rgba(37,50,90,0.24)",
          padding: 12,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 34,
            background: "linear-gradient(180deg, #ffffff, #f7f9fd)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 24,
              right: 24,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#17202a",
              fontSize: 12,
              fontWeight: 760,
            }}
          >
            <span>9:41</span>
            <span style={{ color: "#7b8794" }}>Ask Gemini</span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 82,
              height: 54,
              borderRadius: 18,
              background: "rgba(246,248,252,0.92)",
              border: "1px solid rgba(23,32,42,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              color: "#7b8794",
              fontSize: 13,
              fontWeight: 680,
            }}
          >
            Start with a prompt or photo
          </div>

          <div
            style={{
              position: "absolute",
              left: 30,
              top: 170,
              width: 74,
              height: 74,
              borderRadius: 18,
              opacity: thumb,
              transform: `scale(${interpolate(thumb, [0, 1], [0.92, 1], clamp)})`,
              overflow: "hidden",
              background: "linear-gradient(135deg, #d8e5ff, #fff0f8)",
              border: "1px solid rgba(23,32,42,0.08)",
              boxShadow: "0 12px 30px rgba(52,72,124,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                width: 40,
                height: 30,
                borderRadius: "50%",
                background: "rgba(104,77,244,0.2)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                width: 32,
                height: 26,
                borderRadius: 10,
                background: "rgba(217,75,191,0.18)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 264,
              minHeight: 92,
              color: "#17202a",
              fontSize: 22,
              lineHeight: 1.18,
              fontWeight: 720,
              letterSpacing: 0,
            }}
          >
            {promptText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 23,
                marginLeft: 4,
                verticalAlign: -4,
                borderRadius: 2,
                background: "#684df4",
                opacity: frame % 20 < 13 && frame < 90 ? 1 : 0,
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 74,
              right: 74,
              bottom: 136,
              height: 48,
              borderRadius: 999,
              opacity: tools,
              transform: `translateY(${interpolate(tools, [0, 1], [12, 0], clamp)}px) scale(${interpolate(tools, [0, 1], [0.94, 1], clamp)})`,
              background: "rgba(232,239,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              color: "#4f5f7a",
              fontSize: 18,
              fontWeight: 840,
            }}
          >
            <span>mic</span>
            <span>cam</span>
          </div>

          <div
            style={{
              position: "absolute",
              right: 34,
              bottom: 72,
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#684df4",
              opacity: interpolate(send, [0, 1], [0.2, 1], clamp),
              boxShadow: `0 14px 40px rgba(104,77,244,${interpolate(send, [0, 1], [0, 0.24], clamp)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            ›
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
