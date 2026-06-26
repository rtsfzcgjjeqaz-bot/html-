import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_35_DURATION_FRAMES = 188;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const Shot35WebsiteHeroAngledProductSurfaceChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const enter = interpolate(frame, [0, 64], [0.62, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camera = interpolate(frame, [0, SHOT_35_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const panelX = interpolate(enter, [0, 1], [width * 0.24, width * 0.08], clamp);
  const panelY = interpolate(enter, [0, 1], [height * 0.08, height * 0.04], clamp);
  const panelOpacity = interpolate(enter, [0, 0.16, 1], [0, 1, 1], clamp);
  const panelScale = interpolate(camera, [0, 1], [0.97, 1.035], clamp);
  const sidebarReveal = interpolate(frame, [0, 76], [0.45, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const titleOpacity = interpolate(frame, [42, 86], [0, 1], clamp);
  const contentFade = interpolate(frame, [72, 132], [0, 1], clamp);
  const edgeGlow = interpolate(frame, [28, 110, 188], [0, 0.44, 0.22], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #fbfdff 0%, #f6f9ff 48%, #fff8fc 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        perspective: 1400,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.12,
          width: width * 0.36,
          height: height * 0.42,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,109,245,0.15), transparent 70%)",
          filter: "blur(12px)",
          transform: `translateX(${interpolate(camera, [0, 1], [-18, 18], clamp)}px)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: width * 0.06,
          bottom: height * 0.12,
          width: width * 0.38,
          height: height * 0.36,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,75,191,0.12), transparent 70%)",
          filter: "blur(14px)",
          transform: `translateX(${interpolate(camera, [0, 1], [20, -18], clamp)}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: panelX,
          top: panelY,
          width: width * 0.78,
          height: height * 0.84,
          opacity: panelOpacity,
          transform: `rotateY(${interpolate(enter, [0, 1], [-14, -7], clamp)}deg) rotateZ(${interpolate(enter, [0, 1], [-1.8, -0.8], clamp)}deg) scale(${panelScale})`,
          transformOrigin: "center",
          transformStyle: "preserve-3d",
          borderRadius: 30,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(23,32,42,0.08)",
          boxShadow: `0 34px 120px rgba(62,80,130,0.16), 0 0 ${edgeGlow * 80}px rgba(104,77,244,${edgeGlow})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 86,
            background: "linear-gradient(180deg, #ffffff, #f2f5fb)",
            borderRight: "1px solid rgba(23,32,42,0.08)",
            transform: `translateX(${interpolate(sidebarReveal, [0, 1], [-34, 0], clamp)}px)`,
            opacity: sidebarReveal,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 6, background: "#eef2f8", margin: "28px auto" }} />
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                margin: "18px auto",
                background: item === 1 ? "rgba(104,77,244,0.16)" : "#eef2f8",
              }}
            />
          ))}
        </div>

        <div style={{ position: "absolute", left: 86, top: 0, right: 0, bottom: 0 }}>
          <div
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 34px",
              borderBottom: "1px solid rgba(23,32,42,0.07)",
              color: "#17202a",
              fontSize: 22,
              fontWeight: 760,
              opacity: titleOpacity,
              transform: `translateY(${interpolate(titleOpacity, [0, 1], [10, 0], clamp)}px)`,
            }}
          >
            <span>Gemini</span>
            <span style={{ color: "#7b8794", fontSize: 18, fontWeight: 620 }}>workspace</span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 34,
              top: 112,
              width: width * 0.32,
              opacity: contentFade,
              transform: `translateY(${interpolate(contentFade, [0, 1], [16, 0], clamp)}px)`,
            }}
          >
            <div style={{ color: "#17202a", fontSize: 32, fontWeight: 820, lineHeight: 1.12 }}>
              Ask, create, and refine
            </div>
            <div style={{ marginTop: 16, color: "#62717f", fontSize: 18, lineHeight: 1.32, fontWeight: 620 }}>
              A clean product surface designed for a focused first impression.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: 42,
              bottom: 44,
              width: width * 0.31,
              height: 118,
              borderRadius: 24,
              background: "linear-gradient(135deg, rgba(104,77,244,0.08), rgba(217,75,191,0.08))",
              border: "1px solid rgba(104,77,244,0.14)",
              opacity: interpolate(frame, [104, 154], [0, 1], clamp),
              transform: `translateY(${interpolate(frame, [104, 154], [24, 0], clamp)}px)`,
            }}
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  height: 13,
                  width: `${72 - row * 12}%`,
                  marginLeft: 24,
                  marginTop: row === 0 ? 26 : 14,
                  borderRadius: 999,
                  background: row === 0 ? "rgba(104,77,244,0.28)" : "rgba(23,32,42,0.08)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
