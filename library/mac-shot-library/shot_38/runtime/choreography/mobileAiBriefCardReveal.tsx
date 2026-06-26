import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_38_DURATION_FRAMES = 189;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const briefRows = [0.82, 0.68, 0.9];

export const Shot38MobileAiBriefCardRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const headline = interpolate(frame, [0, 54], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const phoneEnter = interpolate(frame, [42, 104], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const greeting = interpolate(frame, [82, 130], [0, 1], clamp);
  const card = interpolate(frame, [110, 166], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const media = interpolate(frame, [142, 188], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camera = interpolate(frame, [0, SHOT_38_DURATION_FRAMES], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #fbfdff 0%, #f5f9ff 44%, #fff7fb 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1500,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.18,
          top: height * 0.16,
          width: width * 0.42,
          height: height * 0.42,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,109,245,0.14), transparent 68%)",
          filter: "blur(12px)",
          transform: `translateX(${interpolate(camera, [0, 1], [-18, 16], clamp)}px)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: width * 0.12,
          bottom: height * 0.1,
          width: width * 0.36,
          height: height * 0.34,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,75,191,0.12), transparent 70%)",
          filter: "blur(14px)",
          transform: `translateX(${interpolate(camera, [0, 1], [20, -12], clamp)}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width * 0.18,
          top: height * 0.31,
          opacity: interpolate(frame, [0, 54, 104], [0, 1, 0.2], clamp),
          transform: `translateY(${interpolate(headline, [0, 1], [12, 0], clamp)}px)`,
          color: "#17202a",
          fontSize: 28,
          fontWeight: 650,
          letterSpacing: 0,
          whiteSpace: "nowrap",
        }}
      >
        Designed to{" "}
        <span
          style={{
            fontWeight: 840,
            background: "linear-gradient(90deg, #5b6df5, #d94bbf)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          supercharge
        </span>{" "}
        your ideas
      </div>

      <div
        style={{
          position: "absolute",
          right: width * 0.2,
          top: height * 0.08,
          width: width * 0.25,
          height: height * 0.8,
          opacity: interpolate(phoneEnter, [0, 0.15, 1], [0, 1, 1], clamp),
          transform: `translateX(${interpolate(phoneEnter, [0, 1], [210, 0], clamp)}px) rotateY(${interpolate(phoneEnter, [0, 1], [-16, -7], clamp)}deg) rotateZ(${interpolate(phoneEnter, [0, 1], [-7, -2], clamp)}deg) scale(${interpolate(phoneEnter, [0, 1], [0.9, 1], clamp)})`,
          transformOrigin: "center",
          transformStyle: "preserve-3d",
          borderRadius: 42,
          background: "#111722",
          boxShadow: "0 34px 100px rgba(37,50,90,0.24)",
          padding: 12,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 32,
            background: "linear-gradient(180deg, #ffffff, #f7f9fd)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 10,
              width: 54,
              height: 12,
              marginLeft: -27,
              borderRadius: 999,
              background: "#111722",
              opacity: 0.92,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 62,
              opacity: greeting,
              transform: `translateY(${interpolate(greeting, [0, 1], [12, 0], clamp)}px)`,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 830,
                lineHeight: 1.08,
                background: "linear-gradient(90deg, #5b6df5, #d94bbf)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Good morning
            </div>
            <div style={{ marginTop: 10, color: "#596574", fontSize: 12, lineHeight: 1.35, fontWeight: 650 }}>
              Find ideas, polish notes, and build a clear next action.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              top: 154,
              height: 150,
              opacity: card,
              transform: `scale(${interpolate(card, [0, 1], [0.94, 1], clamp)})`,
              transformOrigin: "top center",
              borderRadius: 22,
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(23,32,42,0.08)",
              boxShadow: "0 18px 46px rgba(52,72,124,0.13)",
              padding: 18,
            }}
          >
            <div style={{ color: "#17202a", fontSize: 15, fontWeight: 830, marginBottom: 14 }}>
              AI brief
            </div>
            {briefRows.map((row, index) => {
              const rowReveal = interpolate(frame, [128 + index * 8, 150 + index * 8], [0, 1], clamp);
              return (
                <div
                  key={index}
                  style={{
                    width: `${row * 100}%`,
                    height: index === 0 ? 12 : 9,
                    marginTop: index === 0 ? 0 : 10,
                    borderRadius: 999,
                    opacity: rowReveal,
                    transform: `translateY(${interpolate(rowReveal, [0, 1], [8, 0], clamp)}px)`,
                    background: index === 0 ? "rgba(104,77,244,0.25)" : "rgba(23,32,42,0.09)",
                  }}
                />
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 26,
              height: 168,
              borderRadius: 24,
              overflow: "hidden",
              opacity: media,
              transform: `translateY(${interpolate(media, [0, 1], [34, 0], clamp)}px)`,
              background: "linear-gradient(135deg, #e9efff, #fff0f9)",
              border: "1px solid rgba(23,32,42,0.07)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 36% 30%, rgba(104,77,244,0.26), transparent 34%), radial-gradient(circle at 70% 62%, rgba(217,75,191,0.18), transparent 34%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                bottom: 18,
                height: 34,
                borderRadius: 999,
                background: "rgba(255,255,255,0.78)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                color: "#17202a",
                fontSize: 11,
                fontWeight: 760,
              }}
            >
              <span>Ready to share</span>
              <span style={{ color: "#684df4" }}>Use</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
